<template>
  <loader-simple
    v-if="loading"
  />
  <form-layout
      v-else
      title="Otorgante"
      @save:form="save"
      :disabled="saving"
  >
    <vee-text-field
        name="Nombre"
        rules="required"
        v-model="grantor.name"
    />
    <vee-text-field
        name="Apellido"
        rules="required"
        v-model="grantor.lastname"
    />
    <vee-text-field
        name="Email"
        rules="email"
        v-model="grantor.email"
    />
    <vee-autocomplete
        name="Clientes"
        :items="clients"
        v-model="grantor.clients"
        multiple
        item-text="fullname"
        item-value="id"
        return-object
        rules="required"
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
import {MONS} from '@/api/MONS'
import LoaderSimple from '@/components/loaders/LoaderSimple.vue'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {Grantor} from '@/models/Grantor'

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
      grantor: {
        name: '',
        lastname: '',
        email: '',
        clients: []
      }
    }
  },
  computed: {
    ...mapState('statics', ['clients'])
  },
  created () {
    this.customFetch()
  },
  methods: {
    customFetch: async function () {
      if (this.id) {
        try {
          this.loading = true
          const result = await MONS.get(`grantors/${this.id}`)
          const grantor = result.data as Grantor
          this.grantor.name = grantor.name
          this.grantor.lastname = grantor.lastname
          this.grantor.email = grantor.email
          this.grantor.clients = grantor.clients
        } catch (e) {
          this.fetchError = e
        }
      }
      this.loading = false
    },
    save: async function (isValid) {
      if (isValid) {
        this.saving = true
        const grantorData = {
          ...this.grantor,
        }
        try {
          if (this.id) {
            await MONS.patch(`grantors/${this.id}`, grantorData)
          } else {
            await MONS.post(`grantors`, grantorData)
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