# DESIGN.md — 牛马前端视觉与交互约定

以 **欢迎页 / 登录注册**（`app/(auth)/*` + `components/auth/*`）为基准稿。后续表单、设置、引导类页面优先对齐本文件，而不是另起一套圆角或输入风格。

实现约束（spacing scale、多端限宽、键盘避让等）见 [AGENTS.md](./AGENTS.md)；本文件只谈**看起来像什么、怎么组合**。

---

## 1. 产品气质

| 关键词 | 含义                                                                     |
| ------ | ------------------------------------------------------------------------ |
| 干净   | `bg-background` 大面积留白，少装饰边框与阴影                             |
| 胶囊   | 主按钮、输入、分段切换统一 **满圆角**（`rounded-full`）                  |
| 品牌先 | 首屏先看到彩色 Bot 环 + 产品名，再是操作                                 |
| 语义色 | 只用 gluestack 语义 token（`foreground` / `muted` / `primary`…），跟主题 |

反感：方框表单感（`rounded-2xl` + 粗边框）、紫渐变 Hero、卡片堆叠、过多 pill 标签条。

---

## 2. Auth 页面结构（基准稿）

```text
┌─────────────────────────────┐
│  安全区 + bg-background     │
│                             │
│         BlobOrbit           │  ← 顶区品牌装饰（整组轻浮）
│                             │
│     标题 / 副标题（可选）    │
│     AuthModeSwitch（可选）  │
│     AuthField × N           │
│                             │
│  ──────── 底部区 ────────   │
│     主 CTA（胶囊 h-14）     │
│     次要文字链（返回等）    │
│     辅助说明 xs             │
└─────────────────────────────┘
```

- **壳**：`AuthShell` — 安全区、水平 `px-6`、键盘用 `KeyboardAwareScrollView`（见 AGENTS「键盘与输入框」）。
- **内容宽**：主操作列 `w-full max-w-100 self-center`，PC 不拉满。
- **纵向**：上中内容 + 底栏 CTA，`justify-between`；不要把主按钮塞进滚动中部消失。

路由对应：

| 页面             | 装饰                | 要点                                           |
| ---------------- | ------------------- | ---------------------------------------------- |
| Welcome          | BlobOrbit 正常      | 大标题 `text-4xl` + 一句 tagline + 单 CTA      |
| Login / Register | BlobOrbit `compact` | 标题 `text-2xl` + ModeSwitch + AuthField + CTA |
| Forgot password  | compact             | 同登录节奏，无 ModeSwitch                      |

---

## 3. 组件配方（照抄 className 意图）

### 3.1 主按钮（CTA）

```text
Button size="lg"
className: bg-primary h-14 rounded-full
           data-[active=true]:opacity-90
           data-[hover=true]:opacity-90
           data-[disabled=true]:opacity-60
ButtonText: text-primary-foreground text-base font-semibold
```

- 高度与输入一致：`h-14`。
- **满圆角**，不要 `rounded-2xl` / `rounded-lg`。

### 3.2 输入（AuthField）

封装：`components/auth/AuthField.tsx`（内部仍是 gluestack `Input`）。

```text
根: bg-muted h-14 rounded-full border-transparent px-5 shadow-none
    data-[focus=true]:border-foreground/20
字: text-foreground text-base
placeholder: text-muted-foreground
```

- 与 CTA、分段切换同一「胶囊」语言；禁止 Auth 页再写 `rounded-2xl` + `border-border` 方框。
- 登录 / 注册 / 忘记密码一律用 `AuthField`，不要平行再抄一套 className。

### 3.3 登录 / 注册切换（AuthModeSwitch）

不用 gluestack `Tabs`（FlatList + Indicator 盖字）。也不用 Reanimated / onLayout 滑块（H5 的 `Box` 是 div，传 `onLayout` 会报错白屏）。

选中态直接打在项上：

```text
容器: bg-muted w-full flex-row rounded-full p-1
项:   flex-1 rounded-full py-2.5；选中 bg-card，未选 bg-transparent
文案: text-sm font-medium；选中 text-foreground / 未选 text-muted-foreground
```

Tab 须常驻在 `login.tsx`（不要跟表单一起 `key` 重挂）。表单区：`FadeIn`（~200ms）。

### 3.4 标题层级

| 角色              | 用法                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| 品牌名（Welcome） | `text-foreground text-4xl font-bold tracking-tight`                           |
| 页标题（登录等）  | `text-foreground text-2xl font-bold`                                          |
| 副标题            | `text-muted-foreground text-sm`（Welcome tagline 可用 `text-base leading-6`） |
| 底栏说明          | `text-muted-foreground text-xs leading-5` 居中                                |
| 文字链（返回）    | `text-muted-foreground text-sm`，`Pressable` + `py-2`                         |

### 3.5 顶区装饰（BlobOrbit）

- 彩色扁平 Bot 脸环绕一圈；**整组**一路 Reanimated 轻浮，禁止每颗球各跑循环（真机掉帧）。
- Welcome 用正常尺寸；Login / Register / Forgot 用 `compact`。
- 不要用带棋盘/假透明底的位图替代；要静态图须纯色底（如白）或透明 PNG。

---

## 4. 颜色与主题

- 页面底：`bg-background`；弱底：`bg-muted`；浮层块：`bg-card`。
- 主操作：`bg-primary` / `text-primary-foreground`（跟 `GluestackUIProvider` 的 `mode`）。
- 正文 / 次文：`text-foreground` / `text-muted-foreground`。
- 禁止业务里写死 `#xxx` 做大面积 UI（Blob 脸品牌色除外，属装饰资产）。

---

## 5. 动效预算

| 场景          | 建议                                                      |
| ------------- | --------------------------------------------------------- |
| Auth 顶区     | 整组轻浮即可（1 路动画）                                  |
| 登录/注册 Tab | AuthModeSwitch 选中 bg-card（无绝对定位滑块）+ 表单轻淡入 |
| 按钮          | 仅 opacity active/hover                                   |
| 登录页        | 不要再加背景粒子、多球独立 bounce、整页 parallax          |

卡顿优先砍动画，不要靠降级成花哨 GIF 堆性能债。

---

## 6. 扩展到其它页时

1. **表单页**（设置项编辑、创建 Bot 等）：输入优先复用「胶囊 h-14 + muted」语言，或抽与 `AuthField` 同级的领域封装；主 CTA 仍 `rounded-full h-14`。
2. **信息列表 / 聊天**：不强行胶囊输入；聊天跟 gluestack chat-ai 官方树（见 AGENTS）。
3. **PC**：同一纵向构图 + `max-w-100` 居中，不为 Auth 做两栏。

---

## 7. 对照清单（改 Auth / 新表单时打勾）

- [ ] 壳是否走 `AuthShell`（或同等键盘 + 安全区）？
- [ ] 主按钮是否 `h-14 rounded-full`？
- [ ] 输入是否 `AuthField`（或视觉等价的满圆角胶囊）？
- [ ] 是否避免方框 `rounded-2xl` + 明显描边？
- [ ] 内容是否 `max-w-100` 居中？
- [ ] 顶区动画是否 ≤ 1 路持续驱动？
- [ ] 文案层级是否符合 §3.4？

---

## 8. 关键文件

| 路径                                 | 职责                    |
| ------------------------------------ | ----------------------- |
| `components/auth/AuthShell.tsx`      | 页壳 + 键盘             |
| `components/auth/BlobOrbit.tsx`      | 顶区品牌环              |
| `components/auth/AuthField.tsx`      | 胶囊输入                |
| `components/auth/AuthModeSwitch.tsx` | 等分滑动胶囊（非 Tabs） |
| `components/auth/LoginForm.tsx` 等   | 业务表单                |
| `app/(auth)/welcome.tsx`             | 品牌首屏基准            |
| `AGENTS.md`                          | 工程与多端硬约束        |
