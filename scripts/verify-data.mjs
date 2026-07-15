// 轻量数据层校验脚本：node scripts/verify-data.mjs
// 不依赖测试框架，直接跑断言，失败时 exit(1)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOSPITALS, PROJECTS, FREE_GIFTS, REGIONS, priceText, imgFor, IMGS } from '../src/data/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicAssets = path.join(__dirname, '..', 'public', 'assets');

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error('✗ ' + msg);
  } else {
    console.log('✓ ' + msg);
  }
}

assert(HOSPITALS.length === 6, `HOSPITALS.length === 6 (实际 ${HOSPITALS.length})`);
assert(REGIONS.length === 5, `REGIONS.length === 5 (实际 ${REGIONS.length})`);
assert(FREE_GIFTS.length === 8, `FREE_GIFTS.length === 8 (实际 ${FREE_GIFTS.length})`);

const freeProjects = PROJECTS.filter((p) => p.isFree);
const realProjects = PROJECTS.filter((p) => !p.isFree);
assert(freeProjects.length === 8, `免费伪项目数 === 8 (实际 ${freeProjects.length})`);
assert(realProjects.length === 79, `真实项目数 === 79 (实际 ${realProjects.length})`);
assert(PROJECTS.length === 87, `PROJECTS.length === 87 (实际 ${PROJECTS.length})`);

const virtualLeft = PROJECTS.filter((p) => p.isVirtual === true);
assert(virtualLeft.length === 0, `无 isVirtual:true 残留 (实际 ${virtualLeft.length})`);

const freeWithZero = freeProjects.filter((p) => /¥0(?!\d)/.test(priceText(p)));
assert(freeWithZero.length === 0, `免费项目 priceText 不含 ¥0 (实际残留 ${freeWithZero.length} 条)`);
freeProjects.forEach((p) => assert(priceText(p) === '免费体验', `免费项目 ${p.id} priceText === "免费体验" (实际 "${priceText(p)}")`));

// 所有非免费项目必须有有效价格（数字 > 0），从源头防止漏价格的数据上线导致前端显示「详询顾问」。
const realWithoutPrice = realProjects.filter((p) => !(typeof p.price === 'number' && p.price > 0));
assert(realWithoutPrice.length === 0, `所有非免费项目都有有效价格(数字>0) (实际缺失 ${realWithoutPrice.length} 条${realWithoutPrice.length ? ':\n  ' + realWithoutPrice.map((p) => p.id).join('\n  ') : ''})`);

// imgFor 命中的路径必须都是 public/assets 下真实存在的文件（排除内联 SVG 占位图）。
const missingFiles = [];
const checkImgFor = (cls, ctx) => {
  const url = imgFor(cls);
  if (url.startsWith('data:')) return; // 占位 SVG，跳过
  const rel = url.replace(/^\//, '');
  const filePath = path.join(__dirname, '..', 'public', rel);
  if (!fs.existsSync(filePath)) missingFiles.push(`${ctx}: ${cls} -> ${url}`);
};
REGIONS.forEach((r) => checkImgFor(r.img, `region ${r.id}`));
HOSPITALS.forEach((h) => checkImgFor(h.img, `hospital ${h.id}`));
PROJECTS.forEach((p) => checkImgFor(p.img, `project ${p.id}`));
assert(missingFiles.length === 0, `imgFor 全部命中 public/assets 下存在的文件 (缺失 ${missingFiles.length} 条${missingFiles.length ? ':\n  ' + missingFiles.join('\n  ') : ''})`);

// public/assets 目录真实存在且非空，交叉确认 IMGS 表里非占位的 key 都指向存在文件。
assert(fs.existsSync(publicAssets), 'public/assets 目录存在');
const imgKeysMissing = Object.entries(IMGS).filter(([, url]) => !fs.existsSync(path.join(__dirname, '..', 'public', url.replace(/^\//, ''))));
assert(imgKeysMissing.length === 0, `IMGS 表全部 key 对应文件存在 (缺失 ${imgKeysMissing.length} 条)`);

if (failed > 0) {
  console.error(`\n共 ${failed} 项校验失败`);
  process.exit(1);
} else {
  console.log('\n全部数据层校验通过');
}
