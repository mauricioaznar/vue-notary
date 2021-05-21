<template>
  <v-row justify="center" align="center">
    <v-col cols="2" v-if="!noLabel">
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
        <v-text-field
            class="vee-field"
            v-model="innerValue"
            :error-messages="errors"
            :success="valid"
            v-bind="$attrs"
            v-on="$listeners"
            persistent-hint
        ></v-text-field>
      </ValidationProvider>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ValidationProvider } from "vee-validate";
import Vue from "vue";

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
      type: [String, Number]
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
  data: () => ({
    innerValue: ''
  }),
  watch: {
    // Handles internal model changes.
    innerValue (newVal) {
      if (this.$attrs.type && this.$attrs.type === 'number') {
        this.$emit('input', parseInt(newVal))
      } else {
        this.$emit('input', newVal);
      }
    },
    // Handles external model changes.
    value (newVal) {
      this.innerValue = String(newVal);
    }
  },
  created () {
    this.innerValue = String(this.value);
  }
});
</script>
