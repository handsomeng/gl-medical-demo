import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router.js';
import './fonts.css';
import './style.css';

const boot = document.getElementById('boot-loader');
if (boot) boot.remove();

createApp(App).use(router).mount('#app');
