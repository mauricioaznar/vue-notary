<template>
  <v-row justify="center" align="center">
    <v-col cols="2">
      <v-subheader>
        {{name}}
      </v-subheader>
    </v-col>
    <v-col>
      <ValidationProvider
          :ref="name"
          :name="name"
          :rules="rules"
          v-slot="{errors, valid}"
      >
        <v-textarea
            class="vee-field"
            v-model="innerValue"
            :error-messages="errors"
            :success="valid"
            v-bind="$attrs"
            v-on="$listeners"
            persistent-hint
        ></v-textarea>
      </ValidationProvider>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ValidationProvider } from "vee-validate";
import Vue from 'vue'

export default Vue.extend({
  components: {
    ValidationProvider
  },
  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
    // must be included in props
    value: {
      type: String
    },
    name: {
      type: String,
      required: true
    }
  },
  data: () => ({
    innerValue: ''
  }),
  watch: {
    // Handles internal model changes.
    innerValue (newVal) {
      this.$emit('valid', this.$refs[this.name]);
      this.$emit('input', newVal);
    },
    // Handles external model changes.
    value (newVal) {
      this.innerValue = newVal;
    }
  },
  created () {
    this.innerValue = this.value;
  }
});
</script>
