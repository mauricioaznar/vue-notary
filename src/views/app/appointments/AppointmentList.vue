<template>
  <v-container>
    <v-row align="center">
      <v-col cols="auto">
        <h1>
          Appointments
        </h1>
      </v-col>
      <v-spacer/>
      <v-col>
        <vee-date
            label="Date"
            v-model="selectedDate"
            no-label
            name="Selected date"
        >
        </vee-date>
      </v-col>
      <v-spacer/>
      <v-col cols="auto">
        <v-btn
            fab
            dark
            rounded
            small
            @click="createAppointment"
        >
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-calendar
            class="appointments-calendar"
            v-model="selectedDate"
            first-interval="6"
            interval-count="16"
            ref="calendar"
            type="category"
            color="primary"
            :category-show-all="true"
            short-intervals
            :categories="rooms"
            :events="events"
            :event-color="getEventColor"
            event-overlap-mode="stack"
            interval-height="42"
            @click:event="showEvent"
        >
        </v-calendar>
      </v-col>
      <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          nudge-right="160"
      >
        <v-card
            width="300px"
            min-height="350px"
            flat
        >
          <v-toolbar
              :color="selectedEvent.color"
          >
            <v-toolbar-title
                v-html="`${formatTime(selectedEvent.start)} - ${formatTime(selectedEvent.end)}`">

            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                icon
                @click="() => {editItem(this.selectedAppointment)}"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
                v-if="selectedAppointment && selectedAppointment.editable"
                icon
                @click="confirmDialog = true"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
                icon
                @click="selectedOpen = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="text-wrap">
            <p>
              {{selectedEvent.name}}
            </p>
            <v-divider />
            <p class="mt-4 mb-2">
              Users:
            </p>
            <ul class="mb-4">
              <li
                  v-for="user in selectedAppointment ? selectedAppointment.users : []"
                  :key="user.id"
              >
                {{user.fullname}}
              </li>
            </ul>
            <v-divider />
            <p class="mt-4 mb-2">
              Clients:
            </p>
            <ul>

              <li
                  v-for="user in selectedAppointment ? selectedAppointment.clients : []"
                  :key="user.id"
              >
                {{user.fullname}}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-row>

    <v-row class="my-6">
    </v-row>

    <confirm-dialog
        v-model="confirmDialog"
        @confirm="confirmDeletion"
    />
    <ErrorToaster
        v-model="fetchError"
        @relogin="customFetch"
    />
    <ErrorToaster
        v-model="deleteError"
        @relogin="confirmDeletion"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {NOTARY} from '@/api/NOTARY'
import {Appointment} from '@/models/Appointment'
import VeeDate from '@/components/forms/VeeDate.vue'
import moment from 'moment'
import {dateFormat, dateTimeFormat} from '@/helpers/dateFormats'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {formatTime} from '@/helpers/date-formats'
import {mapState} from "vuex";
import {State as StaticState} from "@/store/statics";


interface SyntheticEvent {
  bubbles: boolean;
  cancelable: boolean;
  currentTarget: EventTarget;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  nativeEvent: Event;

  preventDefault(): void;

  stopPropagation(): void;

  target: EventTarget;
  timeStamp: Date;
  type: string;
}

export default Vue.extend({
  components: {ErrorToaster, VeeDate, ConfirmDialog},
  data() {
    return {
      appointments: [] as Appointment[],
      events: [] as any[],
      fetchError: {},
      deleteError: {},
      colors: ['blue', 'red', 'deep-purple', 'green', 'brown', 'orange', 'grey darken-1'],
      selectedEvent: {} as { data: {} },
      selectedAppointment: null as Appointment | null,
      selectedElement: null as {} | null,
      selectedOpen: false,
      loading: true,
      confirmDialog: false,
      selectedDate: moment().format(dateFormat),
    }
  },
  sockets: {
    new_activity: function(activity) {
      if (activity.entityName === 'appointments') {
        const activityDate = moment(activity.entity.startDate, dateTimeFormat).format(dateFormat)
        if (activityDate === this.$data.selectedDate) {
          (this as Vue & { customFetch: () => void }).customFetch()
        }
      }
    }
  },
  computed: {
    ...mapState('statics', {
      rooms: (state: StaticState) => state.rooms.map(room => room.name),
    }),
  },
  mounted() {
    (this.$refs.calendar as Vue & { checkChange: () => void }).checkChange()
  },
  created() {
    const localStorageDate = window.localStorage.getItem('appointments_initial_date')
    if (localStorageDate && moment(localStorageDate).isValid()) {
      this.selectedDate = moment(localStorageDate).format(dateFormat)
    }
    this.customFetch()
  },
  methods: {
    formatTime: formatTime,
    async customFetch () {
      this.loading = true
      try {
        const responses = await Promise.all([
          NOTARY.get(`appointments?startDate=${this.selectedDate}`)
        ])
        const appointments = responses[0]
        if (appointments.data) {
          this.appointments = appointments.data
              .map((appointment: Appointment) => {
                return {
                  ...appointment,
                  roomName: appointment?.room?.name
                }
              }) as Appointment[]
        }
      } catch (e) {
        this.fetchError = e
      }
      this.loading = false
    },
    editItem: function (item: Appointment) {
      const id = String(item.id)
      this.$router.push({
        name: 'AppointmentsEdit',
        params: {id}
      })
    },
    deleteItem: async function (item: Appointment) {
      try {
        await NOTARY.delete(`appointments/${item.id}`)
        this.appointments = this.appointments.filter(appointment => {
          return appointment.id !== this.selectedAppointment?.id
        })
      } catch (e) {
        this.deleteError = e
      }
    },
    confirmDeletion: function () {
      if (this.selectedAppointment) {
        this.deleteItem(this.selectedAppointment)
      }
    },
    showEvent: function ({nativeEvent, event}: { nativeEvent: SyntheticEvent; event: { data: {} } }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedAppointment = event.data as Appointment
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    createAppointment: function () {
      this.$router.push({
        name: 'AppointmentsNew'
      })
    },
    getEventColor(event: { color: string }) {
      return event.color
    },
  },
  watch: {
    selectedDate: function () {
      window.localStorage.setItem('appointments_initial_date', this.selectedDate)
      this.customFetch()
    },
    appointments: function () {
      this.events = this.appointments.map(appointment => {
        return {
          name: appointment.name,
          start: moment(appointment.startDate).format(dateTimeFormat),
          end: moment(appointment.endDate).format(dateTimeFormat),
          color: this.colors[appointment.roomId - 1],
          timed: false,
          category: appointment.roomName,
          data: appointment
        }
      })
    }
  }
})
</script>

<style>
.appointments-calendar .v-calendar-daily__head .v-calendar-category__category {
  padding: 1rem 0;
}
.appointments-calendar .v-calendar-daily__head .v-calendar-daily_head-weekday{
  display: none;
}
.appointments-calendar .v-calendar-daily__head .v-calendar-daily_head-day-label{
  display: none;
}
</style>