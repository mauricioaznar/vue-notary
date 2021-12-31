import { ActionTree, GetterTree, MutationTree } from "vuex";
import { NOTARY } from "@/api/NOTARY";
import moment from "moment";
import { dateTimeFormat } from "@/helpers/date-formats";

const lastActivityUpdateCheck =
  window.localStorage.getItem("last_activity_update_check") ||
  moment().format(dateTimeFormat);

class State {
  activities = [];
  lastActivityUpdateCheck = lastActivityUpdateCheck;
}

const mutations = <MutationTree<State>>{
  addActivity(state, payload) {
    state.activities = [payload, ...state.activities];
  },
  setActivities(state, payload) {
    state.activities = [...payload, ...state.activities];
  },
  setLastActivityUpdateCheck(state, payload) {
    state.lastActivityUpdateCheck = payload;
  },
};

const actions = <ActionTree<State, any>>{
  async socket_newActivity({ commit, dispatch }, data) {
    commit("addActivity", data);
    dispatch(`statics/${data.entityName}_${data.type}`, data.entity, {
      root: true,
    });
  },
  async getActivities({ commit }) {
    const response = await NOTARY.get("activities");
    const activities = response.data;
    commit("setActivities", activities);
  },
  async setLastActivityUpdateCheck({ commit }, payload) {
    window.localStorage.setItem("last_activity_update_check", payload);
    commit("setLastActivityUpdateCheck", payload);
  },
};

const getters = <GetterTree<State, any>>{
  getUncheckedActivities(state) {
    return function () {
      if (state.lastActivityUpdateCheck) {
        return state.activities.filter((activity) => {
          const momentLastActivityUpdateCheck = moment(
            state.lastActivityUpdateCheck
          );
          const momentUpdatedAt = moment(activity.updatedAt);
          return momentUpdatedAt.isAfter(momentLastActivityUpdateCheck);
        });
      } else {
        return [];
      }
    };
  },
};

const Activities = {
  namespaced: true,
  state: new State(),
  mutations: mutations,
  actions: actions,
  getters: getters,
};

export default Activities;
