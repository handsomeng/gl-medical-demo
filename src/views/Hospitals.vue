<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { region, hospByRegion, projByRegion, projByHosp, imgFor } from '../data/index.js';
import { bgStyle } from '../utils/style.js';

const props = defineProps({ rid: { type: String, required: true } });
const router = useRouter();

const r = computed(() => region(props.rid));
const hospitals = computed(() => hospByRegion(props.rid));

function goBack() { router.back(); }
function goProjects(hid) { router.push({ name: 'projects-hospital', params: { hid } }); }
</script>

<template>
  <div class="view" v-if="r">
    <div class="hero">
      <div class="img-cover kb-anim" :style="bgStyle(imgFor(r.img))"></div>
      <div class="hero-fade"></div>
      <div class="round-btn back" @click="goBack">←</div>
    </div>
    <div class="head">
      <div class="h-serif title">{{ r.name }}</div>
      <div class="det">{{ r.cities }} · 共 {{ projByRegion(r.id).length }} 个项目</div>
    </div>
    <div class="section-label">合作医疗机构</div>
    <div class="view-scroll list">
      <div v-for="h in hospitals" :key="h.id" class="row" @click="goProjects(h.id)">
        <div class="thumb"><div class="img-cover" :style="bgStyle(imgFor(h.img))"></div></div>
        <div class="info">
          <div class="h-serif name">{{ h.name }}</div>
          <div class="city">{{ h.city }}</div>
          <div class="count">{{ projByHosp(h.id).length }} 个项目</div>
        </div>
        <span class="arrow">→</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero { flex: none; height: 230px; position: relative; overflow: hidden; }
.hero-fade { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 4%, rgba(245, 247, 247, .1) 46%, rgba(19, 26, 29, .2) 100%); }
.head { flex: none; padding: 4px 26px 0; }
.title { font-size: 27px; font-weight: 300; }
.det { font-size: 10.5px; line-height: 1.7; color: var(--muted-2); padding-top: 6px; }
.section-label { flex: none; padding: 22px 26px 8px; font-size: 9px; letter-spacing: 3px; color: var(--muted-2); text-transform: uppercase; }
.list { padding: 0 26px 20px; }
.row { display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
.thumb { flex: none; width: 56px; height: 56px; overflow: hidden; }
.info { flex: 1; min-width: 0; }
.name { font-size: 15.5px; }
.city { font-size: 10.5px; line-height: 1.6; color: var(--muted-2); padding-top: 4px; }
.count { font-size: 9.5px; color: var(--muted-2); padding-top: 6px; }
.arrow { color: var(--accent); font-size: 14px; }
</style>
