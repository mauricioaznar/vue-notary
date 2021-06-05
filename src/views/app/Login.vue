<template>
  <dialog-layout
      title="Log in"
      @submit="handleSubmit"
      v-model="activateDialog"
  >
    <vee-text-field
        prepend-icon="mdi-account"
        name="login"
        v-model="credentials.username"
        label="Email"
        rules="required|email"
        id="login"
        type="text"
        no-label
    ></vee-text-field>
    <vee-text-field
        prepend-icon="mdi-lock"
        name="password"
        v-model="credentials.password "
        rules="required"
        label="Password"
        id="password"
        type="password"
        no-label
    ></vee-text-field>
    <v-snackbar
        v-model="snackbar"
    >
      <div v-html="text"></div>

      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </dialog-layout>
</template>

<script lang="ts">

import Vue from "vue";
import {mapActions} from 'vuex'
import DialogLayout from '@/components/forms/DialogLayout.vue'
import VeeTextField from '@/components/forms/VeeTextField.vue'


export interface Credentials {
  username: string;
  password: string;
}

export default Vue.extend({
  components: {
    VeeTextField,
    DialogLayout
  },
  data () {
    return {
      snackbar: false,
      activateDialog: false,
      credentials: {
        username: 'admin@example.com',
        password: 'passwordpassword'
      } as Credentials,
      error: '',
      text: ''
    }
  },
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
  created() {
    this.handleDialogLayout()
  },
  methods: {
    handleDialogLayout: function () {
      if (this.value) {
        this.activateDialog = true
      }
    },
    handleSubmit: async function (isValid) {
      if (isValid) {
        try {
          await this.logIn({
            email: this.credentials.username,
            password: this.credentials.password
          })
          this.$emit('relogin')
          this.activateDialog = false
        } catch (e) {
          this.snackbar = true
          this.text = 'Credenciales invalidas'
        }
      }
    },
    ...mapActions('auth', ['logIn'])
  },
  watch: {
    value: function() {
      this.handleDialogLayout()
    },
    activateDialog: function () {
      this.$emit('input', this.activateDialog)
    }
  }
})

</script>