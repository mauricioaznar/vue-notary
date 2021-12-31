<template>
  <div>
    <v-snackbar
        v-model="snackbar"
    >
      <div v-html="text"></div>

      <template v-slot:action="{ attrs }">
        <v-btn
            color="green"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'SuccessToaster',
  props: {
    value: {
      required: true
    }
  },
  data () {
    return {
      activate: false,
      snackbar: false,
      text: ''
    }
  },
  methods: {
    setMessage: function (text: string) {
      if (text !== '') {
        this.text = text
        this.snackbar = true
        setTimeout(() => {
          this.snackbar = false
          this.text = ''
        }, 5000)
      }
    }
  },
  created() {
    this.setMessage(this.value)
  },
  watch: {
    value: function (val) {
      this.setMessage(val)
    },
    snackbar: function (snackbar) {
      if (snackbar === false) {
        this.$emit('input', '')
      }
    }
  }
})
</script>
