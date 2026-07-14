<script setup>
import { computed, onMounted } from 'vue';
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

const FULL_DAYS = [12, 20, 26];
const days = computed(() => {
  const out = [];
  for (let d = 1; d <= 31; d++) {
    out.push({
      d,
      disabled: d <= 4,
      full: FULL_DAYS.includes(d),
      selected: state.booking && state.booking.date === d,
    });
  }
  return out;
});
const TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

function pickDate(day) {
  if (day.disabled || day.full) return;
  state.booking.date = day.d;
}
function pickTime(t) {
  if (t === '16:00') return;
  state.booking.time = t;
}

function goBack() { router.back(); }

function next() {
  const ok = goStepNext();
  if (!ok) {
    if (state.booking.step === 1) showToast('请先选择日期和时段');
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
          <span class="h-serif">2026 年 7 月</span>
          <span class="cal-nav">‹ ›</span>
        </div>
        <div class="cal-grid">
          <div class="cal-dow" v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</div>
          <div class="cal-cell-empty" v-for="i in 3" :key="'e' + i"></div>
          <div
            v-for="day in days"
            :key="day.d"
            class="cal-cell"
            :class="{ disabled: day.disabled, full: day.full, selected: day.selected }"
            @click="pickDate(day)"
          >{{ day.d }}</div>
        </div>
        <div class="section-label" style="padding:22px 0 12px;">选择时段</div>
        <div class="time-grid">
          <div
            v-for="t in TIMES"
            :key="t"
            class="time-cell"
            :class="{ selected: state.booking.time === t, disabled: t === '16:00' }"
            @click="pickTime(t)"
          >{{ t === '16:00' ? t + ' 满' : t }}</div>
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
            <input v-model="state.booking.phone" type="tel" inputmode="numeric" placeholder="用于顾问联系，11 位手机号" />
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
            <div class="review-row"><span class="k">日期</span><span class="v">2026 年 7 月 {{ state.booking.date }} 日</span></div>
            <div class="review-row border-b"><span class="k">时段</span><span class="v">{{ state.booking.time }}</span></div>
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
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding-top: 14px; }
.cal-dow { text-align: center; font-size: 9px; letter-spacing: 1px; color: var(--muted-2); padding: 6px 0; }
.cal-cell-empty, .cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.cal-cell { color: var(--ink-2); cursor: pointer; }
.cal-cell.disabled, .cal-cell.full { color: var(--muted-4); cursor: default; }
.cal-cell.full { text-decoration: line-through; }
.cal-cell.selected { background: var(--ink); color: var(--bg); border-radius: 50%; }

.section-label { font-size: 9px; letter-spacing: 3px; color: var(--muted-2); text-transform: uppercase; }
.time-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.time-cell { height: 44px; display: flex; align-items: center; justify-content: center; font-size: 12.5px; border: 1px solid var(--border); color: var(--ink-2); cursor: pointer; }
.time-cell.selected { border-color: var(--ink); background: var(--ink); color: var(--bg); }
.time-cell.disabled { color: var(--muted-4); cursor: default; }
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
