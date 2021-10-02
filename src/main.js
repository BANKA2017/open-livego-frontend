import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from "@/router"
import {createStore} from "vuex"
//icons
import "bootstrap-icons/font/bootstrap-icons.css";

const store = createStore({
    state: {
        now: new Date(),
        darkMode: false,
        videoType: '0',//flv -> 0, hls -> 1
    },
    mutations: {
        updateNow (state) {
            state.now = new Date()
        },
        updateDarkInfo (state) {
            state.darkMode = !state.darkMode
        },
        updateVideoType (state, payload) {
            state.videoType = payload.videoType
            localStorage.setItem('video_type', payload.videoType)
        }
    }
})

const app = createApp(App)
app.use(store)
app.use(router)

app.mount('#app')
