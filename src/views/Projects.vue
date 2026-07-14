<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { hospital, projByHosp, PROJECTS, CATS, CATS_ALL, CAT_EN, sortProjects, priceText, freeGiftsFor, money, imgFor } from '../data/index.js';
import { bgStyle } from '../utils/style.js';
import { useFilter } from '../composables/useFilter.js';

const props = defineProps({ hid: { type: String, default: '' } });
const router = useRouter();
const { state: filterState } = useFilter();

const h = computed(() => (props.hid ? hospital(props.hid) : null));
const title = computed(() => (h.value ? h.value.name : '全部项目'));
const sub = computed(() => (h.value ? h.value.city : 'ALL TREATMENTS'));

const baseList = computed(() => (h.value ? projByHosp(props.hid) : PROJECTS.slice()));
const filteredList = computed(() => {
  let list = baseList.value;
  if (filterState.cat !== '全部') list = list.filter((p) => p.cat === filterState.cat);
  return sortProjects(list);
});

const gift = computed(() => {
  if (!h.value) return null;
  const gifts = freeGiftsFor(props.hid);
  if (!gifts.length) return null;
  return gifts.map((g) => g.name + '（价值 ' + money(g.value) + '）').join(' · ');
});

const groups = computed(() => {
  const list = filteredList.value;
  const freeItems = list.filter((p) => p.isFree);
  const rest = list.filter((p) => !p.isFree);
  const out = [];
  if (freeItems.length) out.push({ cat: '到店即享 · 免费体验', catEn: 'COMPLIMENTARY', hasCatEn: true, items: freeItems });
  CATS_ALL.forEach((c) => {
    const its = rest.filter((p) => p.cat === c);
    if (its.length) out.push({ cat: c, catEn: CAT_EN[c] || '', hasCatEn: !!CAT_EN[c], items: its });
  });
  if (!out.length) out.push({ cat: '该分类下暂无项目', catEn: '', hasCatEn: false, items: [] });
  return out;
});

function goBack() { router.back(); }
function goDetail(id) { router.push({ name: 'detail', params: { id } }); }
</script>

<template>
  <div class="view">
    <div v-if="h" class="round-btn back" @click="goBack">←</div>
    <div class="view-scroll">
      <div v-if="h" class="hero">
        <div class="img-cover kb-anim" :style="bgStyle(imgFor(h.img))"></div>
        <div class="hero-fade"></div>
      </div>
      <div class="head">
        <div class="h-serif title">{{ title }}</div>
        <div class="sub">{{ sub }}</div>
      </div>
      <div v-if="gift" class="gift-banner">
        <div class="gift-eyebrow">到店即享 · 免费体验 <span class="gift-eyebrow-en">· COMPLIMENTARY</span></div>
        <div class="gift-text">{{ gift }}</div>
      </div>
      <div class="chips">
        <div v-for="c in CATS" :key="c" class="chip" :class="{ active: filterState.cat === c }" @click="filterState.cat = c">{{ c }}</div>
      </div>
      <div class="groups">
        <template v-for="g in groups" :key="g.cat">
          <div class="group-title">{{ g.cat }}<span v-if="g.hasCatEn" class="group-title-en"> · {{ g.catEn }}</span></div>
          <div v-for="p in g.items" :key="p.id" class="proj-row" @click="goDetail(p.id)">
            <div class="proj-info">
              <span class="h-serif proj-name">{{ p.name }}</span>
              <span v-if="p.isOwnBrand" class="own-tag">高浪严选</span>
              <div class="hosp-line" v-if="!h">{{ hospital(p.hid).name }}</div>
            </div>
            <span class="proj-price">{{ priceText(p) }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero { height: 230px; position: relative; overflow: hidden; }
.hero-fade { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 4%, rgba(245, 247, 247, .1) 46%, rgba(19, 26, 29, .18) 100%); }
.head { padding: 6px 26px 0; }
.title { font-size: 26px; font-weight: 300; }
.sub { font-size: 10.5px; color: var(--muted-2); letter-spacing: .5px; padding-top: 6px; line-height: 1.6; }

.gift-banner { margin: 18px 26px 0; padding: 14px 16px; background: var(--accent-bg); display: flex; flex-direction: column; gap: 6px; }
.gift-eyebrow { font-size: 9px; letter-spacing: 3px; color: var(--accent); text-transform: uppercase; }
.gift-eyebrow-en { letter-spacing: 2px; opacity: .6; }
.gift-text { font-size: 12px; color: var(--ink-2); line-height: 1.7; }

.chips { display: flex; padding: 16px 26px 0; overflow-x: auto; border-bottom: 1px solid var(--border); }
.chip { flex: none; padding: 9px 2px; margin-right: 18px; font-size: 12px; letter-spacing: 1px; cursor: pointer; color: var(--muted-2); border-bottom: 1px solid transparent; white-space: nowrap; }
.chip.active { color: var(--ink); border-bottom: 1px solid var(--ink); }

.groups { padding: 4px 26px 26px; }
.group-title { padding-top: 22px; font-size: 9px; letter-spacing: 3px; color: var(--muted-2); text-transform: uppercase; }
.group-title-en { color: var(--muted-3); }
.proj-row { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
.proj-info { flex: 1; min-width: 0; }
.proj-name { font-size: 15px; line-height: 1.5; color: var(--ink); }
.own-tag { font-size: 9px; letter-spacing: 1.5px; color: var(--accent); padding-left: 8px; }
.hosp-line { font-size: 12px; color: var(--muted-2); padding-top: 3px; }
.proj-price { flex: none; font-family: var(--font-serif); font-size: 15px; color: var(--accent); }
</style>
