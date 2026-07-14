import { reactive } from 'vue';
import { project, hospital, priceText, money } from '../data/index.js';

// 预约三步状态 + 提交逻辑 + 飞书推送，跨视图共享（单例，不是每次 setup 都新建一份）。
// 不做持久化：原 bundle 里 myBookings 也是纯内存 state，刷新页面即清空，这里保持一致。
const state = reactive({
  booking: null, // { projectId, step, date, name, phone, passport, referrer, errors }
  lastBooking: null,
  myBookings: [],
  _submitting: false,
});

function startBooking(projectId, prefillDemo = false) {
  state._submitting = false;
  state.booking = {
    projectId,
    step: 1,
    date: 8,
    name: prefillDemo ? '陈女士' : '',
    phone: prefillDemo ? '13800138991' : '',
    passport: '',
    referrer: '',
    errors: {},
  };
}

function goStepNext() {
  const b = state.booking;
  if (!b) return false;
  if (b.step === 1) {
    if (!b.date) return false;
    b.step = 2;
    b.errors = {};
    return true;
  }
  if (b.step === 2) {
    const e = {};
    if (!b.name.trim()) e.name = '请填写姓名';
    if (!/^\d{8,}$/.test(b.phone.replace(/\D/g, ''))) e.phone = '请填写有效手机号';
    b.errors = e;
    if (Object.keys(e).length) return false;
    b.step = 3;
    return true;
  }
  return true;
}

function goStepPrev() {
  if (!state.booking) return;
  state.booking.step -= 1;
  state.booking.errors = {};
}

// 预约单号：GL + 北京时间 YYMMDD + 5位随机数，例如 GL260714-58291。
// 之前用 'GL2607-' + (900 + myBookings.length) 是内存态计数，刷新页面 myBookings 清零，
// 每个用户第一单都是 GL2607-900，写进合作方系统会大量重复，改成日期+随机数保证基本不撞号。
// 浏览器端直接用 new Date() 取本地时间即可（国内用户本地时区就是北京时间），不用像服务端
// notify-feishu.js 里那样手动偏移到 UTC+8。
function genOrderNo() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yymmdd = pad(now.getFullYear() % 100) + pad(now.getMonth() + 1) + pad(now.getDate());
  const rand = Math.floor(10000 + Math.random() * 90000);
  return 'GL' + yymmdd + '-' + rand;
}

async function submitBooking() {
  if (!state.booking || state._submitting) return null;
  state._submitting = true;
  const b = state.booking;
  const p = project(b.projectId);
  const h = hospital(p.hid);
  const code = genOrderNo();
  const rec = {
    id: code,
    proj: p.name,
    hosp: h.name,
    region: h.city,
    date: '2026 年 7 月 ' + b.date + ' 日',
    status: '待确认',
    price: priceText(p),
    name: b.name,
    phone: b.phone,
    referrer: b.referrer,
  };
  const notifyPayload = { ...rec, price: p.isFree ? '免费体验' : String(rec.price).replace(/<[^>]*>/g, '') };
  fetch('/api/notify-feishu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notifyPayload),
  }).catch(() => {});
  state.myBookings = [rec, ...state.myBookings];
  state.lastBooking = rec;
  state.booking = null; // 提交成功即清空，防止重进同一项目 /booking/:id 时落在 step3 重复下单；_submitting 锁留到下次 startBooking 才复位，避免复位窗口为零
  return rec;
}

export function useBooking() {
  return { state, startBooking, goStepNext, goStepPrev, submitBooking, money };
}
