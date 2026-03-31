# 凤凰还愿（Vue3 解密 AVG）

关键词搜索 + 账号登录 + 链接跳转，静态部署（Vite + Vue Router + Pinia）。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 测试

```bash
npm test
```

## 部署

- **GitHub Pages**：将 `vite.config.ts` 中 `base` 改为 `/仓库名/`，再用 `gh-pages` 或 Actions 发布 `dist`。
- **Netlify**：`netlify.toml` 已配置 `publish = dist`，构建命令 `npm run build`。

## 内容配置

剧情文本与节点定义见 [`src/content/storyNodes.ts`](src/content/storyNodes.ts)，谜题标准答案见 [`src/content/puzzleAnswers.ts`](src/content/puzzleAnswers.ts)，解锁规则见 [`src/content/unlockRules.ts`](src/content/unlockRules.ts)。

## 进度存储

进度保存在浏览器 `localStorage`（键名 `pheonix-avg-game-v1`），首页可重置。
