import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import VueAxios from "vue-axios";
import i18n from '@/i18n'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock, faPlay, faTrophy, faCheck, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import setupInterceptors from "@/services/setupInterceptors";

setupInterceptors(store);

library.add(faLock, faPlay, faTrophy, faCheck, faArrowsRotate);

const app = createApp(App);
app.use(store);
app.use(VueAxios, axios);
app.use(router);
app.use(i18n);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
