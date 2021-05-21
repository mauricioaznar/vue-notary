import Vue from 'vue'
import Vuex from 'vuex'
import statics from '@/store/statics'
import auth from '@/store/auth'
import activities from '@/store/activities'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    statics,
    auth,
    activities
  }
})
