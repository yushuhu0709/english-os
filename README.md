# English OS：一个月 SSBE 英式发音训练营

第一周（Day 1–7）练单个的音；第二周（Day 8–14）练语流：弱读、连读、省音同化与喉塞、节奏、语调、长段落跟读；第三周（Day 15–21）练日常对话：寒暄与回应、问句语调、礼貌请求、字母数字日期、-ed 和 -s、情景对话；第四周（Day 22–28）从跟读到自己说：辅音丛与长单词、讲故事、表达观点、长句意群、自我介绍、自由表达。每周第一天做基线测试，最后一天复测并生成报告；Day 28 还会重读 Day 1 的短文，生成一个月对比。

六个页面：Dashboard、Bootcamp、Daily Review（每日错题复习）、Pronunciation Lab、AI Coach、Progress。

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

## 开机自动启动（推荐）

装一次之后，Mac 登录就会在后台自动运行，不用再开终端：

```bash
bash ~/english-os/scripts/install-autostart.sh
```

之后直接用浏览器打开 http://localhost:3000 ，或者双击 `scripts/English OS.command`（可以复制到桌面）。

- 更新代码后重启：`npm run restart`（启动脚本发现代码有变化会自动重新构建）
- 关掉自动启动：`bash ~/english-os/scripts/uninstall-autostart.sh`
- 日志：`~/Library/Logs/english-os.log`
- 服务器只监听本机（127.0.0.1），局域网里的其他设备访问不到。

## 每日复习

Daily Review 页面把你的错题（辨音首次答错、跟读对比标记的问题、自己记录的错误、ELSA 记录）按日历排成间隔复习：答对后 1 → 2 → 4 → 7 → 15 天再出现，答错第二天再来，每天最多 8 项。和每天课程里第 7 步的课内复习互不影响，不练新课的日子也可以做。

## 自动备份

在本机运行时，每次进度变化、每段新录音都会自动复制到 `~/English OS 备份/`：

- `progress-latest.json`：最新的全部进度（不含 API key）
- `daily/progress-YYYY-MM-DD.json`：每天一份快照，保留 60 天
- `recordings/`、`refAudio/`、`images/`：录音、导入的真人音频、ELSA 截图

换浏览器或清除了网站数据，在 Progress → 备份 点「从自动备份恢复」即可。想换位置，设置环境变量 `ENGLISH_OS_BACKUP_DIR`。

## 数据保存在哪里

全部保存在你本机浏览器中：进度在 localStorage，录音、导入的真人音频和 ELSA 截图在 IndexedDB。不会上传到任何服务器（AI 追问和「可懂度检查」除外，它们会把文字或语音发送给相应服务）。

浏览器里的数据会自动备份到 `~/English OS 备份/`（见上）。也可以在 Progress → 备份 手动导出一个文件。

## 测试

```bash
npm run typecheck
npm run test:logic
npx playwright install chromium   # 只在第一次需要
npm run build && npm run test:e2e
```

## 教学依据

见 `docs/METHOD.md`：《1000小时》与 Obsidian 中《怎样快速提升英语口语能力》笔记的比较，以及按 SSBE 语音学做的校正。
