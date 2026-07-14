import { REGIONS } from './regions.js';
import { HOSPITALS, PENDING } from './hospitals.js';
import { FREE_GIFTS } from './freeGifts.js';
import { CATS_ALL, CATS, CAT_EN } from './categories.js';
import { REAL_PROJECTS, buildFreeProjects } from './projects.js';
import { money, priceText, sortProjects, hasPrice } from './helpers.js';
import { IMGS, PH_SVG, imgFor } from './images.js';

export const PROJECTS = [...REAL_PROJECTS, ...buildFreeProjects(FREE_GIFTS, HOSPITALS, money)];

// 图片映射覆写：部分地区/机构/分类换成真实实拍图，其余保持 AI 生成场景图。
// 对应原 bundle 数据模块末尾的 IIFE（详见 CLAUDE.md 2026-07-13/07-14 记录）。
const REGION_IMG_OVERRIDE = { jp: 'img-tokyo-a', eu: 'img-paris-real', kr: 'img-seoul', hk: 'img-lightmac-real', mo: 'img-macau' };
REGIONS.forEach((r) => { if (REGION_IMG_OVERRIDE[r.id]) r.img = REGION_IMG_OVERRIDE[r.id]; });

const HOSPITAL_IMG_OVERRIDE = {
  h_shinjuku: 'img-cellastar-main', h_utopiart: 'img-tokyo-b', h_iena21: 'img-iena-corridor',
  h_newstar: 'img-newstar-real', h_lightmac: 'img-lightmac-real', h_ganen: 'img-macau',
};
HOSPITALS.forEach((h) => { if (HOSPITAL_IMG_OVERRIDE[h.id]) h.img = HOSPITAL_IMG_OVERRIDE[h.id]; });

const CAT_IMG_OVERRIDE = {
  干细胞: 'img-iv', 营养点滴: 'img-iv',
  水光: 'img-injection', 肉毒: 'img-injection', 饱满填充: 'img-injection',
  光电抗衰提拉: 'img-device-real', 光电皮肤管理: 'img-device-real', 基础光电: 'img-device-real', 皮肤管理: 'img-device-real',
};
PROJECTS.forEach((p) => {
  if (p.isFree) p.img = 'img-consult';
  else if (CAT_IMG_OVERRIDE[p.cat]) p.img = CAT_IMG_OVERRIDE[p.cat];
});

export const hospital = (id) => HOSPITALS.find((h) => h.id === id);
export const project = (id) => PROJECTS.find((p) => p.id === id);
export const region = (id) => REGIONS.find((r) => r.id === id);
export const projByRegion = (rid) => PROJECTS.filter((p) => hospital(p.hid).region === rid);
export const projByHosp = (hid) => PROJECTS.filter((p) => p.hid === hid);
export const hospByRegion = (rid) => HOSPITALS.filter((h) => h.region === rid);
export const freeGiftsFor = (hid) => FREE_GIFTS.filter((g) => g.hid === hid);

export { REGIONS, HOSPITALS, FREE_GIFTS, CATS_ALL, CATS, CAT_EN, PENDING, money, priceText, sortProjects, hasPrice, IMGS, PH_SVG, imgFor };
