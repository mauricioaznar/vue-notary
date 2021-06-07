<template>
  <v-container
    class="fill-height flex-column d-flex justify-start"
  >
    <loader-simple
        v-if="loading"
    />
    <form-layout
        v-else
        title="Appointment"
        @save:form="save"
        :disabled="saving || !isEditable"
    >
      <vee-text-field
          name="Name"
          rules="required"
          v-model="appointment.name"
          :disabled="!isEditable"
      />
      <vee-text-field
          name="Description"
          v-model="appointment.description"
          :disabled="!isEditable"
      />
      <vee-date
          v-model="appointment.date"
          name="Date"
          rules="required"
          :disabled="!isEditable"
      />
      <vee-time
          name="Initial date"
          rules="required"
          v-model="appointment.startTime"
          :disabled="!isEditable"
      />
      <vee-time
          name="End date"
          rules="required|after:@Initial date"
          v-model="appointment.endTime"
          :disabled="!isEditable"
      />
      <vee-autocomplete
          name="Room"
          :items="rooms"
          v-model="appointment.roomId"
          item-text="name"
          item-value="id"
          rules="required"
          :disabled="!isEditable"
      >
      </vee-autocomplete>
      <vee-autocomplete
          name="Clients"
          :items="clients"
          v-model="appointment.clients"
          multiple
          item-text="fullname"
          item-value="id"
          return-object
          rules="required"
          :disabled="!isEditable"
      >
      </vee-autocomplete>
      <vee-autocomplete
          name="Users"
          :items="users"
          v-model="appointment.users"
          multiple
          item-text="name"
          item-value="id"
          return-object
          rules="required"
          :disabled="!isEditable"
      >
      </vee-autocomplete>
    </form-layout>
    <ErrorToaster
        v-model="fetchError"
        @relogin="customFetch"
    />
    <ErrorToaster
        v-model="saveError"
        @relogin="() => { save(true) }"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import FormLayout from '@/components/forms/FormLayout.vue'
import VeeTextField from '@/components/forms/VeeTextField.vue'
import VeeTime from '@/components/forms/VeeTime.vue'
import VeeDate from '@/components/forms/VeeDate.vue'
import {mapState} from 'vuex'
import VeeAutocomplete from '@/components/forms/VeeAutocomplete.vue'
import {NOTARY} from '@/api/NOTARY'
import LoaderSimple from '@/components/loaders/LoaderSimple.vue'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {Appointment} from '@/models/Appointment'
import {datePickerDateFormat, timePickerTimeFormat} from '@/helpers/dateFormats'
import moment from 'moment'

export default Vue.extend({
  components: {
    LoaderSimple,
    VeeAutocomplete,
    VeeTime,
    VeeDate,
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
      initialAppointment: null as Appointment | null,
      fetchError: {},
      saveError: {},
      appointment: {
        name: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        roomId: '' as string | number,
        users: [],
        clients: []
      }
    }
  },
  computed: {
    ...mapState('statics', ['rooms', 'clients', 'users']),
    isEditable: function () {
      if (this.initialAppointment === null) {
        return true
      } else {
        return this.initialAppointment.editable
      }
    }
  },
  mounted () {
    this.customFetch()
  },
  methods: {
    customFetch: async function () {
      if (this.id) {
        try {
          this.loading = true
          const result = await NOTARY.get(`appointments/${this.id}`)
          const appointment = result.data as Appointment
          this.initialAppointment = result.data as Appointment
          this.appointment.name = appointment.name
          this.appointment.description = appointment.description
          this.appointment.date = moment(appointment.startDate)
              .format(datePickerDateFormat)
          this.appointment.startTime = moment(appointment.startDate)
              .format(timePickerTimeFormat)
          this.appointment.endTime = moment(appointment.endDate)
              .format(timePickerTimeFormat)
          this.appointment.roomId = appointment.roomId
          this.appointment.users = appointment.users
          this.appointment.clients = appointment.clients
        } catch (e) {
          this.fetchError = e
        }
      }
      this.loading = false
    },
    save: async function (isValid) {
      if (isValid) {
        this.saving = true
        const appointmentsData = {
          ...this.appointment,
          startDate: `${this.appointment.date} ${this.appointment.startTime}`,
          endDate: `${this.appointment.date} ${this.appointment.endTime}`
        }
        try {
          if (this.id) {
            await NOTARY.patch(`appointments/${this.id}`, appointmentsData)
          } else {
            await NOTARY.post(`appointments`, appointmentsData)
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