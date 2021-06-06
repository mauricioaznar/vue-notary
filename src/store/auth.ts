import {ActionTree, GetterTree, MutationTree} from "vuex"
import {NOTARY} from "@/api/NOTARY";

class State {
  authenticated = false
  user = null
  userId = null
  roleId = null
}

const mutations = <MutationTree<State>>{
  setAuthenticated(state, payload) {
    state.authenticated = true;
  },
  unsetAuthenticated(state) {
    state.authenticated = false;
    state.user = null
    state.roleId = null
    state.userId = null
  },
  setProfile(state, user) {
    state.user = user
    state.userId = user.id
    state.roleId = user.roleId
  }
};

const actions = <ActionTree<State, any>>{
  async logIn(vuexObj, credentials) {
    const { email, password } = credentials
    const response = await NOTARY.post('auth/login', {
      email,
      password
    })
    if (response.status === 201) {
      const token = `Bearer ${response.data.access_token}`
      NOTARY.defaults.headers.Authorization = token
      window.localStorage.setItem('authToken', token)
      vuexObj.commit('setAuthenticated')
    }
  },
  async signOut({commit}) {
    await NOTARY.get('auth/logout')
    window.localStorage.removeItem('authToken')
    window.location.reload()
    commit('unsetAuthenticated')
  },
  async getProfile({commit}) {
    const result = await NOTARY.get('profile')
    if (result.data && result.status === 200) {
      commit('setProfile', result.data)
      commit('setAuthenticated')
    }
  }
};

const getters = <GetterTree<State, any>> {
  isAdmin: function (state) {
    return function () {
      return state.roleId === 1
    }
  },
  isLawyer: function (state) {
    return function () {
      return state.roleId === 2
    }
  },
  isSecretary: function (state) {
    return function () {
      return state.roleId === 3
    }
  },
}

const Auth = {
  namespaced: true,
  state: new State(),
  mutations: mutations,
  actions: actions,
  getters: getters
};

export default Auth;