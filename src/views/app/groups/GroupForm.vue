<template>
  <loader-simple
    v-if="loading"
  />
  <form-layout
      v-else
      title="Group"
      @save:form="save"
      :disabled="saving"
  >
    <vee-text-field
        name="Name"
        rules="required"
        v-model="group.name"
    />
    <vee-autocomplete
        name="Leader user"
        :items="users"
        v-model="group.userId"
        item-text="name"
        item-value="id"
        rules="required"
    />
    <vee-autocomplete
        name="Users"
        :items="users"
        v-model="group.users"
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
import {mapState} from 'vuex'
import VeeAutocomplete from '@/components/forms/VeeAutocomplete.vue'
import {NOTARY} from '@/api/NOTARY'
import LoaderSimple from '@/components/loaders/LoaderSimple.vue'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {Group} from '@/models/Group'

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
  data () {
    return {
      loading: true,
      saving: false,
      saveError: {},
      fetchError: {},
      group: {
        name: '',
        userId: '',
        users: []
      }
    }
  },
  computed: {
    ...mapState('statics', ['users'])
  },
  created () {
    this.customFetch()
  },
  methods: {
    customFetch: async function () {
      if (this.id) {
        try {
          this.loading = true
          const result = await NOTARY.get(`groups/${this.id}`)
          const group = result.data as Group
          this.group.name = group.name
          this.group.userId = group.userId
          this.group.users = group.users
        } catch (e) {
          this.fetchError = e
        }
      }
      this.loading = false
    },
    save: async function (isValid) {
      if (isValid) {
        this.saving = true
        const groupData = {
          ...this.group,
        }
        try {
          if (this.id) {
            await NOTARY.patch(`groups/${this.id}`, groupData)
          } else {
            await NOTARY.post(`groups`, groupData)
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