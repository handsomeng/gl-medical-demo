// 收到预约后并行做两件事：①转发一条文本消息到飞书群机器人（webhook 地址不写进前端代码，
// 避免暴露在页面源码里被任意调用）；②把预约信息转发给合作方的预约测试接口（对方要求地址
// 不能进源码/仓库）。两路互不阻塞：各自 try/catch，任一失败不影响另一路，也不影响给前端返回 200。
//
// 配置来源：优先读 api/config.js（本地配置文件，不进仓库，合作方自行部署习惯直接改文件），
// 读不到（文件不存在/没建）就兜底读环境变量 FEISHU_WEBHOOK_URL / PREBOOK_API_URL
// （Vercel 上继续用环境变量这条路）。
import { createHash } from 'node:crypto';

let fileConfig = {};
try {
  fileConfig = (await import('./config.js')).default || {};
} catch {
  fileConfig = {}; // config.js 不存在时行为和只用环境变量完全一致
}

const FETCH_TIMEOUT_MS = 8000;

// Vercel 函数跑在 UTC，对方要求按北京时间(UTC+8)生成 time 参数，不能用服务器本地时区。
function beijingTimeString(date = new Date()) {
  const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${beijing.getUTCFullYear()}-${pad(beijing.getUTCMonth() + 1)}-${pad(beijing.getUTCDate())} ${pad(beijing.getUTCHours())}:${pad(beijing.getUTCMinutes())}:${pad(beijing.getUTCSeconds())}`;
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function notifyFeishu(webhook, lines) {
  if (!webhook) return { ok: false, error: 'FEISHU_WEBHOOK_URL not configured' };
  try {
    const r = await fetchWithTimeout(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg_type: 'text', content: { text: lines.join('\n') } }),
    });
    const data = await r.json().catch(() => ({}));
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

async function notifyPreBook(payload) {
  const url = fileConfig.PREBOOK_API_URL || process.env.PREBOOK_API_URL;
  if (!url) return { ok: false, error: 'PREBOOK_API_URL not configured' };
  const orderNo = payload.id || '';
  const time = beijingTimeString();
  // 实测对方校验的拼接方式是无空格 md5(order_no + time)
  const sign = createHash('md5').update(`${orderNo}${time}`).digest('hex');
  const form = new URLSearchParams({
    order_no: orderNo,
    name: payload.name || '',
    phone: payload.phone || '',
    project: payload.proj || '',
    agency: `${payload.hosp || ''}（${payload.region || ''}）`,
    book_time: payload.date || '',
    fee: payload.price || '',
    expert: payload.referrer || '',
    time,
    sign,
  });
  try {
    const r = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const text = await r.text();
    let data = text;
    try { data = JSON.parse(text); } catch { /* 对方可能不返回 JSON，原样带回文本方便排查 */ }
    return { ok: r.ok, status: r.status, data };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch { body = {}; }
  }

  const {
    id = '', proj = '', hosp = '', region = '', date = '',
    price = '', name = '', phone = '', referrer = '',
  } = body;

  const lines = [
    'GOLONG 新预约提醒',
    `预约单号：${id}`,
    `姓名：${name}`,
    `手机号：${phone}`,
    `项目：${proj}`,
    `机构：${hosp}（${region}）`,
    `预约日期：${date}`,
    `费用：${price}`,
  ];
  if (referrer && String(referrer).trim()) lines.push(`预约达人：${referrer}`);

  const [feishu, prebook] = await Promise.all([
    notifyFeishu(fileConfig.FEISHU_WEBHOOK_URL || process.env.FEISHU_WEBHOOK_URL, lines),
    notifyPreBook({ id, proj, hosp, region, date, price, name, phone, referrer }),
  ]);

  res.status(200).json({ ok: true, feishu, prebook });
}
