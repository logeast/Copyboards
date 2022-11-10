import { createApp } from "vue";
import { createPinia } from "pinia";
import "./index.css";

import Settings from "./renderer/Settings.vue";

const app = createApp(Settings);
const pinia = createPinia();

app.use(pinia);

app.mount("#settings");
