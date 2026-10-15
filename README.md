# 算命系统

一个基于易经和DeepSeek AI的算命系统，支持桌面和移动端使用。

## 功能特点

- ☯️ 基于易经八卦的卦象生成
- 🤖 DeepSeek AI智能解读
- 📱 响应式设计，完美适配手机和桌面
- ☁️ 可部署至Cloudflare全球边缘网络

## 本地开发

前端为 React (Vite)，后端为 Flask，开发时两者同时运行：

1. 安装后端依赖：`pip install -r requirements.txt`
2. 复制 `.env.example` 为 `.env` 并填入 `DEEPSEEK_API_KEY`
3. 启动后端：`python app.py`（5000 端口）
4. 安装前端依赖并启动开发服务器：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. 访问 Vite 提示的地址（默认 `http://localhost:5173`），`/api` 请求自动代理到 Flask

## 本地生产预览

```bash
cd frontend
npm run build      # 产物输出到 public/
cd ..
python app.py      # 访问 http://localhost:5000
```

## 部署到Cloudflare

### 方式一：Cloudflare Pages (推荐)

1. 将代码推送到GitHub仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 Pages → Create a project → Connect to Git
4. 选择你的仓库，构建配置：
   - 构建命令：`cd frontend && npm install && npm run build`
   - 输出目录：`public`
5. 添加环境变量 `DEEPSEEK_API_KEY`
6. 点击部署

### 方式二：Cloudflare Workers

1. 先构建前端：`cd frontend && npm install && npm run build`
2. 安装 Wrangler CLI：`npm install -g wrangler`
3. 登录 Cloudflare：`wrangler login`
4. 部署：`wrangler deploy`

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

- 前端：React + Vite (响应式设计)
- 后端：Flask / Cloudflare Workers
- AI：DeepSeek API
- 部署：Cloudflare Pages / Workers
