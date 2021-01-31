import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bulma/css/bulma.css'
import VueScrollTo from 'vue-scrollto'

const app = createApp(App)
app.use(router);
app.use(VueScrollTo, {
     container: "body",
     duration: 500,
     easing: "ease",
     offset: -10,
     force: true,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: false,
     y: true
});


app.mount('#app')
