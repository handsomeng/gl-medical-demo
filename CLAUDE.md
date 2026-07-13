# gl-medical-demo

高浪「海外医疗预约系统」交互原型，单文件 `index.html`。

2026-06-18：重写 v2。从写死页面改为数据驱动 SPA（REGIONS/HOSPITALS/PROJECTS/STREAMER 数据 + VIEWS 渲染 + 导航栈）。双端：客户端（地区→医院→项目→详情→三步预约带校验→确认→我的预约）+ 主播工作台（转化漏斗/客户台账/收益分成/专属链接）。底部「演示视角」可切两端。设计沿用米白衬线杂志风。

2026-07-08：接入客户 Excel 完整数据（8机构/164项目/9分类/10免费赠品）。自有品牌(BB Labs/佰洛雅)项目全局前置排序；免费体验横幅+机构分类分组展示；示例数据(isVirtual)加醒目 badge；机构内同品牌图片轮换避免单图重复；新增韩国区域/NEW STAR CLINIC 渐变占位图；hero 文案升级。node --check 验证语法通过。

2026-07-08 补丁：经确认 STREAMER 主播工作台是客户主动要求拿掉的功能，不是误删，故不恢复。本轮只修：首页严选项目 fcard 加 virtualBadge()；freeGiftBanner() 金额改用 money() 千分位格式化；h_ginza/h_marceau（示例机构，共35条项目）img 换成新增的 .img-ginza-main/.img-marceau-main 渐变占位图，不再复用新宿/Iena21真实门店照片；desk-panel 免费体验文案改为「8 家机构 · 10 项赠品」准确表述。node --check 验证通过。

2026-07-08 五点反馈修复：①详情页删除官网展示区块(仅UI，数据字段保留)；②freeGiftBanner()视觉加强(绿色边框+阴影+放大图标)；③核心bug：.dround从absolute改fixed+.phone加transform:translateZ(0)建立fixed定位包含块，修复详情页/机构头图返回按钮滚动消失；④.img-korea叠加内联SVG几何纹理，不再是纯色块；⑤首页hero文案改为「预约海外正品医美/日本·法国·韩国·香港」直给表述。node --check 验证通过。

2026-07-08：首页 hero 标题改为「GOLONG全球医疗 / 官方预约平台」（两行）；右侧内容完成度看板标题同步改为「GOLONG全球医疗内容框架」，保持一致。地区说明段落保留不变。

2026-07-08 三点修复：①GAOLONG→GOLONG全站统一(title/eyebrow/GOLONG MEMBER)；②FREE_GIFTS 自动生成10条isFree伪PROJECTS记录(free_${hid}_${i})，可点详情/预约，priceText/checkoutText/sortProjects加isFree分支(免费>自有品牌排序，价格显示"免费体验"不出现¥0)，机构详情页免费卡片顶置于分类分组之外；③首页"严选项目"精选区删除，改为.hgrid/.hgcard 8机构2列网格，点击进 navigate('projects',{hid})。node --check + vm沙箱跑通PROJECTS/VIEWS验证通过。

2026-07-08：预约表单第二步新增选填字段「预约达人是谁」（state.booking.referrer），确认页仅在填写时显示，写入 myBookings 记录。node --check 验证通过。

2026-07-08：新增 /api/notify-feishu.js（Vercel serverless function），预约提交时把基础信息推送到飞书群机器人，webhook 存 Vercel 环境变量 FEISHU_WEBHOOK_URL 不进代码。

2026-07-09：删除桌面端右侧「内容完成度看板」(desk-panel，含全部相关CSS)；新增 @media(max-width:480px) 移动端适配，真机访问时手机模型边框/刘海/statusbar 消失，.phone 铺满 100vw/100dvh。

2026-07-09：老板反馈处理。①BB Labs 短标改为灰色 LOGO 占位框(BRANDS加pendingLogo标记，后续替换成真实logo图片)；②图片素材全部换成统一品牌纹理占位(.img-ph-a/b/c，REGIONS/HOSPITALS/PROJECTS用PLACEHOLDER_IMGS覆写)，避免真实照片与项目文案不匹配的问题，旧的机构真实照片CSS class暂留未删，等设计侧出真实素材后再逐条换回。真实图片制作交给GPT另行处理，本轮不做文案规范化。

2026-07-13：接入10张GPT生成配图（6张机构地区图+4张场景图），替换占位纹理。REGIONS/HOSPITALS按地区/机构直接映射真图；PLACEHOLDER_IMGS覆写逻辑改为CAT_IMG_MAP按项目分类映射(干细胞/营养点滴→img-iv，水光/肉毒/饱满填充→img-injection，光电类→img-device)；免费项目统一用img-consult；首页hero改img-tokyo-a；.img-macau复用原有类名直接更新图片source避免CSS选择器重复；.img-ph-a/b/c及旧真实照片class保留兜底。node --check通过，vm沙箱跑数据层断言174条PROJECTS(164真实+10免费)img全部落在合法类集合内，REGIONS/HOSPITALS映射与规格一致。

2026-07-13：切换到凝白版v2（Claude Design React bundle，桌面版9MB自解包单文件）。米白衬线杂志旧版已提交为回滚点(commit 16056f4)。对bundle做了三处补丁：①数据资产(f84578bf)的IMGS表全部指向10张GPT新图+末尾追加地区/机构/分类映射覆写；②内联app脚本submitBooking加飞书推送(fetch /api/notify-feishu，免费项目price去HTML标签)；③SSR首屏静态标记旧图URL全量替换保持hydration前后一致。补丁脚本方式：解包line188(gzip+base64资产)/line196(JSON主HTML)→字符串补丁→重打包。数据JS node --check通过，全部图片引用断言落在10张新图内。
