import { createApp } from "vue";
import App from "./App.vue";
import { Quasar } from "quasar";
import { createPinia } from "pinia";
import "devextreme/dist/css/dx.light.css";

import { loadMessages, locale } from "devextreme/localization";
import esMessages from "devextreme/localization/messages/es.json";

// Cargar mensajes en español
loadMessages(esMessages);
locale("es"); // Establecer el idioma por defecto a español

const app = createApp(App);
app.use(Quasar);
app.use(createPinia());
app.mount("#app");
