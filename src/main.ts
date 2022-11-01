import { createApp } from "vue";
import { createPinia } from "pinia";
import "./index.css";

import App from "./ui/App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

app.mount("#app");
