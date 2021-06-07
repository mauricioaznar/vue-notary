<template>
  <v-app>
    <navbar v-if="!isLoading && authenticated" />
    <v-main v-if="!isLoading && authenticated">
      <v-container class="px-0 px-md-6 fill-height d-flex flex-column justify-start">
        <router-view />
      </v-container>
    </v-main>
    <loader-simple v-if="isLoading" />
    <error-toaster
        v-model="error"
        @relogin="customCreated"
    />
    <activity-toaster />
  </v-app>
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
    Navbar,
    ActivityToaster,
    ErrorToaster,
    LoaderSimple,
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