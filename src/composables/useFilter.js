import { reactive } from 'vue';

// 项目分类筛选 chip 的选中态，模块级共享（单例）。
// 之前是 Projects.vue 组件内 ref，App.vue 用 :key="route.fullPath" 强制重挂载视图，
// 导致「详情页返回后分类丢失」——提到模块级后，remount 不再清空选中态，
// 只有 TabBar 切换到「项目」根视图时才主动重置回「全部」。
const state = reactive({
  cat: '全部',
});

function resetCat() {
  state.cat = '全部';
}

export function useFilter() {
  return { state, resetCat };
}
