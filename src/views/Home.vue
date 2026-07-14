<script setup>
import { useRouter } from 'vue-router';
import { REGIONS, HOSPITALS, region, projByRegion, projByHosp, imgFor } from '../data/index.js';
import { bgStyle } from '../utils/style.js';

const router = useRouter();

function goRegions() { router.push({ name: 'regions' }); }
function goHospitals(rid) { router.push({ name: 'hospitals', params: { rid } }); }
function goProjects(hid) { router.push({ name: 'projects-hospital', params: { hid } }); }
</script>

<template>
  <div class="view">
    <div class="view-scroll">
      <div class="home-brand">
        <span class="brand-mark">GOLONG</span>
      </div>

      <div class="hero">
        <div class="img-cover kb-anim" :style="bgStyle('/assets/hero-main.jpg')"></div>
        <div class="hero-fade"></div>
        <div class="hero-text">
          <div class="eyebrow" style="color:var(--accent);">GOLONG Preventive Medicine</div>
          <div class="h-serif hero-title">GOLONG全球医疗<br>官方预约平台</div>
          <div class="hero-line"></div>
          <div class="hero-desc">严选日本、巴黎、首尔、香港与澳门合作机构，配备私人医疗顾问，在线查看项目详情并直接提交预约</div>
        </div>
      </div>

      <div class="section-head">
        <div>
          <div class="h-serif section-title">严选目的地</div>
          <div class="eyebrow">DESTINATIONS</div>
        </div>
        <span class="section-more" @click="goRegions">全部地区 →</span>
      </div>
      <div class="dest-scroll">
        <div v-for="r in REGIONS" :key="r.id" class="dest-card" @click="goHospitals(r.id)">
          <div class="dest-img"><div class="img-cover" :style="bgStyle(imgFor(r.img))"></div></div>
          <div class="h-serif dest-name">{{ r.name }}</div>
          <div class="dest-name-en">{{ r.nameEn }}</div>
          <div class="dest-det">{{ projByRegion(r.id).length }} 个项目</div>
        </div>
      </div>

      <div class="section-head" style="padding-top:30px;padding-bottom:6px;">
        <div>
          <div class="h-serif section-title">严选机构</div>
          <div class="eyebrow">PARTNER CLINICS</div>
        </div>
        <span class="section-more" @click="goRegions">全部地区 →</span>
      </div>
      <div class="hosp-list">
        <div v-for="h in HOSPITALS" :key="h.id" class="hosp-row" @click="goProjects(h.id)">
          <div class="hosp-thumb"><div class="img-cover" :style="bgStyle(imgFor(h.img))"></div></div>
          <div class="hosp-info">
            <div class="h-serif hosp-name">{{ h.name }}</div>
            <div class="hosp-det">{{ region(h.region).name }} · {{ projByHosp(h.id).length }} 个项目</div>
          </div>
          <span class="arrow">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-brand { height: 54px; display: flex; align-items: center; justify-content: center; }
.home-brand .brand-mark { padding-left: 9px; }

.hero { height: 420px; position: relative; overflow: hidden; }
.hero-fade { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 6%, rgba(245, 247, 247, .25) 42%, rgba(19, 26, 29, .12) 100%); }
.hero-text { position: absolute; left: 26px; right: 26px; bottom: 24px; display: flex; flex-direction: column; gap: 12px; }
.hero-text .eyebrow { animation: fu .9s .1s cubic-bezier(.2, .7, .2, 1) both; text-transform: uppercase; letter-spacing: 5px; font-size: 10px; }
.hero-title { font-size: 32px; font-weight: 300; line-height: 1.28; animation: fu .9s .25s cubic-bezier(.2, .7, .2, 1) both; }
.hero-line { width: 44px; height: 1px; background: var(--accent); transform-origin: left; animation: lineX 1s .55s cubic-bezier(.2, .7, .2, 1) both; }
.hero-desc { font-size: 12px; line-height: 1.75; color: var(--muted); animation: fu .9s .45s cubic-bezier(.2, .7, .2, 1) both; }

.section-head { display: flex; justify-content: space-between; align-items: flex-end; padding: 28px 26px 16px; }
.section-title { font-size: 21px; }
.section-more { font-size: 10px; letter-spacing: 3px; color: var(--muted-2); text-transform: uppercase; cursor: pointer; }

.dest-scroll { display: flex; gap: 14px; padding: 0 26px; overflow-x: auto; }
.dest-card { flex: none; width: 132px; cursor: pointer; }
.dest-img { height: 150px; overflow: hidden; position: relative; }
.dest-name { padding-top: 10px; font-size: 16px; }
.dest-name-en { font-size: 8.5px; letter-spacing: 2px; color: var(--muted-2); padding-top: 2px; }
.dest-det { font-size: 10px; letter-spacing: 1.5px; color: var(--muted-2); padding-top: 2px; }

.hosp-list { padding: 0 26px 30px; }
.hosp-row { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
.hosp-thumb { flex: none; width: 56px; height: 56px; overflow: hidden; }
.hosp-info { flex: 1; min-width: 0; }
.hosp-name { font-size: 15.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hosp-det { font-size: 10px; letter-spacing: 1.5px; color: var(--muted-2); padding-top: 4px; }
.arrow { color: var(--accent); font-size: 14px; }
</style>
