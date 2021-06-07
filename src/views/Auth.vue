<template>
  <v-app>
    <form-layout
      title="Reiniciar contraseña"
      @save:form="save"
    >
      <vee-text-field
          name="Password"
          rules="required|min:10"
          v-model="password1"
      />
      <vee-text-field
          name="Password (repeat)"
          rules="required|confirmed:Password"
          v-model="password2"
          hint="Password must be the same as the previous field"
      />
    </form-layout>
    <error-toaster
      v-model="error"
    />
  </v-app>
</template>

<script>
import VeeTextField from "@/components/forms/VeeTextField";
import FormLayout from "@/components/forms/FormLayout";
import {NOTARY} from "@/api/NOTARY";
import ErrorToaster from "@/views/app/ErrorToaster";
export default {
  components: {ErrorToaster, FormLayout, VeeTextField},
  props: {
    token: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      password1: '',
      password2: '',
      error: {}
    }
  },
  methods: {
    save: async function (isValid) {
      if (isValid) {
        try {
          const response = await NOTARY.post(`auth/change_password/${this.token}`, {
            password: this.password1
          })
          console.log(response)
        } catch (e) {
         this.error = e
        }
      }
    }
  }
}
</script>

<style scoped>

</style>