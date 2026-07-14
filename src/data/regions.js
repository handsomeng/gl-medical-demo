// 5 个地区。img 字段是 images.js 里 IMGS 表的 key，末尾的覆写逻辑（见 index.js）会把
// 部分地区改成真实实拍图。
export const REGIONS = [
  { id: 'jp', name: '日本', nameEn: 'TOKYO', flag: '🇯🇵', cities: '新宿医院 · UTOPIART CLINIC EBISU', img: 'img-japan' },
  { id: 'eu', name: '法国巴黎', nameEn: 'PARIS', flag: '🇫🇷', cities: 'Iena21', img: 'img-europe' },
  { id: 'kr', name: '韩国首尔', nameEn: 'SEOUL', flag: '🇰🇷', cities: 'NEW STAR CLINIC', img: 'img-korea' },
  { id: 'hk', name: '香港', nameEn: 'HONG KONG', flag: '🇭🇰', cities: 'LIGHTMAC', img: 'img-hk' },
  { id: 'mo', name: '澳门', nameEn: 'MACAU', flag: '🇲🇴', cities: '感恩國際美容有限公司', img: 'img-macau' },
];
