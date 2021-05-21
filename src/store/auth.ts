import {ActionTree, GetterTree, MutationTree} from "vuex"
import {MONS} from "@/api/MONS";

class State {
  authenticated = false
  user = null
  userRoles = []
}

const mutations = <MutationTree<State>>{
  setAuthenticated(state, payload) {
    state.authenticated = true;
  },
  unsetAuthenticated(state) {
    state.authenticated = false;
    state.user = null
    state.userRoles = []
  },
  setProfile(state, user) {
    state.user = user
    state.userRoles = user.roles
  }
};

const actions = <ActionTree<State, any>>{
  async logIn(vuexObj, credentials) {
    const { email, password } = credentials
    const response = await MONS.post('auth/login', {
      email,
      password
    })
    if (response.status === 201) {
      const token = `Bearer ${response.data.access_token}`
      MONS.defaults.headers.Authorization = token
      window.localStorage.setItem('authToken', token)
      vuexObj.commit('setAuthenticated')
    }
  },
  async signOut({commit}) {
    await MONS.get('auth/logout')
    window.localStorage.removeItem('authToken')
    window.location.reload()
    commit('unsetAuthenticated')
  },
  async getProfile({commit}) {
    const result = await MONS.get('profile')
    if (result.data && result.status === 200) {
      commit('setProfile', result.data)
      commit('setAuthenticated')
    }
  }
};

const getters = <GetterTree<State, any>> {
  // isSuper: function (state) {
  //   return function () {
  //     return state.roleId === 1
  //   }
  // },
  // isAdmin: function (state) {
  //   return function () {
  //     return state.roleId === 2 || state.roleId === 1
  //   }
  // },
  // isSalesman: function (state) {
  //   return function () {
  //     return state.roleId === 5
  //   }
  // },
  // isProduction: function (state) {
  //   return function () {
  //     return state.roleId === 4
  //   }
  // },
}

const Auth = {
  namespaced: true,
  state: new State(),
  mutations: mutations,
  actions: actions,
  getters: getters
};

export default Auth;