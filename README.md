# English OS · Phase 1：七天 SSBE 英式发音训练营

只包含第一周（Day 1–7）。五个页面：Dashboard、7-Day Bootcamp、Pronunciation Lab、AI Coach、Progress。

## 在 Mac 上运行

需要 Node.js 18.18 或更高版本（检查：终端输入 `node -v`）。没有的话先从 https://nodejs.org 安装 LTS 版，或用你已有的 nvm：`nvm install --lts`。

```bash
# 1. 把 english-os 文件夹放到一个普通位置，例如 ~/english-os
#    （不要放在 iCloud Drive 或 Obsidian 库里，node_modules 会被同步）
cd ~/english-os

# 2. 安装依赖（第一次需要，约 1 分钟）
npm install

# 3. 构建并启动
npm run build
npm start
```

然后用 **Chrome 或 Safari** 打开 http://localhost:3000 。之后每天只需要在该文件夹执行 `npm start`。

第一次录音时浏览器会请求麦克风权限，请选择允许。

### 英式示范声音

示范音频使用系统的英式（en-GB）合成语音。为了更自然的声音，建议在 macOS 下载增强版英式声音：

系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音 → English (United Kingdom) → 下载 Serena / Daniel / Kate（Enhanced 或 Premium）→ 重启浏览器。

然后在 Pronunciation Lab → 示范声音设置 里选择。应用不会改用美式声音。

### AI 教练（可选）

不配置也能完整训练。要启用 AI 追问，在 AI Coach → AI 设置 中填写 Anthropic API key，或者启动前设置环境变量：

```bash
ANTHROPIC_API_KEY=sk-ant-... npm start
```

## 数据保存在哪里

全部保存在你本机浏览器中：进度在 localStorage，录音、导入的真人音频和 ELSA 截图在 IndexedDB。不会上传到任何服务器（AI 追问和「可懂度检查」除外，它们会把文字或语音发送给相应服务）。

换浏览器或清除网站数据会看不到记录。建议每天训练后在 Progress → 备份 导出一次。

## 测试

```bash
npm run typecheck
npx playwright install chromium   # 只在第一次需要
npm run build && npm run test:e2e
```

## 教学依据

见 `docs/METHOD.md`：《1000小时》与 Obsidian 中《怎样快速提升英语口语能力》笔记的比较，以及按 SSBE 语音学做的校正。
