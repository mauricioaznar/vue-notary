<template>
  <nav>
    <!-- Start of app toolbar -->
    <v-app-bar clipped-left app fixed>
      <v-app-bar-nav-icon
          class="ml-1"
          @click.stop="drawer = !drawer"
          v-if="!$vuetify.breakpoint.mdAndUp"
      >
      </v-app-bar-nav-icon>
      <v-spacer v-if="!$vuetify.breakpoint.mdAndUp"/>
      <v-btn
          link
          plain
          :ripple="false"
          to="/"
      >
        <v-img
            max-width="150"
            src="@/assets/img/masoc_logo_small.png"
        >
        </v-img>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title
          class="headline"
          v-if="$vuetify.breakpoint.mdAndUp"
      >
        {{name.toUpperCase()}} v.{{version}}
      </v-toolbar-title>
      <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
      <v-btn
          plain
          to="/notifications"
      >
        <v-badge
            color="red"
            :value="getUncheckedActivities().length > 0"
            :content="getUncheckedActivities().length"
        >
          <v-icon>
            mdi-bell
          </v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        dark
        clipped
        app
        fixed
        :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            active-class="text--accent-4"
        >
          <v-list-item
              :inactive="true"
              :ripple="false"
              class="my-6"
          >
            <v-list-item-content>
              <v-img
                  disabled
                  max-width="130"
                  class="mx-12"
                  src="@/assets/img/masoc_logo_small.png"
              >
              </v-img>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
              to="/roadmap"
              exact
          >
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item
              to="/documents"
          >
            <v-list-item-title>Documents</v-list-item-title>
          </v-list-item>

          <v-list-item
              to="/appointments"
          >
            <v-list-item-title>Appointments</v-list-item-title>
          </v-list-item>

          <v-list-item
              to="/clients"
          >
            <v-list-item-title>Clients</v-list-item-title>
          </v-list-item>

          <v-list-item
              to="/grantors"
              exact
          >
            <v-list-item-title>Grantors</v-list-item-title>
          </v-list-item>
          <v-list-item
              to="/users"
              exact
          >
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item>
          <v-list-item
              to="/groups"
              exact
          >
            <v-list-item-title>Groups</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item @click="handleSignOutClick">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Log out
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </nav>
</template>


<script lang="ts">
import Vue from 'vue';
import pjson from '../../../package.json'
import {mapActions, mapGetters} from 'vuex'

export default Vue.extend({
  data() {
    return {
      drawer: false,
      version: pjson.version,
      name: pjson.name
    }
  },
  computed: {
    ...mapGetters('activities', [
      'getUncheckedActivities',
    ]),
  },
  methods: {
    handleSignOutClick: function () {
      window.localStorage.removeItem('authToken')
      this.signOut()
    },
    ...mapActions({
      signOut: 'auth/signOut'
    })
  }
})
</script>