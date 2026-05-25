export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname === '/api/fortune' && request.method === 'POST') {
            return handleFortune(request, env);
        }

        if (url.pathname === '/api/bagua' && request.method === 'GET') {
            return new Response(JSON.stringify(BAGUA), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (url.pathname === '/' || url.pathname === '/index') {
            return new Response(INDEX_HTML, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        return new Response('Not Found', { status: 404 });
    }
};

const BAGUA = {
    '乾': {'symbol': '☰', 'nature': '天', 'direction': '西北', 'meaning': '刚健、自强不息', 'lines': [1, 1, 1]},
    '坤': {'symbol': '☷', 'nature': '地', 'direction': '西南', 'meaning': '柔顺、厚德载物', 'lines': [0, 0, 0]},
    '震': {'symbol': '☳', 'nature': '雷', 'direction': '东', 'meaning': '震动、奋发', 'lines': [1, 0, 0]},
    '巽': {'symbol': '☴', 'nature': '风', 'direction': '东南', 'meaning': '渗入、谦逊', 'lines': [0, 1, 0]},
    '坎': {'symbol': '☵', 'nature': '水', 'direction': '北', 'meaning': '险陷、智慧', 'lines': [0, 1, 1]},
    '离': {'symbol': '☲', 'nature': '火', 'direction': '南', 'meaning': '光明、美丽', 'lines': [1, 0, 1]},
    '艮': {'symbol': '☶', 'nature': '山', 'direction': '东北', 'meaning': '停止、稳重', 'lines': [1, 1, 0]},
    '兑': {'symbol': '☱', 'nature': '泽', 'direction': '西', 'meaning': '喜悦、言语', 'lines': [0, 0, 1]},
};

const HEXAGRAMS = {
    '乾坤': {'name': '天地否', 'judgement': '凶', 'meaning': '天地不通，阴阳不合。诸事不顺，需守正等待时机。'},
    '坤乾': {'name': '地天泰', 'judgement': '大吉', 'meaning': '天地交泰，阴阳相合。诸事亨通，国泰民安。'},
};

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function getRandomFromSeed(seed, array) {
    const index = seed % array.length;
    return array[index];
}

function generateHexagram(userInput) {
    const guaNames = Object.keys(BAGUA);
    const seed = hashCode(userInput);

    const gua1 = getRandomFromSeed(seed, guaNames);
    const gua2 = getRandomFromSeed(seed + 1, guaNames);

    const key = gua1 + gua2;
    let hexInfo = HEXAGRAMS[key] || {
        'name': `${gua1}${gua2}`,
        'judgement': '平',
        'meaning': `${BAGUA[gua1].meaning}上，${BAGUA[gua2].meaning}下，相辅相成。`
    };

    return {
        upper: gua1,
        lower: gua2,
        upper_symbol: BAGUA[gua1].symbol,
        lower_symbol: BAGUA[gua2].symbol,
        upper_nature: BAGUA[gua1].nature,
        lower_nature: BAGUA[gua2].nature,
        upper_direction: BAGUA[gua1].direction,
        lower_direction: BAGUA[gua2].direction,
        lines: [...BAGUA[gua1].lines, ...BAGUA[gua2].lines],
        ...hexInfo
    };
}

async function callDeepSeekAPI(prompt, apiKey) {
    if (!apiKey) {
        return '请配置DeepSeek API密钥以获取详细卦象解释。';
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一位精通易经的算命大师，善于解读卦象，解释深刻而富有智慧。请用简洁优美的语言解释卦象含义，结合用户的问题给出建议。'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        const result = await response.json();
        return result.choices[0].message.content;
    } catch (e) {
        return 'API调用出错，请稍后重试。';
    }
}

async function handleFortune(request, env) {
    try {
        const data = await request.json();
        const name = (data.name || '').trim();
        const question = (data.question || '').trim();
        const birthTime = (data.birthTime || '').trim();

        if (!name) {
            return new Response(JSON.stringify({ error: '请输入您的姓名' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userInput = `${name}${question}${birthTime}${Date.now()}`;
        const hexagram = generateHexagram(userInput);
        hexagram.name_input = name;
        hexagram.question = question;

        const prompt = `用户姓名：${name}
用户问题：${question}
出生时辰：${birthTime || '未提供'}

卦象信息：
- 卦名：${hexagram.name}
- 上卦：${hexagram.upper}（${hexagram.upper_nature}，方向${hexagram.upper_direction}）
- 下卦：${hexagram.lower}（${hexagram.lower_nature}，方向${hexagram.lower_direction}）
- 卦辞：${hexagram.judgement}
- 卦意：${hexagram.meaning}

请结合易经智慧和用户的问题，给出详细的卦象解读和建议。`;

        const explanation = await callDeepSeekAPI(prompt, 'REDACTED_DEEPSEEK_KEY');
        hexagram.explanation = explanation;

        return new Response(JSON.stringify(hexagram), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: '请求处理出错' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="易经算命系统，基于DeepSeek AI智能解读卦象">
    <title>易经算命 | 卦象解读</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #e8e8e8;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 2rem; color: #ffd700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.3); margin-bottom: 8px; }
        .header p { color: #a0a0a0; font-size: 0.9rem; }
        .card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; color: #c0c0c0; font-size: 0.9rem; }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: #ffd700;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
        }
        .form-group textarea { resize: vertical; min-height: 80px; }
        .form-group input::placeholder, .form-group textarea::placeholder { color: #666; }
        .btn {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
            color: #1a1a2e;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .result { display: none; }
        .result.show { display: block; }
        .hexagram-display { text-align: center; margin-bottom: 24px; }
        .hexagram-symbols { display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 16px; }
        .trigram { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .trigram-symbol { font-size: 3rem; color: #ffd700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
        .trigram-name { font-size: 1.2rem; color: #e0e0e0; }
        .trigram-nature { font-size: 0.85rem; color: #888; }
        .divider { font-size: 2rem; color: rgba(255, 255, 255, 0.3); }
        .hexagram-lines { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 16px; }
        .hexagram-lines .line { display: flex; gap: 4px; }
        .hexagram-lines .yao { width: 40px; height: 8px; border-radius: 4px; }
        .hexagram-lines .yao.yang { background: linear-gradient(90deg, #ffd700, #ffaa00); }
        .hexagram-lines .yao.yin { background: linear-gradient(90deg, #4a4a6a, #3a3a5a); position: relative; }
        .hexagram-lines .yao.yin::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 16px; height: 2px; background: #1a1a2e; border-radius: 1px; }
        .hexagram-name-result { font-size: 1.5rem; color: #ffd700; margin: 16px 0 8px; }
        .judgement { display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 0.9rem; margin-bottom: 16px; }
        .judgement.daji { background: rgba(76, 175, 80, 0.2); color: #81c784; border: 1px solid rgba(76, 175, 80, 0.3); }
        .judgement.xiong { background: rgba(244, 67, 54, 0.2); color: #e57373; border: 1px solid rgba(244, 67, 54, 0.3); }
        .judgement.ping { background: rgba(255, 193, 7, 0.2); color: #ffd54f; border: 1px solid rgba(255, 193, 7, 0.3); }
        .meaning { color: #b0b0b0; font-size: 0.95rem; line-height: 1.8; padding: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; margin-bottom: 16px; }
        .explanation { color: #d0d0d0; font-size: 0.95rem; line-height: 1.9; padding: 20px; background: rgba(255, 215, 0, 0.05); border-radius: 10px; border-left: 3px solid #ffd700; }
        .explanation-title { color: #ffd700; font-size: 1rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .loading { display: none; text-align: center; padding: 40px; }
        .loading.show { display: block; }
        .loading-spinner { width: 50px; height: 50px; border: 3px solid rgba(255, 215, 0, 0.2); border-top-color: #ffd700; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading p { color: #a0a0a0; }
        .error { color: #e57373; text-align: center; padding: 16px; background: rgba(244, 67, 54, 0.1); border-radius: 10px; display: none; }
        .error.show { display: block; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.8rem; }
        @media (max-width: 480px) {
            .container { padding: 16px; }
            .header h1 { font-size: 1.6rem; }
            .card { padding: 18px; }
            .trigram-symbol { font-size: 2.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>☰ 易经算命 ☷</h1>
            <p>静心凝神，洞察天机</p>
        </div>
        <div class="card" id="formCard">
            <form id="fortuneForm">
                <div class="form-group">
                    <label for="name">您的姓名</label>
                    <input type="text" id="name" name="name" placeholder="请输入姓名" required>
                </div>
                <div class="form-group">
                    <label for="question">您想问的事情</label>
                    <textarea id="question" name="question" placeholder="例如：事业发展、感情运势、财运走向..." required></textarea>
                </div>
                <div class="form-group">
                    <label for="birthTime">出生时辰（可选）</label>
                    <input type="text" id="birthTime" name="birthTime" placeholder="例如：子时、卯时">
                </div>
                <button type="submit" class="btn btn-primary" id="submitBtn">开始算命</button>
            </form>
        </div>
        <div class="loading" id="loading">
            <div class="loading-spinner"></div>
            <p>大师正在为您解读卦象...</p>
        </div>
        <div class="error" id="error"></div>
        <div class="card result" id="result">
            <div class="hexagram-display">
                <div class="hexagram-symbols">
                    <div class="trigram">
                        <span class="trigram-symbol" id="upperSymbol">☰</span>
                        <span class="trigram-name" id="upperName">乾</span>
                        <span class="trigram-nature" id="upperNature">天 · 西北</span>
                    </div>
                    <span class="divider">☰</span>
                    <div class="trigram">
                        <span class="trigram-symbol" id="lowerSymbol">☷</span>
                        <span class="trigram-name" id="lowerName">坤</span>
                        <span class="trigram-nature" id="lowerNature">地 · 西南</span>
                    </div>
                </div>
                <div class="hexagram-lines" id="hexagramLines"></div>
                <div class="hexagram-name-result" id="hexagramName"></div>
                <span class="judgement" id="judgement"></span>
                <div class="meaning" id="meaning"></div>
            </div>
            <div class="explanation">
                <div class="explanation-title">✦ 大师解读 ✦</div>
                <div id="explanation"></div>
            </div>
            <button class="btn btn-primary" onclick="resetForm()" style="margin-top: 20px;">再次算命</button>
        </div>
        <div class="footer"><p>本系统仅供娱乐参考</p></div>
    </div>
    <script>
        const form = document.getElementById('fortuneForm');
        const formCard = document.getElementById('formCard');
        const loading = document.getElementById('loading');
        const result = document.getElementById('result');
        const errorEl = document.getElementById('error');
        const submitBtn = document.getElementById('submitBtn');

        function showLoading() {
            formCard.style.display = 'none';
            result.classList.remove('show');
            errorEl.classList.remove('show');
            loading.classList.add('show');
        }

        function showResult(data) {
            loading.classList.remove('show');
            result.classList.add('show');
            document.getElementById('upperSymbol').textContent = data.upper_symbol;
            document.getElementById('upperName').textContent = data.upper;
            document.getElementById('upperNature').textContent = data.upper_nature + ' · ' + data.upper_direction;
            document.getElementById('lowerSymbol').textContent = data.lower_symbol;
            document.getElementById('lowerName').textContent = data.lower;
            document.getElementById('lowerNature').textContent = data.lower_nature + ' · ' + data.lower_direction;
            document.getElementById('hexagramName').textContent = data.name;
            document.getElementById('meaning').textContent = data.meaning;
            const judgementEl = document.getElementById('judgement');
            judgementEl.textContent = data.judgement;
            judgementEl.className = 'judgement';
            if (data.judgement === '大吉') judgementEl.classList.add('daji');
            else if (data.judgement === '凶') judgementEl.classList.add('xiong');
            else judgementEl.classList.add('ping');
            const linesContainer = document.getElementById('hexagramLines');
            linesContainer.innerHTML = '';
            data.lines.forEach(line => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'line';
                const yao = document.createElement('div');
                yao.className = 'yao ' + (line === 1 ? 'yang' : 'yin');
                lineDiv.appendChild(yao);
                linesContainer.appendChild(lineDiv);
            });
            document.getElementById('explanation').textContent = data.explanation;
        }

        function showError(message) {
            loading.classList.remove('show');
            errorEl.textContent = message;
            errorEl.classList.add('show');
            formCard.style.display = 'block';
        }

        function resetForm() {
            result.classList.remove('show');
            formCard.style.display = 'block';
            form.reset();
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = '解读中...';
            showLoading();
            const formData = {
                name: document.getElementById('name').value,
                question: document.getElementById('question').value,
                birthTime: document.getElementById('birthTime').value
            };
            try {
                const response = await fetch('/api/fortune', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || '算命服务出错');
                showResult(data);
            } catch (err) {
                showError(err.message || '网络错误，请稍后重试');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = '开始算命';
            }
        });
    </script>
</body>
</html>`;
