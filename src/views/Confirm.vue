<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBooking } from '../composables/useBooking.js';

const router = useRouter();
const { state } = useBooking();
const showSuccessModal = ref(false);

// 直接刷新 /confirm 时内存态 lastBooking 会丢失（本来就不做持久化），兜底回首页；
// 有 lastBooking 说明是正常提交后跳转进来的，弹一次提交成功提示。
onMounted(() => {
  if (!state.lastBooking) router.replace({ name: 'home' });
  else showSuccessModal.value = true;
});

function goHome() { router.push({ name: 'home' }); }
</script>

<template>
  <div class="view" v-if="state.lastBooking">
    <div class="view-scroll body">
      <div class="success">
        <div class="check">✓</div>
        <div class="h-serif title">预约提交成功</div>
        <div class="desc">预约信息已提交<br>后续由顾问确认</div>
      </div>
      <div class="detail-card">
        <div class="detail-head">Booking Details</div>
        <div class="detail-body">
          <div class="row"><span class="k">预约编号</span><span class="v">{{ state.lastBooking.id }}</span></div>
          <div class="row"><span class="k">项目</span><span class="v">{{ state.lastBooking.proj }}</span></div>
          <div class="row border-b"><span class="k">医院</span><span class="v">{{ state.lastBooking.hosp }}</span></div>
          <div class="row"><span class="k">日期</span><span class="v">{{ state.lastBooking.date }}</span></div>
          <div class="row border-b"><span class="k">地点</span><span class="v">{{ state.lastBooking.region }}</span></div>
          <div class="row total"><span class="k">费用</span><span class="h-serif v-price">{{ state.lastBooking.price }}</span></div>
        </div>
      </div>
      <div class="save-hint">📷 建议截图保存本页，留存您的预约凭证</div>
      <div class="actions">
        <div class="btn-outline" style="flex:1;" @click="goHome">返回首页</div>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal-card" @click.stop>
        <div class="modal-title">预约提交成功</div>
        <div class="modal-text">工作人员会在 48 小时之内联系您</div>
        <div class="btn-dark" style="width:100%;" @click="showSuccessModal = false">知道了</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body { padding: 0 26px 26px; }
.success { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 56px 0 30px; }
.check { width: 64px; height: 64px; border: 1px solid var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--accent); animation: checkPop .7s cubic-bezier(.2, .7, .2, 1) both; }
.title { font-size: 24px; font-weight: 300; animation: fu .8s .2s cubic-bezier(.2, .7, .2, 1) both; }
.desc { font-size: 12px; line-height: 1.8; color: var(--muted-2); text-align: center; animation: fu .8s .35s cubic-bezier(.2, .7, .2, 1) both; }

.detail-card { border: 1px solid var(--border); background: var(--white); animation: fu .8s .45s cubic-bezier(.2, .7, .2, 1) both; }
.detail-head { padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 9px; letter-spacing: 4px; color: var(--muted-2); text-transform: uppercase; }
.detail-body { padding: 8px 20px 16px; }
.row { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; }
.row.border-b { border-bottom: 1px solid var(--border); }
.row.total { padding: 12px 0 0; }
.row .k { font-size: 11px; color: var(--muted-2); flex: none; }
.row .v { font-size: 12.5px; color: var(--ink); text-align: right; line-height: 1.6; }
.v-price { font-size: 17px; color: var(--accent); }

.save-hint { font-size: 11px; color: var(--muted-2); text-align: center; line-height: 1.7; padding: 28px 0; animation: fu .8s .55s cubic-bezier(.2, .7, .2, 1) both; }

.actions { display: flex; gap: 12px; }
</style>
