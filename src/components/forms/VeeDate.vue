<template>
  <v-row
      justify="center"
      align="center"
  >
    <v-col cols="2" v-if="!noLabel">
      <v-subheader>
        {{ name }}
      </v-subheader>
    </v-col>
    <v-col>
      <v-menu
          v-model="menu1"
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
                v-model="formattedDate"
                v-on:click="menu1 = true"
                :error-messages="errors"
                autocomplete="off"
                :success="rules !== '' && valid"
                class="vee-field"
                readonly
                v-bind="{...attrs, ...inputAttrs}"
                v-on="{...on, ...inputListeners}"
                @change="emitInput"
                @click:clear="clear"
            ></v-text-field>
          </ValidationProvider>
        </template>
        <v-date-picker
            v-model="date"
            @input="menu1 = false"
        ></v-date-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import {ValidationProvider} from "vee-validate";
import {dateFormat, datePickerDateFormat,} from "@/helpers/date-formats";
import moment from "moment";

export default {
  components: {
    ValidationProvider
  },
  data() {
    return {
      menu1: false,
      date: '',
      formattedDate: ''
    }
  },
  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: [String, null],
      validator: (val) => {
        return moment(val, dateFormat).isValid() || val === '' || val === null
      }
    },
    name: {
      type: String,
      required: true
    },
    noLabel: {
      type: Boolean,
      default: () => {
        return false
      }
    }
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
    emitInput: function () {
      if (this.formattedDate === null) {
        this.$emit('input', null)
      } else {
        this.$emit('input', `${this.formattedDate}`)
      }
    },
    handleValueChange() {
      if (this.value !== '' && typeof this.value === 'string') {
        this.date = moment(this.value, dateFormat).format(datePickerDateFormat)
      } else {
        this.formattedDate = null
        this.date = ''
      }
    },
    clear() {
      this.date = ''
      this.formattedDate = null
    }
  },
  created() {
    this.handleValueChange()
  },
  watch: {
    date: function (date) {
      if (this.date !== '' && moment(this.date, datePickerDateFormat).isValid()) {
        this.formattedDate = moment(this.date, datePickerDateFormat).format(dateFormat)
      } else {
        this.formattedDate = null
      }
      this.emitInput()
    },
    value: function () {
      this.handleValueChange()
    }
  }
}
</script>