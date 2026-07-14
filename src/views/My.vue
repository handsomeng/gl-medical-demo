<script setup>
import { useBooking } from '../composables/useBooking.js';
import { useUI } from '../composables/useUI.js';

const { state } = useBooking();
const { showToast } = useUI();

const menu = [
  { label: '咨询记录', key: 'consult' },
  { label: '我的收藏', key: 'fav' },
  { label: '设置', key: 'settings' },
];
function menuTap(item) { showToast(item.label); }
</script>

<template>
  <div class="view">
    <div class="head">
      <div class="h-serif title">我的</div>
      <div class="eyebrow" style="letter-spacing:4px;">MY ACCOUNT</div>
    </div>
    <div class="view-scroll body">
      <div class="member">
        <div class="avatar">客</div>
        <div class="h-serif name">体验官 · 138****8991</div>
        <div class="badge">GOLONG MEMBER</div>
      </div>
      <div class="section-label">我的预约</div>
      <template v-if="state.myBookings.length">
        <div v-for="m in state.myBookings" :key="m.id" class="booking-card">
          <div class="booking-head">
            <span class="id">{{ m.id }}</span>
            <span class="status">{{ m.status }}</span>
          </div>
          <div class="booking-body">
            <div class="h-serif proj">{{ m.proj }}</div>
            <div class="info">{{ m.hosp }} · {{ m.region }}<br>{{ m.date }} {{ m.time }} · 费用 {{ m.price }}</div>
          </div>
        </div>
      </template>
      <div v-else class="empty">暂无预约记录</div>

      <div class="menu">
        <div v-for="item in menu" :key="item.key" class="menu-row" @click="menuTap(item)">
          <span class="menu-label">{{ item.label }}</span>
          <span class="arrow">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head { flex: none; padding: 26px 26px 6px; text-align: center; }
.title { font-size: 21px; }
.body { padding: 10px 26px 24px; }

.member { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 18px 0 26px; }
.avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--accent-bg); display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 22px; color: var(--accent); }
.name { font-size: 18px; }
.badge { font-size: 9px; letter-spacing: 3px; color: var(--accent); border: 1px solid var(--accent-border); padding: 4px 12px; }

.section-label { font-size: 9px; letter-spacing: 3px; color: var(--muted-2); text-transform: uppercase; padding-bottom: 4px; }

.booking-card { border: 1px solid var(--border); background: var(--white); margin-top: 12px; }
.booking-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border); }
.booking-head .id { font-size: 10px; letter-spacing: 1px; color: var(--muted-2); }
.booking-head .status { font-size: 10px; letter-spacing: 1px; color: var(--accent); }
.booking-body { padding: 14px 16px; }
.proj { font-size: 15.5px; }
.info { font-size: 11px; line-height: 1.7; color: var(--muted-2); padding-top: 6px; }

.empty { border: 1px solid var(--border); padding: 24px 18px; text-align: center; font-size: 12px; color: var(--muted-2); margin-top: 12px; }

.menu { padding-top: 28px; }
.menu-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
.menu-label { font-size: 13px; color: var(--ink); letter-spacing: 1px; }
.arrow { color: var(--muted-2); font-size: 13px; }
</style>
