<template>
  <loader-simple
      v-if="loading"
  />
  <form-layout
      v-else
      title="User"
      @save:form="save"
      :disabled="saving"
  >
    <vee-text-field
        name="Name"
        rules="required"
        v-model="user.name"
    />
    <vee-text-field
        name="Last name"
        rules="required"
        v-model="user.lastname"
    />
    <vee-text-field
        name="Email"
        rules="required|email"
        v-model="user.email"
    />
    <vee-autocomplete
        name="Role"
        :items="roles"
        v-model="user.roleId"
        item-text="name"
        item-value="id"
        rules="required"
    />
    <vee-autocomplete
        name="Groups"
        :items="groups"
        v-model="user.groups"
        multiple
        item-text="name"
        item-value="id"
        return-object
        rules="required"
    >
    </vee-autocomplete>
    <vee-text-field
        v-if="!this.isEditMode"
        name="Password"
        rules="required|min:10"
        v-model="user.password1"
    />
    <vee-text-field
        v-if="!this.isEditMode"
        name="Password (repeat)"
        rules="required|confirmed:Password"
        v-model="user.password2"
        hint="Password must be the same as the previous field"
    />

    <v-row
        class="mt-4 mb-12"
        v-if="isEditMode"
    >
      <v-spacer/>
      <v-col cols="auto">
        <v-btn
            @click="generateResetTokenLink"
        >
          Generate link to reset passwword
        </v-btn>
      </v-col>
    </v-row>

    <ErrorToaster
        v-model="fetchError"
        @relogin="customFetch"
    />
    <ErrorToaster
        v-model="saveError"
        @relogin="() => { save(true) }"
    />
    <ErrorToaster
        v-model="generateTokenError"
        @relogin="generateResetTokenLink"
    />
    <SuccessToaster
      v-model="successMessage"
    />
  </form-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import FormLayout from '@/components/forms/FormLayout.vue'
import VeeTextField from '@/components/forms/VeeTextField.vue'
import {mapActions, mapState} from 'vuex'
import VeeAutocomplete from '@/components/forms/VeeAutocomplete.vue'
import {NOTARY} from '@/api/NOTARY'
import LoaderSimple from '@/components/loaders/LoaderSimple.vue'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {User} from '@/models/User'
import SuccessToaster from '@/components/toaster/SuccessToaster.vue';

export default Vue.extend({
  components: {
    SuccessToaster,
    LoaderSimple,
    VeeTextField,
    FormLayout,
    VeeAutocomplete,
    ErrorToaster
  },
  props: {
    id: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      loading: true,
      saving: false,
      saveError: {},
      fetchError: {},
      generateTokenError: {},
      successMessage: '',
      resetTokenLink: '',
      user: {
        name: '',
        lastname: '',
        email: '',
        roleId: '',
        groups: [],
        password1: '',
        password2: ''
      }
    }
  },
  computed: {
    isEditMode: function () {
      return !isNaN(this.id)
    },
    ...mapState('statics', ['roles', 'groups']),
    ...mapState('auth', ['authorized']),
  },
  created() {
    this.customFetch()
  },
  methods: {
    customFetch: async function () {
      if (this.id) {
        try {
          this.loading = true
          const result = await NOTARY.get(`users/${this.id}`)
          const user = result.data as User
          this.user.name = user.name
          this.user.lastname = user.lastname
          this.user.email = user.email
          this.user.roleId = user.roleId
          this.user.groups = user.groups
        } catch (e) {
          this.fetchError = e
        }
      }
      this.loading = false
    },
    generateResetTokenLink: async function () {
      try {
        const response = await NOTARY
            .post(`auth/generate_reset_token`, {userId: parseInt(this.id)})

        const resetTokenLink
            = `${window.location.origin}/auth/${response.data.reset_token}`


        const input = document.createElement('input');
        input.setAttribute('value', resetTokenLink);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        this.successMessage = 'The link has been copied to clipboard!. '
      } catch (e) {
        this.generateTokenError = e
      }
    },
    save: async function (isValid) {
      if (isValid) {
        this.saving = true
        const {password1, password2, ...userData} = this.user
        try {
          if (this.id) {
            await NOTARY
                .patch(`users/${this.id}`, userData )
          } else {
            await NOTARY
                .post(`users`, {...userData, password: password1})
          }
          this.$router.back()
        } catch (e) {
          this.saveError = e
        }
        this.saving = false
      }
    }
  }
})
</script>

<style scoped>

</style>