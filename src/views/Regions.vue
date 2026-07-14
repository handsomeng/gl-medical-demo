<script setup>
import { useRouter } from 'vue-router';
import { REGIONS, projByRegion, imgFor } from '../data/index.js';
import { bgStyle } from '../utils/style.js';

const router = useRouter();
function goHospitals(rid) { router.push({ name: 'hospitals', params: { rid } }); }
</script>

<template>
  <div class="view">
    <div class="head">
      <div class="h-serif title">全球医疗网络</div>
      <div class="eyebrow" style="letter-spacing:4px;">GLOBAL NETWORK</div>
    </div>
    <div class="view-scroll list">
      <div v-for="r in REGIONS" :key="r.id" class="row" @click="goHospitals(r.id)">
        <div class="thumb"><div class="img-cover" :style="bgStyle(imgFor(r.img))"></div></div>
        <div class="info">
          <div class="h-serif name">{{ r.name }}</div>
          <div class="name-en">{{ r.nameEn }}</div>
          <div class="det">{{ r.cities }} · {{ projByRegion(r.id).length }} 个项目</div>
        </div>
        <span class="arrow">→</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head { flex: none; padding: 26px 26px 6px; text-align: center; }
.title { font-size: 21px; }
.list { padding: 12px 26px 20px; }
.row { display: flex; align-items: center; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
.thumb { flex: none; width: 64px; height: 64px; overflow: hidden; }
.info { flex: 1; min-width: 0; }
.name { font-size: 17px; }
.name-en { font-size: 8.5px; letter-spacing: 2px; color: var(--muted-2); padding-top: 3px; }
.det { font-size: 10.5px; line-height: 1.6; color: var(--muted-2); padding-top: 4px; }
.arrow { color: var(--accent); font-size: 14px; }
</style>
