# GOLONG 全球医疗官方预约平台 · 交互 Demo

面向合作方技术团队的交接文档。目标：让没接触过这个项目的开发者看懂现状、能部署、能在此基础上接功能。

在线演示：https://demogolong1.handsomeng.com

## 1. 项目简介

GOLONG 全球医疗官方预约平台的前端交互 demo，单页 H5（手机模型外壳 + 内容区，移动端访问会自动铺满全屏）。

当前数据规模：

- 6 家真实合作机构，覆盖日本（新宿医院、UTOPIART CLINIC EBISU）、法国巴黎（Iena21）、韩国首尔（NEW STAR CLINIC）、香港（LIGHTMAC）、澳门（感恩國際美容有限公司）
- 79 个真实项目（水光/肉毒/饱满填充/光电抗衰提拉/光电皮肤管理/基础光电/皮肤管理/干细胞/营养点滴，共 9 个分类）
- 8 条到店免费体验（各机构 1 条，点击可查看详情、可直接走预约流程）

数据口径：只展示客户 Excel 里标注为"真实项目"的条目，部分项目的价格标注来源是"虚拟价格"，产品侧已拍板这类项目本身是真的、价格当参考价正常展示，不加任何"示例/虚拟"标记。

## 2. 产品框架

页面流程：

```
首页（hero + 严选目的地横滑卡 + 严选机构列表）
  → 地区页（列出该地区下的合作机构）
    → 机构项目页（免费体验置顶 + 按分类分组展示 + 分类筛选 chips）
      → 项目详情页（简介 / 规格与价格 / 分类·价格·品牌属性·建议咨询 四宫格）
        → 预约三步：01 选择时间 → 02 个人信息（含选填字段"预约达人是谁"）→ 03 确认预约
          → 提交成功
→ 我的预约（查看历史提交记录）
```

底部有 4 个 tab：首页 / 地区 / 项目 / 我的（预约、确认页不显示 tabbar）。

交互要点：

- **免费体验置顶**：机构项目页里，免费体验分组永远排在所有分类分组最前面；列表排序上，免费 > 自有品牌（Bb LABORATORIES / 佰洛雅）> 其他，见 `src/data/helpers.js` 的 `sortProjects`
- **返回/收藏按钮固定定位**：详情页、机构项目页、地区详情页的返回箭头和收藏心形图标用 `position:absolute` 挂在视图根节点，滚动内容时不会跟着消失
- **移动端全屏适配**：手机模型容器宽度是 `min(430px, 100vw)`，移动端窗口宽度本身小于 430px 时自然铺满全屏；`index.html` 的 viewport 含 `maximum-scale=1, user-scalable=no`
- **预约达人字段**：预约第二步"个人信息"里的"预约达人是谁"是选填项，只有填了才会出现在确认页和飞书推送里
- **预约状态不持久化**：`useBooking` composable 里的 `myBookings`/`lastBooking` 是纯内存 state，刷新页面会清空，这是和原版一致的行为，不是遗漏

## 3. 技术形态

**Vue 3 + Vite 标准工程**，JavaScript（不用 TypeScript），路由用 `vue-router@4`。不用 Pinia，预约相关的跨视图状态用一个单例 composable（`useBooking`）管理，足够简单不需要引入状态管理库。

### 目录结构

```
index.html              Vite 入口，含启动加载屏（GOLONG 字标）与 SEO title/description
vite.config.js
package.json
api/
  notify-feishu.js      Vercel Serverless Function，原样保留，未改动
public/
  assets/                图片素材（Vite 把 public 目录直接映射到网站根路径）
src/
  main.js                应用入口，挂载 App 并移除启动加载屏
  App.vue                手机外壳布局（居中容器/铺满全屏）+ 路由过渡动画 + 底部 tabbar + 全局 toast/咨询弹窗
  router.js               8 个视图对应的路由表
  style.css                设计 Token（CSS variables）+ 全局样式 + 关键帧动画
  data/                    业务数据，明文 JS 模块，改数据直接改这里，不用解包任何东西
    regions.js             5 个地区
    hospitals.js            6 家机构
    freeGifts.js             8 条免费体验
    categories.js             9 个项目分类 + 中英文映射
    projects.js                79 个真实项目 + 免费体验伪项目生成函数
    images.js                   class-name → 素材路径映射表 + 占位 SVG 兜底
    helpers.js                   money/priceText/sortProjects 等工具函数
    index.js                      上面几个模块的汇总出口，含图片覆写规则（见文件内注释）
  composables/
    useBooking.js           预约三步状态 + 校验 + 提交 + 飞书推送（fetch /api/notify-feishu）
    useUI.js                  全局 toast + 咨询弹窗状态
  utils/style.js               背景图 inline style 小工具
  views/                        8 个页面：Home / Regions / Hospitals / Projects / Detail / Booking / Confirm / My
scripts/verify-data.mjs        轻量数据层校验脚本（不依赖测试框架）
```

### 本地开发

```bash
npm install
npm run dev              # 本地起 Vite dev server
npm run build             # 构建产物到 dist/
npm run preview           # 本地预览构建产物
npm run verify:data       # 校验数据层（机构数/项目数/免费体验价格文案/图片路径是否存在等）
```

### 改数据 / 改文案

直接改 `src/data/` 下对应的明文 JS 文件即可，`git diff` 能直接看出改了什么，不需要任何解包/重打包流程。

- 加一个机构：`src/data/hospitals.js`
- 加一个项目：`src/data/projects.js` 的 `REAL_PROJECTS` 数组，用 `excelProject({...})` 包一下（有默认字段兜底）
- 加一条免费体验：`src/data/freeGifts.js`，会自动生成对应的 `isFree:true` 伪项目
- 图片：素材放进 `public/assets/`，在 `src/data/images.js` 的 `IMGS` 表里加一条 `key -> '/assets/xxx.jpg'`，然后在机构/地区/项目的 `img` 字段填这个 key（不是直接填路径）

### 视觉设计 Token

`src/style.css` 顶部 `:root` 里的 CSS variables，从原 bundle 的内联样式里提炼出来的色板/字号/间距标准：米白底（`--bg: #F5F7F7`）+ 灰绿点缀（`--accent: #2E6068`）+ 衬线标题（Cormorant Garamond + Noto Serif SC，Google Fonts CDN 引入，不内嵌字体文件）+ eyebrow 小字大写字距。

## 4. 部署

**这是纯静态站点**，构建产物 `dist/` + `assets/`（已内含在 dist 里）丢到任意静态托管都能跑。

Vercel 对 Vite 项目会自动识别构建命令（`npm run build`）和输出目录（`dist`），`api/` 目录下的 Serverless Function 会和静态产物一起部署，不需要额外配置 `vercel.json`。仓库根目录已有 `.vercel/project.json`（关联的 Vercel 项目），直接 `vercel --prod` 或走 Git 集成自动部署即可。

唯一的动态部分是 `api/notify-feishu.js`：

- 这是一个 Vercel Serverless Function，用户提交预约时前端会 `fetch('/api/notify-feishu', { method: 'POST', body: JSON.stringify(payload) })`
- 该函数收到 payload 后并行做两件事，互不阻塞（各自 `try/catch`，任一失败不影响另一路，也不影响给前端返回 200）：
  1. 把 payload 转成一条文本消息，POST 到飞书群机器人 webhook
  2. 把 payload 转成 `application/x-www-form-urlencoded` 表单，POST 到合作方的预约测试接口（对方是 http，前端不能直连，只能走这个服务端转发；未配置时这一路直接跳过，不影响飞书那一路）
  3. fetch 都加了 8 秒超时（`AbortController`），避免对方接口不稳时把函数拖死
- 前端最终收到的响应形如 `{ ok: true, feishu: {...}, prebook: {...} }`，两路各自的成功/失败结果都在，方便排查

**两个地址（`FEISHU_WEBHOOK_URL`、`PREBOOK_API_URL`）都不写进代码和仓库**，支持两种配置方式，**配置文件优先于环境变量**：

- **a. 配置文件（推荐给自行部署的团队）**：复制 `api/config.example.js` 为 `api/config.js`，直接填两个字段的真实值。`api/config.js` 已被 `.gitignore`/`.vercelignore` 排除，不会进仓库、也不会被 `vercel` CLI 上传。合作方部署习惯是直接编辑配置文件，用这种方式最省事。
- **b. 环境变量（适合 Vercel 等平台）**：参考 `.env.example`，在 Vercel 项目 Settings → Environment Variables 里配置同名变量；`api/config.js` 不存在时，函数会自动兜底读环境变量，行为和只用环境变量完全一致。

两者都配置了的话，`api/config.js` 里的值优先生效。

预约提交的 payload 字段清单，以及转发给合作方预约接口时的字段映射：

| payload 字段 | 说明 | 转发给合作方接口时的字段名 |
| --- | --- | --- |
| `id` | 预约单号，格式 `GL` + 北京时间 `YYMMDD` + 5 位随机数，例如 `GL260714-58291`（浏览器端内存态生成，不依赖服务器） | `order_no` |
| `name` | 预约人姓名 | `name` |
| `phone` | 手机号 | `phone` |
| `proj` | 项目名称 | `project` |
| `hosp` + `region` | 机构名称 + 地区名称 | `agency`（拼成 `${hosp}（${region}）`，对方示例格式是机构名后括号带地址） |
| `date` | 预约日期（预约只选日期，不再选时段） | `book_time` |
| `price` | 费用（免费项目为"免费体验"文案，非数字） | `fee` |
| `referrer` | 预约达人（选填，未填时为空字符串） | `expert` |

合作方接口的响应格式（2026-07-14 实测）：`{"code":200,"message":"成功","success":true,"data":{...原样回显提交的字段...}}`。

**如果部署到自己的域名/服务器上**，两种做法二选一：

1. 保留 `/api/notify-feishu` 这个路径约定，在自己的后端框架里实现一个等效的转发端点（收 POST → 转发到飞书）；
2. 或者直接改 `src/composables/useBooking.js` 里 `fetch('/api/notify-feishu', ...)` 那行的目标地址，指向自己后端的接口。

## 5. 待开发（交接需求）

1. **预约提交后写入飞书多维表格**：用飞书开放平台自建应用（拿 `tenant_access_token`），调 [Bitable records API](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create) 写一条记录，字段对应第 4 节的 payload 清单。
2. **发飞书提醒**：群机器人 webhook 推送已经实现（见 `api/notify-feishu.js`），可以直接复用现有转发端点、在里面追加逻辑，也可以按需扩展成更丰富的消息卡片（`msg_type: 'interactive'`）。

**建议实现位置**：直接在 `api/notify-feishu.js` 这个转发端点里，收到预约 payload 后同时做"写多维表格"和"发群消息"两件事，前端不需要再改任何代码，也不用加新接口。

## 6. 数据来源

业务数据来自客户提供的 Excel《跨境医疗预约系统-信息收集表》，**该文件不在仓库里**（仓库根目录 `.gitignore` 已排除），只保留了加工后写入 `src/data/` 的结果。数据口径见第 1 节。

## 7. 历史版本

这个仓库之前是一个 Claude Design 工具产出的 React 自解包 bundle（单文件 `index.html`，约 9MB，需要 gzip+base64 解包才能改数据/改文案），2026-07-14 重构为本仓库描述的 Vue 3 + Vite 标准工程，功能和视觉 1:1 复刻，不新增功能不改设计。

如果需要参考旧版本的实现细节（bundle 解包方式、补丁历史等），看 git 历史：

- `16056f4` 之前：纯手写单文件 SPA（米白衬线杂志版），数据明文写在 JS 数组里
- `aa6119b` 之后、本次重构之前：Claude Design React bundle（凝白版 v2）
