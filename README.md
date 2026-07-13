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
首页（hero + 严选目的地横滑卡 + 严选机构2列网格）
  → 地区页（列出该地区下的合作机构）
    → 机构项目页（免费体验置顶 + 按分类分组展示）
      → 项目详情页（简介 / 规格与价格 / 分类·价格·品牌属性·建议咨询 四宫格）
        → 预约三步：01 选择时间 → 02 个人信息（含选填字段"预约达人是谁"）→ 03 确认预约
          → 提交成功
→ 我的预约（查看历史提交记录）
```

底部有 5 个 tab：首页 / 地区 / 全部项目 / （预约中不显示）/ 我的。

交互要点：

- **免费体验置顶**：机构项目页里，免费体验分组永远排在所有分类分组最前面；列表排序上，免费 > 自有品牌（Bb LABORATORIES / 佰洛雅）> 其他，见数据模块 `sortProjects`
- **返回/收藏按钮固定定位**：详情页、机构项目页的返回箭头和收藏心形图标用 `position:absolute` 挂在视图根节点，滚动内容时不会跟着消失
- **移动端全屏适配**：`@media (max-width: 480px)` 下手机模型的边框/刘海/状态栏隐藏，内容区铺满 `100vw/100dvh`
- **预约达人字段**：预约第二步"个人信息"里的"预约达人是谁"是选填项，只有填了才会出现在确认页和飞书推送里

## 3. 技术形态（重点，如实写）

**这不是一个常规的手写 HTML/JS 项目**，需要先理解它的打包结构才能改动。

`index.html`（约 9MB）是 Claude Design 工具产出的 React 自解包 bundle，运行时结构是：

- **外层加载器**（文件最前面约 186 行的普通 HTML + `<script>`）：负责在浏览器里把下面两块解包、拼装成真正的页面并挂载执行。这部分是纯静态逻辑，不含业务代码。
- **`<script type="__bundler/manifest">`**：一个 JSON，115 个资产条目（uuid → `{mime, compressed, data}`），`data` 是 gzip 压缩后的 base64。绝大部分是字体文件和一份很大的 dc-runtime（React 渲染引擎）JS。
- **`<script type="__bundler/template">`**：一整个 HTML 页面被 `JSON.stringify` 成的**字符串**（不是普通 HTML，是 JSON 字符串字面量）。里面既有页面的 DOM 结构标记（用 `sc-if`/`sc-for`/`{{ }}` 这种自定义模板语法写视图），也有一段 `<script type="text/x-dc">` 内联应用逻辑（状态管理、路由栈、各视图的取数与渲染绑定，都是这一段）。

**业务数据（机构/项目/价格/分类等）在哪**：manifest 里 uuid 为 `f84578bf-475e-46f2-ba41-544f098a6e61` 的那个资产，是一份 ES module（`REGIONS`/`HOSPITALS`/`PROJECTS`/`FREE_GIFTS`/`CATS_ALL` 等常量 + 若干工具函数），同样是 gzip+base64 存在 manifest 里，不是明文躺在 HTML 里能直接搜到的。

### 怎么改数据 / 改文案

不能直接在 `index.html` 里搜索文字改，必须走"解包 → 改 → 重新打包"的流程。以下是实际验证过的 Python 示例（改数据模块）：

```python
import re, json, gzip, base64

PATH = 'index.html'
with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 取出 manifest，定位数据资产
manifest_re = re.search(r'<script type="__bundler/manifest">(.*?)</script>', content, re.S)
manifest = json.loads(manifest_re.group(1))
key = 'f84578bf-475e-46f2-ba41-544f098a6e61'
entry = manifest[key]
raw = base64.b64decode(entry['data'])
data_js = gzip.decompress(raw).decode('utf-8')   # 这就是可读的 JS 源码，改这个字符串

# ... 对 data_js 做字符串替换/正则处理 ...

# 2. 重新压缩塞回 manifest
compressed = gzip.compress(data_js.encode('utf-8'), mtime=0)
entry['data'] = base64.b64encode(compressed).decode('ascii')
new_manifest_json = json.dumps(manifest, ensure_ascii=False, separators=(',', ':'))
content = content[:manifest_re.start(1)] + new_manifest_json + content[manifest_re.end(1):]

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(content)
```

改页面结构/文案（template）同理，但**有一个必须知道的坑**：

```python
template_re = re.search(r'<script type="__bundler/template">(.*?)</script>\n</body>', content, re.S)
template_html = json.loads(template_re.group(1))   # 解出真正的 HTML 字符串

# ... 对 template_html 做字符串替换 ...

# 重新序列化时，必须把字符串里所有的 "</" 转义成 "</"，
# 不能直接用 json.dumps(template_html, ensure_ascii=False)！
new_template_raw = json.dumps(template_html, ensure_ascii=False).replace('</', '<\\u002F')
content = content[:template_re.start(1)] + new_template_raw + content[template_re.end(1):]
```

**为什么必须做 `</` → `</` 转义**：`template_html` 这个字符串内部本身含有字面的 `<script src="...">...</script>`（比如首页 hero 区块里嵌的占位标签）。原始文件的序列化器把字符串里所有 `</` 都转义过，防止这些字面 `</script>` 提前把外层真正的 `<script type="__bundler/template">` 标签闭合掉。如果重新序列化时漏了这一步，浏览器解析到提前闭合的 `</script>`，后面的 JSON 内容就被截断，会报类似 `Unterminated string in JSON at position 186` 的错误，页面直接打不开。这是我们踩过的实际的坑，务必保留这个转义。

改完之后建议至少做这几项验证：manifest 解出来还是 115 个 key；template 那段 `json.loads` 不报错；用正则确认 template 原始字符串里没有未转义的裸 `</`；数据模块单独存成 `.js` 用 `node --input-type=module --check` 过一遍语法。

### 如果需要频繁改数据，建议换架构

这套 bundle 结构是 Claude Design 工具的产出物，**不是为了方便手动维护设计的**：数据是 gzip+base64 压缩过的二进制内容，改一次数据要走上面那套解包/重打包流程，没法直接 `git diff` 看出改了什么，协作和 code review 成本都偏高。

仓库里 `16056f4`（"米白衬线杂志版：完整数据+预约+飞书推送+GPT配图"）这个 commit 是切换到当前 Claude Design 版本之前的旧实现：**纯手写单文件 SPA，数据就是明文写在 JS 数组里的**（`REGIONS`/`HOSPITALS`/`PROJECTS` 等常量直接可读可改，用普通编辑器搜索替换即可），业务逻辑和视图渲染也是手写的，不依赖任何自解包框架。如果对方研发团队后续需要经常性地改数据、加字段、调交互，**建议把当前凝白版的视觉样式移植到 `16056f4` 这套旧架构上**，用 `git show 16056f4:index.html` 拿到旧版全文对照即可，长期可维护性会好很多。

## 4. 部署

**这是纯静态站点**，`index.html` + `assets/` 丢到任意 nginx / 静态托管（Vercel / Netlify / OSS+CDN 等）都能跑，没有服务端渲染依赖。

唯一的动态部分是 `api/notify-feishu.js`：

- 这是一个 Vercel Serverless Function，用户提交预约时前端会 `fetch('/api/notify-feishu', { method: 'POST', body: JSON.stringify(payload) })`
- 该函数把 payload 转成一条文本消息，POST 到飞书群机器人 webhook
- webhook 地址不写死在代码里，走环境变量 `FEISHU_WEBHOOK_URL`（Vercel 项目设置里配置）

预约提交的 payload 字段清单：

| 字段 | 说明 |
| --- | --- |
| `id` | 预约单号 |
| `proj` | 项目名称 |
| `hosp` | 机构名称 |
| `region` | 地区名称 |
| `date` | 预约日期 |
| `time` | 预约时段 |
| `price` | 费用（免费项目为"免费体验"文案，非数字） |
| `name` | 预约人姓名 |
| `phone` | 手机号 |
| `referrer` | 预约达人（选填，未填时为空字符串） |

**如果部署到自己的域名/服务器上**，两种做法二选一：

1. 保留 `/api/notify-feishu` 这个路径约定，在自己的后端框架里实现一个等效的转发端点（收 POST → 转发到飞书）；
2. 或者直接改前端里 `fetch('/api/notify-feishu', ...)` 那行的目标地址，指向自己后端的接口。这处 fetch 在 `index.html` 里的 template 内联应用脚本里（`submitBooking` 函数附近），改法同"第 3 节改数据"的流程，只是操作对象是 template 而不是数据模块。

## 5. 待开发（交接需求）

1. **预约提交后写入飞书多维表格**：用飞书开放平台自建应用（拿 `tenant_access_token`），调 [Bitable records API](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create) 写一条记录，字段对应第 4 节的 payload 清单。
2. **发飞书提醒**：群机器人 webhook 推送已经实现（见 `api/notify-feishu.js`），可以直接复用现有转发端点、在里面追加逻辑，也可以按需扩展成更丰富的消息卡片（`msg_type: 'interactive'`）。

**建议实现位置**：直接在 `api/notify-feishu.js` 这个转发端点里，收到预约 payload 后同时做"写多维表格"和"发群消息"两件事，前端不需要再改任何代码，也不用加新接口。

## 6. 数据来源

业务数据来自客户提供的 Excel《跨境医疗预约系统-信息收集表》，**该文件不在仓库里**（仓库根目录 `.gitignore` 已排除），只保留了加工后写入数据模块的结果。数据口径见第 1 节。

## 7. 目录结构

```
index.html          单文件 bundle，含加载器 + 打包资产 + 页面模板（详见第 3 节）
api/
  notify-feishu.js  Vercel Serverless Function，预约提交转发飞书群机器人
assets/              图片素材，命名规则：
  clinic-*.jpg         机构/地区实景图（如 clinic-tokyo-a.jpg、clinic-paris.jpg）
  scene-*.jpg          场景图（按项目分类映射，如 scene-injection.jpg 用于水光/肉毒/饱满填充类）
  hero-main.jpg        首页 hero 大图
  logo-*.png           自有品牌 logo（Bb LABORATORIES / 佰洛雅）
  *-reception/-room/-treatment/-lounge/-corridor.jpg  各机构门店实景分场景图
CLAUDE.md            改动日志，每次改动后追加一条，记录做了什么、为什么、怎么验证的，接手前建议通读一遍
```
