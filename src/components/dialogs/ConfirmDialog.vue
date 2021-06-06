<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        Are you sure you want to delete this item?
      </v-card-title>
      <v-card-text>
        Deleting this item may have irreversible changes.
      </v-card-text>
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
  name: "ConfirmDialog",
  data () {
    return {
      dialog: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
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
        this.$emit('cancel')
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