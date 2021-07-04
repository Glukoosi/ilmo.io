import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bulma/css/bulma.css'
import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga-full.css'
import VueScrollTo from 'vue-scrollto'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faCheckCircle,
  faCalendar,
  faInfoCircle,
  faExclamationTriangle,
  faExclamationCircle,
  faArrowUp,
  faAngleRight,
  faAngleLeft,
  faAngleDown,
  faEye,
  faEyeSlash,
  faCaretDown,
  faCaretUp,
  faTrash,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faCheck,
  faCheckCircle,
  faInfoCircle,
  faCalendar,
  faExclamationTriangle,
  faExclamationCircle,
  faArrowUp,
  faAngleRight,
  faAngleLeft,
  faAngleDown,
  faEye,
  faEyeSlash,
  faCaretDown,
  faCaretUp,
  faTrash,
  faPlus
)

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
app.use(Oruga, {
  iconComponent: 'vue-fontawesome',
  iconPack: 'fas'
});
app.component("vue-fontawesome", FontAwesomeIcon);


app.mount('#app')
