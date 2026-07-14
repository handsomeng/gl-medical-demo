export const money = (n) => '¥' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const hasPrice = (p) => typeof p.price === 'number' && p.price > 0;

export const PENDING = '待确认';

export const priceText = (p) => (p.isFree ? '免费体验' : hasPrice(p) ? money(p.price) + (p.starts ? ' 起' : '') : PENDING);

// 免费 > 自有品牌（Bb LABORATORIES / 佰洛雅）> 其他
export const sortProjects = (list) =>
  list.slice().sort((a, b) => (b.isFree ? 1 : 0) - (a.isFree ? 1 : 0) || ((b.isOwnBrand ? 1 : 0) - (a.isOwnBrand ? 1 : 0)));
