import { reactive } from 'vue';

// 全局 toast 状态，单例。
const state = reactive({
  toast: '',
});

let toastTimer = null;

function showToast(msg) {
  clearTimeout(toastTimer);
  state.toast = msg;
  toastTimer = setTimeout(() => { state.toast = ''; }, 1900);
}

export function useUI() {
  return { state, showToast };
}
