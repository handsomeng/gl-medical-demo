<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { project, hospital, priceText, money, imgFor, CAT_EN, PENDING } from '../data/index.js';
import { bgStyle } from '../utils/style.js';

const props = defineProps({ id: { type: String, required: true } });
const router = useRouter();

const p = computed(() => project(props.id));
const h = computed(() => hospital(p.value.hid));

const note = computed(() => (p.value.isFree ? '到店即享免费体验' : '参考价格'));
const noteColor = computed(() => (p.value.isFree ? 'var(--green)' : 'var(--muted-2)'));
const specs = computed(() => (p.value.specs || []).map((s) => ({ spec: s.spec, price: money(s.price) })));
const brandAttr = computed(() => (p.value.isOwnBrand ? '高浪自有品牌' : '合作品牌'));

function goBack() { router.back(); }
function bookTap() { router.push({ name: 'booking', params: { id: p.value.id } }); }
</script>

<template>
  <div class="view" v-if="p && h">
    <div class="round-btn back" @click="goBack">←</div>
    <div class="view-scroll">
      <div class="hero">
        <div class="img-cover kb-anim" :style="bgStyle(imgFor(p.img))"></div>
        <div class="hero-fade"></div>
      </div>
      <div class="body">
        <div class="tags">
          <span class="cat">{{ p.cat }}</span>
          <span class="cat-en">{{ CAT_EN[p.cat] || '' }}</span>
          <span v-if="p.isOwnBrand" class="own">高浪自有品牌</span>
        </div>
        <div class="h-serif title">{{ p.name }}</div>
        <div class="hosp-line">{{ h.name }} · {{ h.city }}</div>
        <div class="price-row">
          <span class="h-serif price">{{ priceText(p) }}</span>
          <span class="note" :style="{ color: noteColor }">{{ note }}</span>
        </div>
        <div class="sec-label">项目介绍 <span class="sec-label-en">· ABOUT</span></div>
        <div class="intro">{{ p.intro || PENDING }}</div>
        <template v-if="specs.length">
          <div class="sec-label" style="padding:24px 0 4px;">规格与价格 <span class="sec-label-en">· PRICING</span></div>
          <div v-for="s in specs" :key="s.spec" class="spec-row">
            <span class="spec-name">{{ s.spec }}</span>
            <span class="h-serif spec-price">{{ s.price }}</span>
          </div>
        </template>
        <div class="info-grid">
          <div class="info-cell">
            <div class="info-label">分类</div>
            <div class="h-serif info-value">{{ p.cat }}</div>
          </div>
          <div class="info-cell">
            <div class="info-label">价格</div>
            <div class="h-serif info-value">{{ priceText(p) }}</div>
          </div>
          <div class="info-cell">
            <div class="info-label">品牌属性</div>
            <div class="h-serif info-value">{{ brandAttr }}</div>
          </div>
          <div class="info-cell">
            <div class="info-label">建议咨询</div>
            <div class="h-serif info-value">私人顾问</div>
          </div>
        </div>
      </div>
    </div>
    <div class="action-bar">
      <div class="btn-dark" style="flex:1;" @click="bookTap">立即预约</div>
    </div>
  </div>
</template>

<style scoped>
.hero { height: 300px; position: relative; overflow: hidden; }
.hero-fade { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 4%, rgba(245, 247, 247, 0) 40%); }
.body { padding: 2px 26px 26px; }
.tags { display: flex; align-items: baseline; gap: 12px; }
.cat { font-size: 9px; letter-spacing: 4px; color: var(--accent); text-transform: uppercase; }
.cat-en { font-size: 9px; letter-spacing: 2px; color: var(--muted-2); }
.own { font-size: 9px; letter-spacing: 2px; color: var(--muted-2); }
.title { font-size: 26px; font-weight: 300; line-height: 1.35; padding-top: 10px; }
.hosp-line { font-size: 10.5px; letter-spacing: .5px; color: var(--muted-2); padding-top: 8px; line-height: 1.6; }
.price-row { display: flex; align-items: baseline; gap: 10px; padding: 16px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-top: 16px; }
.price { font-size: 26px; color: var(--accent); }
.note { font-size: 11px; }
.sec-label { font-size: 9px; letter-spacing: 3px; color: var(--muted-2); text-transform: uppercase; padding: 22px 0 10px; }
.sec-label-en { letter-spacing: 2px; color: var(--muted-3); }
.intro { font-size: 12.5px; line-height: 2; color: var(--ink-2); }
.spec-row { display: flex; justify-content: space-between; align-items: baseline; padding: 11px 0; border-bottom: 1px solid var(--border); }
.spec-name { font-size: 12.5px; color: var(--ink-2); }
.spec-price { font-size: 14px; color: var(--ink); }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 24px; }
.info-cell { border: 1px solid var(--border); padding: 12px 14px; }
.info-label { font-size: 8.5px; letter-spacing: 2px; color: var(--muted-2); text-transform: uppercase; }
.info-value { font-size: 14px; padding-top: 6px; }
.action-bar { flex: none; display: flex; gap: 12px; padding: 14px 26px 28px; background: linear-gradient(to top, var(--bg) 70%, rgba(245, 247, 247, 0)); }
</style>
