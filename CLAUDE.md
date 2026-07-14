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

2026-07-13 修复：上条补丁打完浏览器报错「Unterminated string in JSON at position 186」。根因：`__bundler/template` 那行本质是 `<script type="__bundler/template">` 标签内联的一个 JSON 字符串，原始序列化器把字符串里所有 `</` 转义成 `</`，防止字符串内容里出现的 `<script>...</script>` 等标签把外层 `<script>` 标签提前截断。上一版补丁用 `json.dumps(html, ensure_ascii=False)` 重新序列化后没有做这个转义，导致字符串里残留的字面 `</script>`（比如 hero 区块里内联的 `<script src="...">` 占位标签）提前闭合了外层标签，浏览器解析到的 JSON 内容被截断成 186 字节就报错。修复：重新从 Desktop 原始文件出发打三处补丁，manifest 用 `json.dumps(obj, ensure_ascii=False, separators=(',',':'))`，template 用 `json.dumps(html, ensure_ascii=False).replace('</', '<\\u002F')` 精确复现原始转义规则，验证外层字节与原始文件在两个 script 块之外完全一致。node --check 通过，vm 沙箱断言 REGIONS/HOSPITALS/174条PROJECTS 的 img 全部落在10张新图内，主HTML含 notify-feishu、不含旧图路径。

2026-07-13 换首页hero图：新增 assets/hero-main.jpg，template块内 `heroSty('assets/clinic-tokyo-a.jpg')` 改为 `heroSty('assets/hero-main.jpg')`。实测发现该bundle无独立SSR静态HTML，hero元素是模板占位符`{{ heroStyle }}`绑定同一个state初始化表达式，clinic-tokyo-a.jpg在全文件仅此一处引用，故只需单点替换，无需按「多处引用只改hero那处」的方式处理。补丁沿用`</`→`</`转义规则，manifest及template外字节按切片方式保证逐字节不变。用加载器同款正则+JSON.parse验证解包无异常。

2026-07-13 交互修复8项+logo替换：①返回/收藏按钮从滚动容器挪到视图根(position:absolute;top:18px;z-index:30)，详情页/机构项目页各改一处；②showVirtualBadges默认true，去掉`官方合作机构`误导兜底(hospRows.brand/dNote均改用真实isVirtual判断，dNote新增dNoteStyle区分免费绿色)；③项目行渲染hospLine(已有数据字段未渲染)；④showTabs加入hospitals+地区tab在hospitals视图也高亮；⑤viewport加maximum-scale=1,user-scalable=no，手机号input加inputmode="numeric"；⑥submitBooking加_submitting锁防重复提交；⑦免费项目详情注释色改绿(#4A7C59，复用旧版--green值)；⑧品牌tile换成真实logo图片(assets/logo-bblab.png/logo-pluryal.png)+规范名称。补丁流程同上(template JSON.parse→字符串替换→json.dumps+`</`转义→切片拼接)，manifest字节未动。node --check通过，逐条断言(0处`官方合作机构`/default:true/hospLine×2/showTabs含hospitals/viewport含maximum-scale/_submitting/两个logo引用)全部通过。真机视觉验收待瀚森哥确认。

2026-07-13 补丁：修「高浪自有品牌」区块两处排版问题。①用PIL对assets/logo-bblab.png(480×480→287×405)、logo-pluryal.png(480×480→480×396)按非白内容bbox裁边+5%留白，去掉大片白边使logo在小尺寸下可见；②template里img样式height:32px改height:52px;max-width:80%，b.sub单字段("Bb LABORATORIES · 苾莱宝"式)拆成b.subEn/b.subZh两行居中堆叠(11px/letter-spacing .5px)，去掉「·」分隔符防止中文名腰斩换行。manifest未动，template JSON.parse+</转义规则验证通过。

2026-07-13 补丁：美化打包器默认加载屏（外层静态HTML，未动manifest/template）。title改「GOLONG 全球医疗官方预约平台」；thumbnail SVG从深青底GL换成米白底GOLONG字标+副标题+三点渐隐动画；右下角Unpacking气泡display:none隐藏；noscript文案改中文。diff确认line188/196（打包数据）与备份逐字节一致，manifest 115 keys/template JSON.parse均正常。

2026-07-13 补丁：英文点缀系统+BB前缀统一。①template加DESTINATIONS/PARTNER CLINICS/HOUSE BRANDS首页eyebrow、ABOUT/PRICING详情页小字、SCHEDULE/DETAILS/REVIEW预约步骤点缀、COMPLIMENTARY免费横幅点缀、hero eyebrow改CURATED MEDICAL AESTHETICS · WORLDWIDE；②REGIONS加nameEn(TOKYO/PARIS/SEOUL/HONG KONG/MACAU)渲染进地区卡片；③数据模块新增CAT_EN九分类英文映射，接入详情页分类badge与项目页分组标题；④数据模块「BB Labs-」前缀全量替换为「Bb LABORATORIES 」(实际10处，非预估45处，isOwnBrand=45不变)，template内残留的"BB Labs 品牌专区"toast文案同步统一。补丁流程同上(template JSON.parse+`</`转义/manifest gzip+base64重打包)，逐字节diff确认两script块之外内容与备份完全一致，node --check通过。

2026-07-13 修正：瀚森哥反馈hero eyebrow不要「Curated Medical Aesthetics · Worldwide」，改回「GOLONG Preventive Medicine」（全大写GOLONG，不用旧拼写Gaolong/Golong）。仅template补丁单点替换，其余英文点缀不动。断言notify-feishu=1/hero-main=1/官方合作机构=0/无未转义`</script`均通过，两script块外字节与备份一致。

2026-07-13 删模块+排障：①首页删「高浪自有品牌/HOUSE BRANDS」整块（标题+两个logo tile+sc-for），app内联脚本同步删vals.brands计算与默认值，不留死引用；assets/logo-bblab.png、logo-pluryal.png文件保留。②排查手机端「[bundle] error」提示条：外层加载器187行前window.addEventListener('error',...,true)是capture兜底，能捕获任何<img>/<script>/<link>资源404（error事件不冒泡但capture阶段能收到）。逐一核对template发现全文件仅一处原生<img>标签，就是刚删的品牌logo tile（唯一走真实网络请求的资源，其余图片全走CSS background-image不触发error事件，dc-runtime/数据模块/react/react-dom均走manifest本地blob零网络依赖），移动网络抖动导致该img偶发404即触发此提示，任务①删除该img等于直接消除根因，未额外改动加载器代码。断言manifest 115 keys/template JSON.parse/无未转义`</script`/notify-feishu=1/hero-main=1/GOLONG Preventive Medicine=1/HOUSE BRANDS=0/高浪自有品牌=2(仅剩单品own-brand标签)均通过，manifest字节与改动前逐字节一致(本轮只碰template)。

2026-07-13 大改：产品转向「只展示真实数据」。数据模块：①删h_ginza(THE GINZA CLINIC)、h_marceau(SKIN MARCEAU)两家虚拟机构及其PROJECTS/FREE_GIFTS；②其余机构下isVirtual:true的项目全删(51条，含h_lightmac/h_ganen里的虚拟项目)；③isVirtual:false项目全保留(含"虚拟价格"来源的，价格当参考价展示不加标记)；④REGIONS.cities去掉THE GINZA CLINIC/SKIN MARCEAU字样；⑤末尾图片映射覆写H表里h_ginza/h_marceau键留空未清，HOSPITALS.forEach只遍历剩余6家不会查到这两个键，确认无throw风险未动。最终：6家机构/79个真实项目/8条免费体验，PROJECTS总数87(79真实+8免费)。template：删机构行brand标签(「真实合作机构」绿色小字)+「示例」badge；删hasGift旁的机构示例警告条(projVirtualNote)；删项目行/详情页「示例数据」badge(p.virtual/dVirtual)；删dNote的isVirtual三元分支简化为固定"参考价格"；删死代码dDataAttr("示例数据"/"已确认"，从未被渲染)；showVirtualBadges相关全清(props读取、data-props声明键、showBadges变量、projectVals/detailVals/bookingVals签名里的该参数)，prefillDemo原样保留。全站grep确认「真实合作机构/虚拟合作机构/示例机构/示例数据/示例价格/官方合作机构/示例」均0处。vm沙箱跑数据模块断言HOSPITALS=6、无h_ginza/h_marceau、isVirtual:true=0、免费伪项目=8且hid全在剩余6家内，通过；manifest 115 keys/template JSON.parse/无未转义`</script`/notify-feishu=1/hero-main=1/GOLONG Preventive Medicine=1均通过；两script块外字节与改动前完全一致。

2026-07-13 新增 README.md：面向合作方技术团队的交接文档，讲清产品框架、bundle自解包技术形态（manifest/template结构+解包重打包Python示例+`</`转义踩坑说明）、部署方式（纯静态+notify-feishu是唯一动态端点）、预约payload字段清单、待开发需求（飞书多维表格写入+提醒）指路、旧版明文单文件架构(commit 16056f4)迁移建议。已commit+push到origin main(863504f)。

2026-07-13 图片真假混搭：新增3张真实图assets/real-newstar.jpg(46KB)/real-lightmac.jpg(124KB，sips -Z 1400压缩)/real-device.jpg(48KB)，源自_source/图片总库/excel提取/image19·25·14.jpeg，sips质量72转码。数据模块(manifest f84578bf)补丁：①IMGS表加3个新键；②H机构图映射改为h_shinjuku→img-cellastar-main(真)/h_utopiart→img-tokyo-b(AI不变)/h_iena21→img-iena-corridor(真)/h_newstar→img-newstar-real(真)/h_lightmac→img-lightmac-real(真)/h_ganen→img-macau(AI不变)；③C分类场景图映射光电四类(光电抗衰提拉/光电皮肤管理/基础光电/皮肤管理)从img-device改img-device-real，干细胞营养点滴水光肉毒饱满填充保持AI不变。最终机构头图4真2AI，光电类27个真实项目走真图，其余52个真实项目+8个免费项目仍AI场景图，地区卡/hero不动。vm沙箱断言6家机构img路径、光电四类=real-device、其余分类=scene-iv/injection、免费=scene-consult全部通过；manifest 115 keys/template字节与改动前完全一致(本轮只碰manifest)。

2026-07-14 地区卡真假混搭：新增assets/real-paris.jpg(206KB，源image16.jpeg巴黎奥斯曼窗诊疗室实拍，sips压至1400宽/质量72)，IMGS加img-paris-real键；R地区图映射eu改img-paris-real(真)、hk改img-lightmac-real(复用机构真图)，jp/kr/mo保持AI不变。vm断言REGIONS五地区imgFor全部命中预期路径通过；manifest 115 keys/template字节与改动前完全一致(只碰manifest)。

2026-07-14 重构：从React自解包9MB单文件bundle改造成Vue 3 + Vite标准工程（交接合作方技术团队指定技术栈）。解包提取原bundle的数据模块(REGIONS/HOSPITALS/FREE_GIFTS/PROJECTS/CATS_ALL/CAT_EN/IMGS/imgFor/priceText/sortProjects等)和template(内联app逻辑+CSS+页面结构)，1:1复刻成8个视图(Home/Regions/Hospitals/Projects/Detail/Booking/Confirm/My)+vue-router路由+useBooking/useUI composable(不用Pinia)。数据平移到src/data/明文JS模块；assets/整体挪到public/assets/；字体改Google Fonts CDN(Cormorant Garamond+Noto Serif SC)不内嵌；api/notify-feishu.js原样保留。node scripts/verify-data.mjs断言6机构/79真实项目/8免费/87总数/无isVirtual残留/免费项目priceText不含¥0/imgFor全部命中public/assets文件，全部通过；npm run build成功(dist产物23个文件)；npm run dev起停验证正常。旧9MB index.html已被Vite入口替换，历史版本见git log(16056f4之前明文单文件版/aa6119b之后凝白版bundle)。README.md同步重写为Vue工程说明。

2026-07-14 修复reviewer提出6项问题：①submitBooking成功后state.booking=null，防止重进/booking/:id落在step3重复下单，Confirm页靠lastBooking不受影响；②新增vercel.json做SPA fallback，排除/api/前缀；③防重锁_submitting复位挪到startBooking(此前每次submitBooking内同步复位=锁形同虚设)，并加`!state.booking`早退guard，node自测三场景(连续await两次/startBooking后再提交/Promise.all并发连点)全部通过：myBookings与fetch调用次数严格对应实际提交数；④分类chips选中态新增src/composables/useFilter.js做模块级共享state，替换Projects.vue组件内ref，删掉因:key强制remount而永不触发的死watch，TabBar「项目」按钮点击时调resetCat()；⑤Home.vue .hero-text .eyebrow的text-transform: none改uppercase；⑥字体自托管：从git历史9MB bundle解包__bundler/manifest里111个font/woff2资产写入public/fonts/{uuid}.woff2，解包__bundler/template提取535条@font-face规则(src改写成/fonts/{uuid}.woff2)生成src/fonts.css并在main.js引入，index.html删Google Fonts CDN link。npm run build通过(dist无fonts.googleapis.com引用，dist/fonts111个文件，535条@font-face全部对应)，node scripts/verify-data.mjs全部通过。

2026-07-14 接入合作方预约测试接口。api/notify-feishu.js 拆成 notifyFeishu/notifyPreBook 两个函数，Promise.all 并行执行、互不阻塞（各自 try/catch，任一失败不影响另一路，都返回200，结果都塞进响应JSON方便排查）；notifyPreBook 用 URLSearchParams 编码转发到 PREBOOK_API_URL(环境变量，默认值 <PREBOOK_API_URL>)，字段映射 id→order_no/name→name/phone→phone/proj→project/`${hosp}（${region}）`→agency/`${date} ${time}`→book_time/price→fee/referrer→expert；两路 fetch 都加 AbortController 8秒超时。node --check通过；本地用真实示例payload实测调通对方测试接口，返回`{"code":200,"message":"成功","success":true,"data":{...}}`；用.cjs副本跑通完整handler(feishu因本地无webhook走error分支、prebook成功)确认两路结果都正确塞进响应JSON、互不影响。README.md第4节补充双路转发说明+字段映射表+对方接口响应格式。

2026-07-14 瀚森哥预览反馈4项：①去掉「我的」：删src/views/My.vue，router.js删/my路由，App.vue TabBar只剩首页/地区/项目三个、删goMy和my高亮分支；Confirm.vue「我的预约」按钮同步删(路由已不存在)，「返回首页」保留改整行；myBookings数组本身不动(GL2607编号仍靠它length生成)；Detail.vue收藏toast文案「已收藏到「我的」」顺带改「已收藏」(原文案指向的页面已不存在)。②删详情页咨询按钮：Detail.vue action-bar只留「立即预约」整行；连带清死代码——useUI.js删openConsultModal/closeModal/submitConsult/modalText(只剩toast)，App.vue删咨询bottom-sheet弹窗整块，style.css删.modal-sheet/.modal-handle/.modal-cancel/sheetUp关键帧(bottom-sheet专属，无调用方)。③④Confirm.vue：新增showSuccessModal，进入/confirm且有lastBooking时自动弹「预约提交成功/工作人员会在48小时之内联系您」居中弹窗(知道了关闭)，复用改造后的.modal-overlay(居中版，原是bottom-sheet布局)+新增.modal-card/cardPop动画；删「扫码添加顾问」QR区块，换成居中小字「📷 建议截图保存本页，留存您的预约凭证」。npm run build通过；grep确认无/my路由、无My.vue引用、无consult相关死代码残留。
