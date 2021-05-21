<template>
  <v-main>
    <loader-simple v-if="isLoading" />
    <navbar v-if="!isLoading && authenticated"/>
    <v-container class="mt-6 mb-16" v-if="!isLoading && authenticated">
      <router-view></router-view>
    </v-container>
    <error-toaster
        v-model="error"
        @relogin="customCreated"
    />
    <activity-toaster />
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import LoaderSimple from '@/components/loaders/LoaderSimple.vue';
import Navbar from '@/views/app/Navbar.vue'
import {mapActions, mapState} from 'vuex'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {NOTARY} from '@/api/NOTARY'
import ActivityToaster from "@/views/app/activities/ActivityToaster.vue";

export default Vue.extend({
  name: "App",
  components: {
    ActivityToaster,
    ErrorToaster,
    LoaderSimple,
    Navbar
  },
  data () {
    return {
      isLoading: true,
      error: {}
    }
  },
  created () {
    this.customCreated()
  },
  computed: {
    ...mapState('auth', ['authenticated'])
  },
  methods: {
    customCreated: async function () {
      this.isLoading = true
      try {
        const token = window.localStorage.getItem('authToken')
        if (token) {
          NOTARY.defaults.headers.Authorization = token
        }
        await this.getProfile()
        await this.getStatics()
        await this.getActivities()
      } catch (e) {
        window.localStorage.removeItem('authToken')
        this.error = e
      }
      this.isLoading = false
    },
    ...mapActions({
      getStatics: 'statics/getStatics',
      getProfile: 'auth/getProfile',
      getActivities: 'activities/getActivities'
    })
  },
});
</script>