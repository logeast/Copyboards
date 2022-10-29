import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./ui/App.vue";
import "./index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

app.mount("#app");
