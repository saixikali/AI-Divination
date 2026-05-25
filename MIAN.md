# 算命系统 - 项目文档

> **说明**：本文件记录项目结构和运行逻辑，后续代码更新需同步更新本文档。

---

## 一、项目概述

这是一个基于易经、梅花易数和DeepSeek AI的智能算命系统，支持桌面和移动端使用，可部署至Cloudflare全球边缘网络。

### 1.1 核心功能
- ☯️ 八卦卦象生成（乾、坤、震、巽、坎、离、艮、兑）
- 📖 周易六十四卦详解（含卦辞、象辞、爻辞）
- 🌸 梅花易数理论支撑
- 🤖 DeepSeek AI智能解读
- 📱 响应式设计，完美适配手机和桌面端

---

## 二、项目结构

```
e:\算命\
├── _worker.js              # Cloudflare Workers部署文件（生产环境使用）
├── app.py                  # Flask本地开发后端
├── functions/
│   └── index.js           # Cloudflare Functions版本（备用）
├── templates/
│   └── index.html         # 前端页面模板
├── public/                # Cloudflare Pages静态资源目录
├── requirements.txt       # Python依赖列表
├── wrangler.toml          # Cloudflare Workers配置
├── .env.example           # 环境变量示例
├── fortune-telling.zip    # 压缩包（可直接上传Cloudflare）
└── MIAN.md               # 项目文档（本文档）
```

---

## 三、核心模块说明

### 3.1 数据结构

#### 3.1.1 BAGUA（八卦基础数据）

| 属性 | 说明 |
|------|------|
| symbol | 卦象符号（☰☱☲☳☴☵☶☷） |
| nature | 自然属性（天、地、雷、风、水、火、山、泽） |
| direction | 方位 |
| meaning | 核心含义 |
| lines | 三爻卦象（1=阳爻，0=阴爻） |
| element | 五行属性 |
| family | 家庭成员 |
| body | 对应身体部位 |
| animal | 对应动物 |
| season | 对应季节 |
| image | 卦象意象 |
| character | 卦辞 |
| xiang | 象辞 |
| shu | 先天数 |

#### 3.1.2 LIUSHISI_GUA（六十四卦数据）

包含以下字段：
- `name`: 卦名
- `pinyin`: 拼音
- `upper`/`lower`: 上卦/下卦
- `judgement`: 吉凶判断（大吉/平/凶）
- `guaci`: 卦辞
- `xiangci`: 象辞
- `meaning`: 卦意
- `zhiyao`: 六爻爻辞数组
- `summary`: 卦义摘要

#### 3.1.3 其他常量

- `MEIHUA_YISHU`: 梅花易数理论
- `WUXING_SHENGKE`: 五行生克关系

---

## 四、运行逻辑

### 4.1 整体流程

```
用户输入 → 卦象生成 → DeepSeek API → 返回解读
   ↓           ↓            ↓
 姓名/问题   八卦组合    AI分析+专业建议
```

### 4.2 详细步骤

#### 步骤1：用户输入
```javascript
// 前端表单收集
{
  name: '张三',
  question: '事业发展如何？',
  birthTime: '子时'  // 可选
}
```

#### 步骤2：卦象生成算法
```javascript
// 1. 哈希用户输入生成种子
seed = hashCode(name + question + birthTime + timestamp)

// 2. 根据种子选取上下卦
gua1 = 八卦数组[seed % 8]      // 上卦
gua2 = 八卦数组[(seed+1) % 8]  // 下卦

// 3. 计算卦序（1-64）
hexagramNum = (gua1.shu - 1) * 8 + gua2.shu

// 4. 获取卦象信息
hexagram = {
  ...LIUSHISI_GUA[hexagramNum],
  upper_symbol: BAGUA[gua1].symbol,
  lower_symbol: BAGUA[gua2].symbol,
  lines: [...BAGUA[gua1].lines, ...BAGUA[gua2].lines],
  upper_element: BAGUA[gua1].element,
  lower_element: BAGUA[gua2].element,
  // ... 其他属性
}
```

#### 步骤3：DeepSeek API调用
```javascript
// 构建专业提示词
const prompt = `
【求测信息】
- 求测人：${name}
- 问题：${question}
- 出生时辰：${birthTime}

【卦象信息】
- 卦名：${hexagram.name}（第${hexagramNum}卦）
- 上卦：${gua1}（${nature}，${element}，方向${direction}）
- 下卦：${gua2}（${nature}，${element}，方向${direction}）
- 卦辞：${guaci}
- 象辞：${xiangci}
- 卦意：${meaning}

【爻辞】
${zhiyao.join('\n')}

请结合易经智慧和用户的问题，给出专业详细的卦象解读。
`

// 调用API
response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: '你是易经大师...' },
    { role: 'user', content: prompt }
  ]
})
```

#### 步骤4：返回结果
```json
{
  "hexagram_num": "11",
  "name": "地天泰",
  "upper": "坤",
  "lower": "乾",
  "upper_symbol": "☷",
  "lower_symbol": "☰",
  "judgement": "大吉",
  "guaci": "小往大来，吉亨。",
  "xiangci": "天地交，泰...",
  "zhiyao": ["初九：拔茅茹...", "..."],
  "explanation": "AI生成的详细解读"
}
```

---

## 五、API接口

### 5.1 算命接口

```
POST /api/fortune
Content-Type: application/json

请求体：
{
  "name": "张三",
  "question": "事业发展如何？",
  "birthTime": "子时"  // 可选
}

响应：
{
  "hexagram_num": "11",
  "name": "地天泰",
  "upper": "坤",
  "lower": "乾",
  "upper_symbol": "☷",
  "lower_symbol": "☰",
  "upper_nature": "地",
  "lower_nature": "天",
  "upper_direction": "西南",
  "lower_direction": "西北",
  "upper_element": "土",
  "lower_element": "金",
  "lines": [0, 0, 0, 1, 1, 1],
  "judgement": "大吉",
  "guaci": "小往大来，吉亨。",
  "xiangci": "天地交，泰...",
  "meaning": "泰者，通也...",
  "zhiyao": [...],
  "summary": "...",
  "name_input": "张三",
  "question": "事业发展如何？",
  "explanation": "..."
}
```

### 5.2 八卦信息接口

```
GET /api/bagua

响应：
{
  "乾": { "symbol": "☰", "nature": "天", ... },
  "坤": { "symbol": "☷", "nature": "地", ... },
  ...
}
```

---

## 六、部署说明

### 6.1 Cloudflare Workers（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Workers & Pages → Create Application
3. 选择 HTTP handler (with Workers)
4. 上传 `_worker.js` 文件
5. 配置环境变量（如需要）：`DEEPSEEK_API_KEY`

### 6.2 Cloudflare Pages

1. 进入 Pages → Create a project
2. 选择 Direct upload
3. 上传 `_worker.js`
4. 设置环境变量：`DEEPSEEK_API_KEY`

### 6.3 本地运行

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 运行
python app.py

# 3. 访问
http://localhost:5000
```

---

## 七、环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 | 是 |

> **注意**：当前代码已将API密钥硬编码，直接部署即可使用。

---

## 八、技术栈

| 类别 | 技术 |
|------|------|
| 前端 | HTML5 + CSS3 + JavaScript |
| 后端 | Cloudflare Workers / Flask |
| AI | DeepSeek API |
| 部署 | Cloudflare Workers/Pages |
| 样式 | 原生CSS（响应式设计） |

---

## 九、更新日志

### 2026-05-25
- 添加周易六十四卦完整数据（卦辞、象辞、爻辞）
- 扩展八卦信息（增加五行、家庭成员、身体部位等）
- 集成梅花易数理论
- 添加五行生克关系
- 优化AI提示词，要求引经据典

### 2026-04-28
- 初始版本创建
- 基础八卦功能
- DeepSeek API集成
- 响应式界面设计
- Cloudflare部署配置

---

## 十、注意事项

1. **API密钥安全**：当前代码已硬编码API密钥，部署时请确保代码仓库为私有
2. **免费额度**：DeepSeek API有免费额度限制，高频使用需付费
3. **娱乐性质**：本系统仅供娱乐参考
4. **法律合规**：请遵守当地法律法规

---

## 十一、获取帮助

- DeepSeek API: https://platform.deepseek.com/
- Cloudflare: https://dash.cloudflare.com
- 易经参考: 《周易正义》、《梅花易数》

---

*最后更新：2026-05-25*
