# 算命系统

一个基于易经和DeepSeek AI的算命系统，支持桌面和移动端使用。

## 功能特点

- ☯️ 基于易经八卦的卦象生成
- 🤖 DeepSeek AI智能解读
- 📱 响应式设计，完美适配手机和桌面
- ☁️ 可部署至Cloudflare全球边缘网络

## 部署到Cloudflare

### 方式一：Cloudflare Pages (推荐)

1. 将代码推送到GitHub仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 Pages → Create a project → Connect to Git
4. 选择你的仓库，框架预配置选择 "None"
5. 构建命令留空，输出目录设置为 `/`
6. 添加环境变量 `DEEPSEEK_API_KEY`
7. 点击部署

### 方式二：Cloudflare Workers

1. 安装 Wrangler CLI：`npm install -g wrangler`
2. 登录 Cloudflare：`wrangler login`
3. 部署：`wrangler deploy`

### 方式三：本地运行

1. 安装依赖：`pip install -r requirements.txt`
2. 复制 `.env.example` 为 `.env` 并填入 `DEEPSEEK_API_KEY`
3. 运行：`python app.py`
4. 访问 `http://localhost:5000`

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 |

## 获取DeepSeek API密钥

1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册并登录账号
3. 在 API Keys 页面创建新的API Key
4. 将密钥添加到环境变量或Cloudflare配置中

## 技术栈

- 前端：原生 HTML/CSS/JavaScript (响应式设计)
- 后端：Cloudflare Workers / Flask
- AI：DeepSeek API
- 部署：Cloudflare Pages / Workers
