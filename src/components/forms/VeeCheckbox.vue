<template>
  <v-row align="center">
    <v-col cols="auto">
      <v-checkbox
          class="vee-field"
          v-model="innerValue"
          v-bind="$attrs"
          v-on="$listeners"
      ></v-checkbox>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    // must be included in props
    value: {
      type: [String, Number]
    },
  },
  data: () => ({
    innerValue: false
  }),
  watch: {
    // Handles internal model changes.
    innerValue () {
      this.$emit('input', this.innerValue ? 1 : 0);
    },
    // Handles external model changes.
    value () {
      this.setInnerValue()
    }
  },
  methods: {
    setInnerValue: function () {
      this.innerValue = this.value === 1 || this.value === '1'
    }
  },
  created () {
    this.setInnerValue()
  }
});
</script>

<style>
</style>