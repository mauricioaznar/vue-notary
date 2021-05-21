<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        Use Google's location service?
      </v-card-title>
      <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="green darken-1"
            text
            @click="cancel"
        >
          Disagree
        </v-btn>
        <v-btn
            color="green darken-1"
            text
            @click="confirm"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      dialog: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  created () {
    this.dialog = this.value
  },
  methods: {
    confirm: function () {
      this.$emit('confirm')
      this.dialog = false
    },
    cancel: function () {
      this.$emit('cancel')
      this.dialog = false
    },
  },
  watch: {
    dialog: function () {
      if (this.dialog) {
        this.$emit('input', true)
      } else {
        this.$emit('input', false)
      }
    },
    value: function () {
      this.dialog = this.value
    }
  }
})
</script>

<style scoped>

</style>