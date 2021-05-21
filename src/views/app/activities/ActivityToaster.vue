<template>
  <div>
    <v-snackbar
      :key="activity ? activity.id : '0'"
      :value="snackbar"
      :color="getColor(activity)"
      @input="snackbar = false"
      timeout="5000"
      left
      top
    >
      <div v-html="activity.description"></div>

      <template v-slot:action="{ attrs }">
        <v-btn
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
import getActivityColor from "@/views/app/activities/get-activity-color";

export default Vue.extend({
  name: 'ActivityToaster',
  data () {
    return {
      activity: false,
      snackbar: false,
      text: ''
    }
  },
  sockets: {
    new_activity: function (val) {
      this.$data.snackbar = true
      this.$data.activity = val
    }
  },
  methods: {
    getColor: getActivityColor
  },
})
</script>