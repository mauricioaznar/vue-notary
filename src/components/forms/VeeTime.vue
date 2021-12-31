<template>
  <v-row
      justify="center"
      align="center"
  >
    <v-col cols="2">
      <v-subheader>
        {{ name }}
      </v-subheader>
    </v-col>
    <v-col>
      <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <ValidationProvider
              :name="name"
              :rules="rules"
              v-slot="{errors, valid}"
          >
            <v-text-field
                v-model="formattedTime"
                v-on:click="menu2 = true"
                :error-messages="errors"
                autocomplete="off"
                :success="valid"
                class="vee-field"
                readonly
                v-bind="{...attrs, ...inputAttrs}"
                v-on="{...on, ...inputListeners}"
                @change="emitInput"
            ></v-text-field>
          </ValidationProvider>
        </template>
        <v-time-picker
            v-model="time"
            :allowed-minutes="allowedStep"
            scrollable
            format="24hr"
        ></v-time-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import {ValidationProvider} from "vee-validate";
import {
  dateTimeFormat,
  timeFormat,
  timePickerTimeFormat
} from "@/helpers/date-formats";
import moment from "moment";

export default {
  components: {
    ValidationProvider
  },
  data() {
    return {
      menu2: false,
      time: '',
      formattedTime: ''
    }
  },
  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: String,
      validator: (val) => {
        return moment(val, timeFormat).isValid() || val === ''
      }
    },
    name: {
      type: String,
      required: true
    }
  },
  created() {
    this.handleValueChange()
  },
  computed: {
    inputListeners: function () {

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const vm = this;

      return Object.assign({},
          vm.$listeners,
          {}
      )
    },
    inputAttrs: function () {

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const vm = this;

      return Object.assign({},
          vm.$attrs,
          {}
      )
    }
  },
  methods: {
    allowedStep: function (m) {
      return m % 5 === 0
    },
    emitInput: function () {
      if (this.formattedTime) {
        this.$emit('input', `${this.formattedTime}`)
      } else {
        this.$emit('input', '')
      }
    },
    handleValueChange: function () {
      if (this.value !== '') {
        this.time = moment(this.value, timeFormat).format(timePickerTimeFormat)
      }
    }
  },
  watch: {
    time: function () {
      this.formattedTime = moment(this.time, timePickerTimeFormat).format(timeFormat)
      this.emitInput()
    },
    value: function () {
      this.handleValueChange()
    }
  }
}
</script>