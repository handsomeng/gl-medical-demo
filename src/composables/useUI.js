import { reactive } from 'vue';

// 全局 toast + 咨询弹窗状态，单例。
const state = reactive({
  toast: '',
  modalText: '',
});

let toastTimer = null;

function showToast(msg) {
  clearTimeout(toastTimer);
  state.toast = msg;
  toastTimer = setTimeout(() => { state.toast = ''; }, 1900);
}

function openConsultModal(text) {
  state.modalText = text;
}

function closeModal() {
  state.modalText = '';
}

function submitConsult() {
  closeModal();
  showToast('已提交咨询需求');
}

export function useUI() {
  return { state, showToast, openConsultModal, closeModal, submitConsult };
}
