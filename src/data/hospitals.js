// index.js 里 `p.intro || PENDING` 用到，来自这个文件而不是 helpers.js/projects.js
// 里各自另外定义的同名常量（三处 PENDING 各自模块内独立，值恰好都是 '待确认'）。
export const PENDING = '待确认';

// 6 家真实合作机构。img 字段是 images.js 里 IMGS 表的 key。
export const HOSPITALS = [
  { id: 'h_shinjuku', name: '新宿医院', region: 'jp', city: '〒160-0022 東京都新宿区新宿3丁目24-1 NEWNO・GS新宿 10階', img: 'img-cellastar-main', website: 'https://www.shinjukuclinic.com', isVirtual: false },
  { id: 'h_utopiart', name: 'UTOPIART CLINIC EBISU', region: 'jp', city: '〒150-0021 東京都渋谷区恵比寿西1-12-11 Biosビル5階', img: 'img-utopiart-main', website: 'https://utopiart.jp/', isVirtual: false },
  { id: 'h_iena21', name: 'Iena21', region: 'eu', city: "21 bis avenue d'Iena75116, Paris", img: 'img-iena-lounge', website: 'https://iena21.com/', isVirtual: false },
  { id: 'h_newstar', name: 'NEW STAR CLINIC', region: 'kr', city: '서울 서초구 강남대로 531 B722 빌딩 11층~14층', img: 'img-newstar-main', website: 'https://newstarclinic.co.kr/en', isVirtual: false },
  { id: 'h_lightmac', name: 'LIGHTMAC', region: 'hk', city: '门店1：銅鑼灣世貿中心店 香港銅鑼灣告士打道280號世貿中心3602-03室', img: 'img-lightmac-reception', website: 'https://lightmac.com/en/', isVirtual: false },
  { id: 'h_ganen', name: '感恩國際美容有限公司', region: 'mo', city: '澳門路義士若翰巴地士打街1-A號悦雅軒地下D', img: 'img-hian-reception', website: '', isVirtual: false },
];
