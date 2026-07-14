<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUI } from './composables/useUI.js';
import { useFilter } from './composables/useFilter.js';

const route = useRoute();
const router = useRouter();
const { state: ui, closeModal, submitConsult } = useUI();
const { resetCat } = useFilter();

const TAB_VIEWS = ['home', 'regions', 'hospitals', 'projects-all', 'projects-hospital', 'my'];
const showTabs = computed(() => TAB_VIEWS.includes(route.name));
const isRegionsTab = computed(() => route.name === 'regions' || route.name === 'hospitals');
const isProjectsTab = computed(() => route.name === 'projects-all' || route.name === 'projects-hospital');

function goHome() { router.push({ name: 'home' }); }
function goRegions() { router.push({ name: 'regions' }); }
function goProjects() { resetCat(); router.push({ name: 'projects-all' }); }
function goMy() { router.push({ name: 'my' }); }
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
        <div class="tabbar-item" :class="{ active: route.name === 'my' }" @click="goMy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>我的</span>
        </div>
      </div>

      <!-- ================ TOAST ================ -->
      <div class="toast" :class="{ show: ui.toast }">{{ ui.toast }}</div>

      <!-- ================ CONSULT SHEET ================ -->
      <div v-if="ui.modalText" class="modal-overlay" @click="closeModal">
        <div class="modal-sheet" @click.stop>
          <div class="modal-handle"></div>
          <div class="modal-title">在线咨询</div>
          <div class="modal-text">{{ ui.modalText }}</div>
          <button class="btn-dark" style="width:100%;" @click="submitConsult">提交咨询</button>
          <div class="modal-cancel" @click="closeModal">稍后再说</div>
        </div>
      </div>
    </div>
  </div>
</template>
