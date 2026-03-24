import { createApp } from 'vue'
import PolarisVue from '@ownego/polaris-vue'
import '@ownego/polaris-vue/dist/style.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(PolarisVue)
app.mount('#app')
