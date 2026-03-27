import { createApp } from 'vue'
import PolarisVue from '@ownego/polaris-vue'
import VueKonva from 'vue-konva'
import '@ownego/polaris-vue/dist/style.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(PolarisVue)
app.use(VueKonva)
app.mount('#app')
