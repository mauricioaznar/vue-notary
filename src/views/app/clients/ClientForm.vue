<template>
  <loader-simple
    v-if="loading"
  />
  <form-layout
      v-else
      title="Cliente"
      @save:form="save"
      :disabled="saving"
  >
    <vee-text-field
        name="Nombre"
        rules="required"
        v-model="client.name"
    />
    <vee-text-field
        name="Apellido"
        rules="required"
        v-model="client.lastname"
    />
    <vee-text-field
        name="Email"
        rules="email"
        v-model="client.email"
    />
    <vee-autocomplete
        name="Otorgantes"
        :items="grantors"
        v-model="client.grantors"
        multiple
        item-text="fullname"
        item-value="id"
        return-object
    >
    </vee-autocomplete>
    <ErrorToaster
        v-model="fetchError"
        @relogin="customFetch"
    />
    <ErrorToaster
        v-model="saveError"
        @relogin="() => { save(true) }"
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
import {Client} from '@/models/Client'

export default Vue.extend({
  components: {
    LoaderSimple,
    VeeAutocomplete,
    VeeTextField,
    FormLayout,
    ErrorToaster
  },
  props: {
    id: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      loading: true,
      saving: false,
      fetchError: {},
      saveError: {},
      client: {
        name: '',
        lastname: '',
        email: '',
        grantors: []
      }
    }
  },
  computed: {
    ...mapState('statics', ['grantors'])
  },
  created () {
    this.customFetch()
  },
  methods: {
    customFetch: async function () {
      if (this.id) {
        try {
          this.loading = true
          const result = await NOTARY.get(`clients/${this.id}`)
          const client = result.data as Client
          this.client.name = client.name
          this.client.lastname = client.lastname
          this.client.email = client.email
          this.client.grantors = client.grantors
        } catch (e) {
          this.fetchError = e
        }
      }
      this.loading = false
    },
    save: async function (isValid) {
      if (isValid) {
        this.saving = true
        const clientsData = {
          ...this.client,
        }
        try {
          if (this.id) {
            await NOTARY.patch(`clients/${this.id}`, clientsData)
          } else {
            await NOTARY.post(`clients`, clientsData)
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