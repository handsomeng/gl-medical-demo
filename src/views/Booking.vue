<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { project, hospital, priceText } from '../data/index.js';
import { useBooking } from '../composables/useBooking.js';
import { useUI } from '../composables/useUI.js';

const props = defineProps({ id: { type: String, required: true } });
const router = useRouter();
const { state, startBooking, goStepNext, goStepPrev, submitBooking } = useBooking();
const { showToast } = useUI();

onMounted(() => {
  if (!state.booking || state.booking.projectId !== props.id) {
    startBooking(props.id);
  }
});

const p = computed(() => project(props.id));
const h = computed(() => hospital(p.value.hid));

// 真日历：默认显示当前月（用户本地时间），今天之前的日期禁用，今天当天允许选
// （到店时间由顾问确认，当天预约合理）。只算一次，不用响应式，一次预约会话内够用。
const now = new Date();
const TODAY = { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };

const viewYear = ref(TODAY.y);
const viewMonth = ref(TODAY.m); // 1-12

const monthLabel = computed(() => `${viewYear.value} 年 ${viewMonth.value} 月`);
const isPrevDisabled = computed(() => viewYear.value === TODAY.y && viewMonth.value === TODAY.m);

function prevMonth() {
  if (isPrevDisabled.value) return;
  if (viewMonth.value === 1) { viewMonth.value = 12; viewYear.value -= 1; }
  else viewMonth.value -= 1;
}
function nextMonth() {
  if (viewMonth.value === 12) { viewMonth.value = 1; viewYear.value += 1; }
  else viewMonth.value += 1;
}

// 当月 1 号是星期几（0=日...6=六），决定日历网格前导空格数；用真实月份计算，不再写死。
const leadingEmpty = computed(() => new Date(viewYear.value, viewMonth.value - 1, 1).getDay());
// 当月天数：Date(y, m, 0) 取的是「m 月」（0-indexed，正好等于 1-indexed 的 viewMonth）第 0 天，
// 即上个月最后一天，也就是 viewMonth 当月的最后一天。
const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value, 0).getDate());

const days = computed(() => {
  const out = [];
  for (let d = 1; d <= daysInMonth.value; d++) {
    const isPast = viewYear.value < TODAY.y
      || (viewYear.value === TODAY.y && viewMonth.value < TODAY.m)
      || (viewYear.value === TODAY.y && viewMonth.value === TODAY.m && d < TODAY.d);
    const dt = state.booking && state.booking.date;
    const selected = !!(dt && dt.y === viewYear.value && dt.m === viewMonth.value && dt.d === d);
    out.push({ d, disabled: isPast, selected });
  }
  return out;
});

function pickDate(day) {
  if (day.disabled) return;
  state.booking.date = { y: viewYear.value, m: viewMonth.value, d: day.d };
}

const dateLabel = computed(() => {
  const dt = state.booking && state.booking.date;
  return dt ? `${dt.y} 年 ${dt.m} 月 ${dt.d} 日` : '';
});

function goBack() { router.back(); }

function next() {
  const ok = goStepNext();
  if (!ok) {
    if (state.booking.step === 1) showToast('请先选择日期');
  }
}
function prev() { goStepPrev(); }

async function submit() {
  await submitBooking();
  router.push({ name: 'confirm' });
}

const hasReferrer = computed(() => !!(state.booking && state.booking.referrer && state.booking.referrer.trim()));
</script>

<template>
  <div class="view" v-if="p && h && state.booking">
    <div class="top-bar">
      <div class="round-btn back" style="position:static;background:none;" @click="goBack">←</div>
      <div class="top-title">
        <div class="h-serif">预约</div>
        <div class="eyebrow" style="letter-spacing:3px;padding-top:2px;">BOOKING</div>
      </div>
      <div style="width:36px;"></div>
    </div>

    <div class="steps">
      <span class="step" :class="{ active: state.booking.step >= 1 }">01 选择时间 <span class="step-en">SCHEDULE</span></span>
      <span class="step" :class="{ active: state.booking.step >= 2 }">02 个人信息 <span class="step-en">DETAILS</span></span>
      <span class="step" :class="{ active: state.booking.step >= 3 }">03 确认预约 <span class="step-en">REVIEW</span></span>
    </div>

    <div class="view-scroll body">
      <!-- STEP 1 -->
      <template v-if="state.booking.step === 1">
        <div class="cal-head">
          <span class="h-serif">{{ monthLabel }}</span>
          <span class="cal-nav">
            <span class="cal-nav-btn" :class="{ disabled: isPrevDisabled }" @click="prevMonth">‹</span>
            <span class="cal-nav-btn" @click="nextMonth">›</span>
          </span>
        </div>
        <div class="cal-grid">
          <div class="cal-dow" v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</div>
          <div class="cal-cell-empty" v-for="i in leadingEmpty" :key="'e' + i"></div>
          <div
            v-for="day in days"
            :key="day.d"
            class="cal-cell"
            :class="{ disabled: day.disabled, selected: day.selected }"
            @click="pickDate(day)"
          >{{ day.d }}</div>
        </div>
        <div class="hint">预约提交后由顾问确认最终到店时间。</div>
      </template>

      <!-- STEP 2 -->
      <template v-if="state.booking.step === 2">
        <div class="form">
          <div class="field">
            <div class="field-label">姓名</div>
            <input v-model="state.booking.name" placeholder="请输入真实姓名（与护照一致）" />
            <div v-if="state.booking.errors.name" class="field-err">{{ state.booking.errors.name }}</div>
          </div>
          <div class="field">
            <div class="field-label">手机号</div>
            <input v-model="state.booking.phone" type="tel" inputmode="numeric" placeholder="用于顾问联系" />
            <div v-if="state.booking.errors.phone" class="field-err">{{ state.booking.errors.phone }}</div>
          </div>
          <div class="field">
            <div class="field-label">护照号（选填）</div>
            <input v-model="state.booking.passport" placeholder="如需登记请填写" />
          </div>
          <div class="field">
            <div class="field-label">预约达人是谁（选填）</div>
            <input v-model="state.booking.referrer" placeholder="填写你是从哪位达人处报名的" />
          </div>
          <div class="privacy">你的信息仅用于本次预约与行程协助，受加密保护，不会用于其他用途。</div>
        </div>
      </template>

      <!-- STEP 3 -->
      <template v-if="state.booking.step === 3">
        <div class="review-card">
          <div class="review-head">Booking Review</div>
          <div class="review-body">
            <div class="review-row"><span class="k">项目</span><span class="v">{{ p.name }}</span></div>
            <div class="review-row"><span class="k">医院</span><span class="v">{{ h.name }}</span></div>
            <div class="review-row border-b"><span class="k">地点</span><span class="v">{{ h.city }}</span></div>
            <div class="review-row border-b"><span class="k">日期</span><span class="v">{{ dateLabel }}</span></div>
            <div class="review-row"><span class="k">姓名</span><span class="v">{{ state.booking.name }}</span></div>
            <div class="review-row"><span class="k">手机号</span><span class="v">{{ state.booking.phone }}</span></div>
            <div class="review-row" v-if="hasReferrer"><span class="k">预约达人</span><span class="v">{{ state.booking.referrer }}</span></div>
            <div class="review-row total"><span class="k">费用</span><span class="h-serif v-price">{{ priceText(p) }}</span></div>
          </div>
        </div>
        <div class="hint" style="padding-top:18px;">提交后由顾问联系确认预约信息。</div>
      </template>
    </div>

    <div class="action-bar">
      <template v-if="state.booking.step === 1">
        <div class="bar-info">
          <div class="bar-name">{{ p.name }}</div>
          <div class="h-serif bar-price">{{ priceText(p) }}</div>
        </div>
        <div class="btn-dark" style="flex:none;width:150px;" @click="next">下一步</div>
      </template>
      <template v-else-if="state.booking.step === 2">
        <div class="btn-outline" style="flex:none;width:110px;" @click="prev">上一步</div>
        <div class="btn-dark" style="flex:1;" @click="next">下一步</div>
      </template>
      <template v-else>
        <div class="btn-outline" style="flex:none;width:110px;" @click="prev">上一步</div>
        <div class="btn-dark" style="flex:1;" @click="submit">确认预约</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.top-bar { flex: none; display: flex; align-items: center; padding: 20px 18px 0; }
.top-bar .round-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 15px; color: var(--ink); cursor: pointer; }
.top-title { flex: 1; text-align: center; font-size: 19px; }

.steps { flex: none; display: flex; justify-content: center; gap: 22px; padding: 20px 0 6px; }
.step { font-size: 10px; letter-spacing: 2px; white-space: nowrap; color: var(--muted-3); }
.step.active { color: var(--ink); }
.step-en { font-size: 8px; letter-spacing: 1.5px; color: var(--muted-3); }

.body { padding: 16px 30px 8px; }

.cal-head { display: flex; justify-content: space-between; align-items: baseline; }
.cal-head span:first-child { font-size: 18px; white-space: nowrap; }
.cal-nav { font-size: 12px; color: var(--muted-2); letter-spacing: 6px; }
.cal-nav-btn { cursor: pointer; padding: 0 2px; }
.cal-nav-btn.disabled { color: var(--muted-4); cursor: default; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding-top: 14px; }
.cal-dow { text-align: center; font-size: 9px; letter-spacing: 1px; color: var(--muted-2); padding: 6px 0; }
.cal-cell-empty, .cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.cal-cell { color: var(--ink-2); cursor: pointer; }
.cal-cell.disabled { color: var(--muted-4); cursor: default; }
.cal-cell.selected { background: var(--ink); color: var(--bg); border-radius: 50%; }

.hint { font-size: 11px; line-height: 1.8; color: var(--muted-2); padding-top: 20px; }

.form { display: flex; flex-direction: column; gap: 26px; padding-top: 8px; }
.field-label { font-size: 9px; letter-spacing: 3px; color: var(--muted-2); text-transform: uppercase; padding-bottom: 8px; }
.field input { width: 100%; border: none; border-bottom: 1px solid var(--muted-3); background: transparent; padding: 10px 0; font-size: 14px; color: var(--ink); border-radius: 0; }
.field-err { font-size: 11px; color: var(--error); padding-top: 6px; }
.privacy { font-size: 11px; line-height: 1.8; color: var(--muted-2); }

.review-card { border: 1px solid var(--border); background: var(--white); margin-top: 8px; }
.review-head { padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 9px; letter-spacing: 4px; color: var(--muted-2); text-transform: uppercase; }
.review-body { padding: 8px 20px 16px; }
.review-row { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; }
.review-row.border-b { border-bottom: 1px solid var(--border); }
.review-row.total { padding: 12px 0 0; border-top: 1px solid var(--border); margin-top: 4px; }
.review-row .k { font-size: 11px; color: var(--muted-2); flex: none; }
.review-row .v { font-size: 12.5px; color: var(--ink); text-align: right; line-height: 1.6; }
.v-price { font-size: 17px; color: var(--accent); }

.action-bar { flex: none; display: flex; gap: 12px; padding: 14px 26px 28px; align-items: center; }
.bar-info { flex: 1; min-width: 0; }
.bar-name { font-size: 10px; color: var(--muted-2); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bar-price { font-size: 19px; color: var(--accent); }
</style>
