"""
算命系统 - Flask后端
提供卦象生成和DeepSeek AI解释功能
"""
import os
import random
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates', static_folder='static')

DEEPSEEK_API_KEY = 'REDACTED_DEEPSEEK_KEY'
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

BAGUA = {
    '乾': {'symbol': '☰', 'nature': '天', 'direction': '西北', 'meaning': '刚健、自强不息', 'lines': [1, 1, 1], 'element': '金', 'shu': '1'},
    '坤': {'symbol': '☷', 'nature': '地', 'direction': '西南', 'meaning': '柔顺、厚德载物', 'lines': [0, 0, 0], 'element': '土', 'shu': '8'},
    '震': {'symbol': '☳', 'nature': '雷', 'direction': '东', 'meaning': '震动、奋发', 'lines': [1, 0, 0], 'element': '木', 'shu': '4'},
    '巽': {'symbol': '☴', 'nature': '风', 'direction': '东南', 'meaning': '渗入、谦逊', 'lines': [0, 1, 0], 'element': '木', 'shu': '5'},
    '坎': {'symbol': '☵', 'nature': '水', 'direction': '北', 'meaning': '险陷、智慧', 'lines': [0, 1, 1], 'element': '水', 'shu': '6'},
    '离': {'symbol': '☲', 'nature': '火', 'direction': '南', 'meaning': '光明、美丽', 'lines': [1, 0, 1], 'element': '火', 'shu': '3'},
    '艮': {'symbol': '☶', 'nature': '山', 'direction': '东北', 'meaning': '停止、稳重', 'lines': [1, 1, 0], 'element': '土', 'shu': '7'},
    '兑': {'symbol': '☱', 'nature': '泽', 'direction': '西', 'meaning': '喜悦、言语', 'lines': [0, 0, 1], 'element': '金', 'shu': '2'},
}

HEXAGRAMS = {
    ('乾', '乾'): {'name': '乾为天', 'judgement': '大吉', 'meaning': '象征天，纯阳至健。诸事大吉大利，飞龙在天，利见大人。'},
    ('坤', '坤'): {'name': '坤为地', 'judgement': '大吉', 'meaning': '象征地，纯阴至顺。地势坤，君子以厚德载物。'},
    ('乾', '坤'): {'name': '天地否', 'judgement': '凶', 'meaning': '天地不通，阴阳不合。诸事不顺，需守正等待时机。'},
    ('坤', '乾'): {'name': '地天泰', 'judgement': '大吉', 'meaning': '天地交泰，阴阳相合。诸事亨通，国泰民安。'},
}

def get_hexagram_lines(trigram1, trigram2):
    """获取六爻卦象"""
    lines1 = BAGUA[trigram1]['lines']
    lines2 = BAGUA[trigram2]['lines']
    return lines1 + lines2

def generate_hexagram(user_input):
    """根据用户输入生成卦象"""
    seed = sum(ord(c) for c in str(user_input)) + int(datetime.now().timestamp())

    random.seed(seed)
    gua1 = random.choice(list(BAGUA.keys()))
    random.seed(seed + 1)
    gua2 = random.choice(list(BAGUA.keys()))

    key = (gua1, gua2)
    if key in HEXAGRAMS:
        hex_info = HEXAGRAMS[key]
    else:
        hex_info = {
            'name': f'{gua1}{gua2}',
            'judgement': '平',
            'meaning': f'{BAGUA[gua1]["meaning"]}上，{BAGUA[gua2]["meaning"]}下，相辅相成。'
        }

    hexagram_num = str((int(BAGUA[gua1]['shu']) - 1) * 8 + int(BAGUA[gua2]['shu']))

    return {
        'hexagram_num': hexagram_num,
        'upper': gua1,
        'lower': gua2,
        'upper_symbol': BAGUA[gua1]['symbol'],
        'lower_symbol': BAGUA[gua2]['symbol'],
        'upper_nature': BAGUA[gua1]['nature'],
        'lower_nature': BAGUA[gua2]['nature'],
        'upper_direction': BAGUA[gua1]['direction'],
        'lower_direction': BAGUA[gua2]['direction'],
        'upper_element': BAGUA[gua1].get('element', ''),
        'lower_element': BAGUA[gua2].get('element', ''),
        'pinyin': '',
        'guaci': '',
        'xiangci': '',
        'zhiyao': [],
        'lines': get_hexagram_lines(gua1, gua2),
        **hex_info
    }

async def call_deepseek_api(prompt, system_prompt=None):
    """调用DeepSeek API获取卦象解释"""
    if not DEEPSEEK_API_KEY:
        return "请配置DeepSeek API密钥"

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {DEEPSEEK_API_KEY}'
    }

    system_content = system_prompt or (
        "你是一位精通易经的算命大师，善于解读卦象，解释深刻而富有智慧。"
        "请用简洁优美的语言解释卦象含义，结合用户的问题给出建议。"
    )

    payload = {
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': system_content},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.7,
        'max_tokens': 1000
    }

    try:
        import urllib.request
        req = urllib.request.Request(
            DEEPSEEK_API_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except Exception as e:
        return f"API调用出错: {str(e)}"

def sync_call_deepseek(prompt, system_prompt=None):
    """同步调用DeepSeek API"""
    import urllib.request
    import ssl

    if not DEEPSEEK_API_KEY:
        return "请配置DeepSeek API密钥以获取详细卦象解释。"

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {DEEPSEEK_API_KEY}'
    }

    system_content = system_prompt or (
        "你是一位精通易经的算命大师，善于解读卦象，解释深刻而富有智慧。"
        "请用简洁优美的语言解释卦象含义，结合用户的问题给出建议。"
    )

    payload = {
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': system_content},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.7,
        'max_tokens': 1000
    }

    try:
        context = ssl.create_default_context()
        req = urllib.request.Request(
            DEEPSEEK_API_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=30, context=context) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except Exception as e:
        return f"API调用出错，请稍后重试。"

@app.route('/')
def index():
    """主页"""
    return render_template('index.html')

@app.route('/api/fortune', methods=['POST'])
def fortune_api():
    """算命API"""
    data = request.get_json()
    name = data.get('name', '').strip()
    question = data.get('question', '').strip()
    birth_time = data.get('birthTime', '').strip()

    if not name:
        return jsonify({'error': '请输入您的姓名'}), 400

    user_input = f"{name}{question}{birth_time}{datetime.now().date()}"
    hexagram = generate_hexagram(user_input)
    hexagram['name'] = name
    hexagram['question'] = question

    prompt = f"""用户姓名：{name}
用户问题：{question}
出生时辰：{birth_time if birth_time else '未提供'}

卦象信息：
- 卦名：{hexagram['name']}
- 上卦：{hexagram['upper']}（{hexagram['upper_nature']}，方向{hexagram['upper_direction']}）
- 下卦：{hexagram['lower']}（{hexagram['lower_nature']}，方向{hexagram['lower_direction']}）
- 卦辞：{hexagram['judgement']}
- 卦意：{hexagram['meaning']}

请结合易经智慧和用户的问题，给出详细的卦象解读和建议。"""

    explanation = sync_call_deepseek(prompt)
    hexagram['explanation'] = explanation

    return jsonify(hexagram)

@app.route('/api/bagua')
def bagua_api():
    """八卦信息API"""
    return jsonify(BAGUA)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
