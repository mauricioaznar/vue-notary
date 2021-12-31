import Vue from 'vue'
import Main from './Main.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import "./assets/main.css"
import "./validation/vee-validate"
import moment from 'moment'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

Vue.config.productionTip = false

const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://notary-server.mauaznar.com/'
    : 'http://localhost:3002'

const socket = io(baseUrl);

Vue.use(VueSocketIOExt, socket, { store });


moment.locale('en')

new Vue({
  router,
  store,
  vuetify,
  render: h => h(Main)
}).$mount('#application')
