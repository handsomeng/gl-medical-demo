<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUI } from './composables/useUI.js';
import { useFilter } from './composables/useFilter.js';

const route = useRoute();
const router = useRouter();
const { state: ui } = useUI();
const { resetCat } = useFilter();

const TAB_VIEWS = ['home', 'regions', 'hospitals', 'projects-all', 'projects-hospital'];
const showTabs = computed(() => TAB_VIEWS.includes(route.name));
const isRegionsTab = computed(() => route.name === 'regions' || route.name === 'hospitals');
const isProjectsTab = computed(() => route.name === 'projects-all' || route.name === 'projects-hospital');

function goHome() { router.push({ name: 'home' }); }
function goRegions() { router.push({ name: 'regions' }); }
function goProjects() { resetCat(); router.push({ name: 'projects-all' }); }
</script>

<template>
  <div class="app-outer">
    <div class="phone" data-screen-label="高浪App">
      <div class="phone-body">
        <router-view v-slot="{ Component }">
          <transition name="view" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </div>

      <!-- ================ TAB BAR ================ -->
      <div v-if="showTabs" class="tabbar">
        <div class="tabbar-item" :class="{ active: route.name === 'home' }" @click="goHome">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
          <span>首页</span>
        </div>
        <div class="tabbar-item" :class="{ active: isRegionsTab }" @click="goRegions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"></path></svg>
          <span>地区</span>
        </div>
        <div class="tabbar-item" :class="{ active: isProjectsTab }" @click="goProjects">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
          <span>项目</span>
        </div>
      </div>

      <!-- ================ TOAST ================ -->
      <div class="toast" :class="{ show: ui.toast }">{{ ui.toast }}</div>
    </div>
  </div>
</template>
