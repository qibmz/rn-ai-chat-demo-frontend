# AGENTS.md

给在本仓库工作的 AI / 自动化助手的约束。人类开发者同样建议遵守。

规范依据：[开发规范链](https://blog.qibmz.com/blog/dev-spec-chain) —— 本地快检、远程 CI、PR 审阅、合并上线分层门禁。

本前端与同级仓库 `rn-ai-chat-demo-backend` 的分支策略、commitlint、PR 结构保持一致。

## 规范链总览

```text
本地：lint-staged + commitlint
  → push develop → CI（format / lint / web build + commitlint）
  → PR develop → main（填 Test plan，CI 再跑）
  → 合并 main → 生产
```

原则：本地只查暂存文件；CI 跑全量；**不要**在 pre-commit 跑全量 typecheck / test / build。

## 分支策略

| 分支      | 用途                                  |
| --------- | ------------------------------------- |
| `develop` | 日常开发、联调、测试环境              |
| `main`    | 生产发布，只通过 PR 从 `develop` 合并 |

流程：本地开发 → commit → push `develop` → 验证 → 开 PR：`develop` → `main` → CI 全绿 + 看过 diff → 合并。

## 提交规范（commitlint）

本仓库启用了 **Husky `commit-msg` + commitlint**；CI 对 push / PR 会再验一遍。不符合规则的 commit **无法提交 / 无法过 CI**。

规则要点：

- 必须遵循 [Conventional Commits](https://www.conventionalcommits.org/)：`type(scope): subject`
- `subject` **必须包含中文**（自定义规则 `subject-has-chinese`），说清动机；禁止整句英文 subject
- `type` 保持英文小写，仅允许：
  `feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `build` / `ci` / `chore` / `revert`
- `subject` 不以句号结尾；header 最长 120，subject 最长 100
- `scope` 可选（如 `chat` / `ui` / `ci`）；不强制英文 case

示例：

- `feat(chat): 接入流式回复展示`
- `fix(web): 修复键盘弹出时输入框被遮挡`
- `docs: 补充 AGENTS 与 commitlint 说明`
- `chore: 接入 eslint prettier 与 husky`
- `ci: 增加 format lint 与 web build 门禁`

大改动请**分批提交**（功能 / 修复 / 样式 / 文档 / CI 分开），避免一把梭。

本地自测提交信息：

```bash
echo "feat: 添加某某功能" | pnpm exec commitlint
```

配置文件：`commitlint.config.mjs`。

## 必须遵守

1. 提交信息使用约定式格式（见上）；不要用 `--no-verify` 绕过 hook，除非用户明确要求。
2. 改完代码确保能通过 `pnpm lint`（ESLint + Prettier check）。
3. 包管理优先使用 **pnpm**（与当前 `node_modules` / lockfile 一致）。
4. 环境变量、密钥、真实 API Key / DSN 不要写进仓库；本地用 `.env*.local`（已 gitignore）。
5. 合并到生产走 PR（`develop` → `main`），并在 Test plan 里说明如何验证（web / iOS / Android 至少写清验证过的端）。
6. Lint 栈对齐 [create-expo-stack](https://github.com/roninoss/create-expo-stack)：ESLint 9 + `eslint-config-expo` + Prettier；不要擅自换成 oxlint / Biome，除非团队明确决议。

## 改完后的自检

```bash
pnpm lint && pnpm run build
```

可选（当前 gluestack UI kit 仍有存量类型问题，CI 暂未强制）：

```bash
pnpm typecheck
```

## Lint / 格式化约定

- `pnpm lint`：ESLint + Prettier check
- `pnpm format`：ESLint `--fix` + Prettier write
- pre-commit 经 lint-staged：对暂存的 `*.{js,jsx,ts,tsx}` 跑 eslint --fix + prettier；对 `*.{json,md,yml,yaml,css}` 跑 prettier
- `components/ui/**` 为 gluestack / 脚手架 UI 套件，**ESLint 已 ignore**（与 React Compiler lint、Reanimated SharedValue 模式冲突多）；业务代码优先写在 `app/`、自有组件目录，不要把业务逻辑塞进生成 UI 目录后期待 lint 兜底

## PR 描述结构

```markdown
## Summary

- 改了什么、为什么

## Test plan

- [ ] CI 通过
- [ ] web / 目标端本地验证
- [ ] 合并后需确认的事项
```

## 代码习惯

- 用户可见文案优先中文
- 与后端联调时对齐 API 契约；不要在前端硬编码生产密钥
- 改动 UI 时兼顾 web 与原生（至少确认改动路径在 web 可跑）
- 本仓库约定优先于通用 Expo / RN 文档；实现细节不确定时再查官方文档，**不要**把全文拷进仓库或当 skill 安装

## 文档

- 对外行为或启动方式变更时同步更新 README / 相关说明
- 官方文档（按需查阅）：
  - Expo：[https://docs.expo.dev/](https://docs.expo.dev/)
  - Expo Router：[https://docs.expo.dev/router/introduction/](https://docs.expo.dev/router/introduction/)
