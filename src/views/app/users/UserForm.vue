<template>
  <loader-simple
      v-if="loading"
  />
  <form-layout
      v-else
      title="Usuario"
      @save:form="save"
      :disabled="saving"
  >
    <vee-text-field
        name="Nombre"
        rules="required"
        v-model="user.name"
    />
    <vee-text-field
        name="Apellidos"
        rules="required"
        v-model="user.lastname"
    />
    <vee-text-field
        name="Email"
        rules="required|email"
        v-model="user.email"
    />
    <vee-autocomplete
        name="Rol"
        :items="roles"
        v-model="user.roleId"
        item-text="name"
        item-value="id"
        rules="required"
    />
    <vee-autocomplete
        name="Grupos"
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
        name="Contraseña"
        rules="required|min:10"
        v-model="user.password1"
    />
    <vee-text-field
        v-if="!this.isEditMode"
        name="Contraseña (repetir)"
        rules="required|confirmed:Contraseña"
        v-model="user.password2"
        hint="Repetir la contraseña igual que en el anterior campo"
    />

    <v-row
        class="mt-4 mb-2"
        v-if="isEditMode"
    >
      <v-spacer/>
      <v-col cols="auto">
        <v-btn
            @click="generateResetTokenLink"
        >
          Generar link para reiniciar contrasena
        </v-btn>
      </v-col>
    </v-row>
    <v-row
        class="mt-2 mb-6"
        v-if="isEditMode && resetTokenLink !== ''"
    >
      <v-spacer />
      <v-col cols="3">
        <a
            :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}&body=${resetTokenLink}&subject=contrasena`"
            target="_blank"
        >
          Enviar link de reinicio (GMAIL)
        </a>
      </v-col>
      <v-col cols="3">
        <a
            :href="`http://www.hotmail.msn.com/secure/start?action=compose&to=${user.email}&body=${resetTokenLink}&subject=contrasena`"
            target="_blank"
        >
          Enviar link de reinicio (HOTMAIL)
        </a>
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
  </form-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import FormLayout from '@/components/forms/FormLayout.vue'
import VeeTextField from '@/components/forms/VeeTextField.vue'
import {mapActions, mapState} from 'vuex'
import VeeAutocomplete from '@/components/forms/VeeAutocomplete.vue'
import {MONS} from '@/api/MONS'
import LoaderSimple from '@/components/loaders/LoaderSimple.vue'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {User} from '@/models/User'

export default Vue.extend({
  components: {
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
          const result = await MONS.get(`users/${this.id}`)
          const user = result.data as User
          this.user.name = user.name
          this.user.lastname = user.lastname
          this.user.email = user.email
          this.user.roleId = user.roleId
          this.user.groups = user.groups
        } catch (e) {
          this.submitError = e
        }
      }
      this.loading = false
    },
    generateResetTokenLink: async function () {
      try {
        const response = await MONS
            .post(`auth/generate_reset_token`, {userId: parseInt(this.id)})
        console.log(window.location)
        this.resetTokenLink
            = `${window.location.origin}/auth/${response.data.reset_token}`
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
            await MONS
                .patch(`users/${this.id}`, userData )
          } else {
            await MONS
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