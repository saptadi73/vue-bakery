import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'
import { createPinia } from 'pinia'

const emitter = mitt()

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.provide('$emitter', emitter)

app.use(router)
app.use(createPinia())

app.mount('#app')
