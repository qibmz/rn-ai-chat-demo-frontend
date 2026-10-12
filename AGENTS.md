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
   3.1. **Web 输出保持 `app.json` → `expo.web.output: "server"`**。本地跑起来也**禁止**改成 `single` / SPA 来绕 EMFILE；用 `metro.config.js` 限 worker、`CHOKIDAR_USEPOLLING`、清旧进程等方式处理。
4. 环境变量、密钥、真实 API Key / DSN 不要写进仓库；本地用 `.env*.local`（已 gitignore）。
5. 合并到生产走 PR（`develop` → `main`），并在 Test plan 里说明如何验证（web / iOS / Android 至少写清验证过的端）。
6. Lint 栈对齐 [create-expo-stack](https://github.com/roninoss/create-expo-stack)：ESLint 9 + `eslint-config-expo` + Prettier；不要擅自换成 oxlint / Biome，除非团队明确决议。
7. **`components/ui/**` 为生成代码，禁止修改**（见下方说明）；业务写在 `app/`、`components/` 下自有目录。
   **例外**：仅当生成代码在真机上造成确定性崩溃、且业务侧无法绕过时，允许最小补丁（须写清原因）；例如 `GluestackUIProvider` 不得再对 `Appearance.setColorScheme` 传 `null`（须用 `unspecified`）。
8. **尽量复用 gluestack（`@/components/ui/*`）已有组件**（如 `Menu` / `AlertDialog` / `Button`）；不要平行再造一套。确需自建业务组件时，须给出**明确理由**（例如领域语义封装、多端特化、组合多个 ui 组件），并写在 PR Summary 或相关注释里。
9. **接入 gluestack 复合组件时，官方文档示例即契约**（见下方「官方示例优先」）；禁止为「先跑通」自拼精简版或平行封装。

## 官方示例优先（gluestack / chat-ai）

接入或改动 `@/components/ui/*` 提供的复合能力（尤其 **chat-ai**）时：

1. **先打开对应官方文档完整 Example**，再写业务代码。文档入口按需查阅：
   - [Chat AI](https://gluestack.io/ui/docs/components/chat-ai)
   - [Dark Mode](https://gluestack.io/ui/docs/home/theme-configuration/dark-mode)
   - 组件页以 gluestack 文档为准，勿凭记忆拼装
2. **结构、import 列表、子组件组合、文档里可用 scale 表达的 className（如 `web:pb-5`）以示例为准**；业务只加本产品必要层（路由顶栏、`useChat` / transport、文案、权限）。禁止用自写 Composer / 自拟 padding（如 `pb-28`）代替文档布局。
   **例外**：文档 Example 里的任意值（`mt-[2px]`、`h-[600px]`）**不要**抄进 `app/` / 业务 `components/`；业务仍走 spacing scale（`mt-[2px]` → `mt-0.5`）。任意 `px` 只允许留在 `components/ui` 生成代码里。
3. **禁止「最小可用」偷懒**：不能只接 `Textarea` + `Submit` 却丢掉文档已有的 `PromptInputActionMenu` / `Attachments` / `PromptInputFooter` 等；文档里有的能力视为已支持，先对照示例，再谈缺省。
4. **禁止平行封装掩盖差异**：不要抽一层业务包装把官方组合藏起来，除非包装体内部仍是完整官方树，且 wrapper 理由写进 PR / 注释。
5. **主题**：外观切换须驱动 `GluestackUIProvider` 的 `mode`（与官方 dark mode 一致）；语义 token（`bg-background` 等）跟主题，硬编码色值不会。

反例（已踩坑，禁止再犯）：聊天页自写输入区、自加 `Conversation className="pb-28"`、未接上传菜单却声称「组件不支持上传」——文档 Example 本身已包含。

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
- **`components/ui/**` 为 gluestack / 脚手架生成的 UI 套件，禁止手改、禁止塞业务逻辑**（含「顺手修一下」也不行）。业务侧**先查、先用**已有 ui 组件（示例：下拉用 `Menu`，确认用 `AlertDialog`，不要自写浮层菜单）。需要变体或领域封装时，在 `components/` 下自建并**组合引用** `@/components/ui/*`，同时说明为何不能直接用现成组件。该目录 **ESLint 已 ignore**，不要指望在里面靠 lint 兜底。

## PR 描述结构

```markdown
## Summary

- 改了什么、为什么

## Test plan

- [ ] CI 通过
- [ ] web 窄屏 + PC 宽屏本地验证（或注明验证过的端）
- [ ] 合并后需确认的事项
```

## Tailwind / NativeWind 样式

- **优先用 spacing scale，禁止业务代码里写任意 `px` 值**（如 `max-w-[400px]`、`h-[48px]`）
- 默认 spacing 单位为 `0.25rem`（4px）：`N → N × 4px`，例如：
  - `max-w-[400px]` → `max-w-100`
  - `max-w-[280px]` → `max-w-70`
  - `h-[48px]` → `h-12`
- 只有 scale 表达不了、或**已有** `components/ui` 生成代码里的写法才允许 `-[…px]`；**新写业务 UI 必须用 scale**，且仍不要去改 `components/ui`
- 工具提示「The class `max-w-[400px]` can be written as `max-w-100`」时，按提示改掉，不要保留任意值

## 多端兼容（Web / 手机 / 平板）

本仓库是 Expo + Expo Router，**同一套业务 UI 要能在 iOS、Android、以及 Web（含 PC 宽屏）使用**。不要只按手机竖屏稿实现。

必须遵守：

1. **默认按「手机优先」写，再用 `md:` / `lg:` 补宽屏**，而不是只做窄屏再指望浏览器缩放。
2. **表单、设置、个人中心等纵向信息页**：与登录页同一策略——`w-full max-w-100 self-center` 限宽居中，**不要**为 PC 做两栏 / 复杂断点改布局；只保证不拉满超宽屏即可。
   **聊天页同样**：顶栏、消息列表、`PromptInput` 用同一套 `ScreenContainer` 限宽居中；官方 chat-ai 树不变，禁止消息/输入区在 PC 横向拉满。
   官方 Example 用固定高度盒子让 `Conversation` 内部滚动、`PromptInput` 贴底。全屏接入时必须给这一列 `min-h-0 overflow-hidden`（等价定高），**禁止**整页跟着输入框 `scrollIntoView` 往上顶。勿把文档里的 `h-[600px]` 写进业务 className。
   官方 `ConversationContent` **只在新增用户消息时** `scrollToEnd`，流式回复变长不会跟滚——聊天页须经其透传的 FlatList props（`ref` / `onContentSizeChange` / `onScroll`）做贴底；**禁止**改 `components/ui` 去修库。
3. **触控与指针都要可用**：可点击区域足够大；Web 上注意 `cursor` / hover（可用 `data-[hover=true]:`）；不要依赖仅移动端手势才能完成的核心操作。
4. **安全区 + 边距**：`useSafeAreaInsets` 仍要；内容区保留 `px-4` / `px-5` 等，避免贴边。
5. **弹层宽度克制**：`AlertDialog` / Modal 不要随视口无限变宽。
6. **自检**：手机宽度 + PC 宽屏各看一眼 Web；PR Test plan 写清验证过的端。

反例：设置页在桌面横向拉满整屏——视为未兼容 PC。

可复用容器：`components/layout/ScreenContainer.tsx`（限宽 + 居中）。

**仅原生能力**（通知权限、触感反馈、推送等）：用 `isNativeApp`（`lib/device/platform.ts`）判断，**Web / H5 不渲染、不请求权限**；相关 UI 放在仅原生挂载的子组件里（如 `NativeDeviceSettings`）。

## 键盘与输入框（不要当 uni-app 默认行为）

RN / Expo **不会**像 uni-app 那样「输入框聚焦后页面自动上推」；不接避让就会被系统键盘挡住。

必须遵守：

1. 根布局已挂 `KeyboardProvider`（`react-native-keyboard-controller`）。有表单、多输入的页面用其 **`KeyboardAwareScrollView`**（或同等 KeyboardController 方案），**不要**指望 RN 自带 `KeyboardAvoidingView` 双端开箱即用。
2. **反例（已踩坑）**：`KeyboardAvoidingView` + `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`——Android 上等于没避让，登录/注册聚焦密码框会被键盘挡住。
3. Auth 页参考 `components/auth/AuthShell.tsx`：`KeyboardAwareScrollView` + 合适 `bottomOffset` / `extraKeyboardSpace`；表单里有 `flex` + `justify-between` 时可用 `mode="layout"`。
4. Android 另需 `app.json` → `expo.android.softwareKeyboardLayoutMode: "resize"`。改这项是**原生配置**，要重打 / 重装 development build 才生效；纯 JS 改滚动避让 Reload 即可。
5. **聊天页例外**：输入贴底走官方 chat-ai `PromptInput` + 定高列（见上方多端规则），不要整页 `KeyboardAwareScrollView` 把对话顶飞。

## API 请求约定（对齐后端）

后端统一响应：`{ code, message, data | errors, timestamp, path }`；成功 `code === 200`，失败 `code` 为 HTTP 状态码。

- 封装见 `lib/api/client.ts`：成功取 `data`；失败抛 `ApiError`（含 `code` / `message` / `errors`）
- **401**（未登录 / access 过期）：自动用 refresh token 刷新一次并重试原请求；刷新失败则 `clearSession` 回到未登录
- 登录失败也是 401（邮箱或密码错误）——`login` / `register` / `refresh` / `logout` 必须 `skipAuth: true`，**不要**对它们做 refresh
- 受保护接口不要手传 `Authorization`，由 client 从 Auth 会话自动带上
- 用户可见错误文案用后端返回的中文 `message`

## 代码习惯

- 用户可见文案优先中文
- 与后端联调时对齐 API 契约；不要在前端硬编码生产密钥
- 改动 UI 时必须兼顾 **Web（含 PC）与原生**，见上方「多端兼容」；至少在 web 窄屏 + 宽屏各看一眼
- UI 优先复用 gluestack；自建组件要有明确理由（见「必须遵守」第 8 条）；复合组件跟官方 Example（见「必须遵守」第 9 条）
- 本仓库约定优先于通用 Expo / RN 文档；实现细节不确定时再查官方文档，**不要**把全文拷进仓库或当 skill 安装
- 不确定某能力是否存在时：**先读官方 Example / API Reference**，再下结论；不要先自写替代实现

## 文档

- 对外行为或启动方式变更时同步更新 README / 相关说明
- **视觉与 Auth 基准稿**：[DESIGN.md](./DESIGN.md)（以登录 / 欢迎页为范本；表单圆角与输入语言对齐此处）
- 官方文档（按需查阅）：
  - Expo：[https://docs.expo.dev/](https://docs.expo.dev/)
  - Expo Router：[https://docs.expo.dev/router/introduction/](https://docs.expo.dev/router/introduction/)
  - gluestack UI：[https://gluestack.io/ui/docs](https://gluestack.io/ui/docs)
  - Chat AI：[https://gluestack.io/ui/docs/components/chat-ai](https://gluestack.io/ui/docs/components/chat-ai)
