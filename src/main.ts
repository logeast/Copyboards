import { createApp } from 'vue';
import App from './App.vue';
// import './samples/node-api'
import './index.css';

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
