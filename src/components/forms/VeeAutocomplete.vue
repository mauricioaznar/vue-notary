<template>
  <v-row justify="center" align="center">
    <v-col cols="2">
      <v-subheader>
        {{name}}
      </v-subheader>
    </v-col>
    <v-col>
      <ValidationProvider
          :name="name"
          :rules="rules"
          v-slot="{ errors, valid }"
      >
        <v-autocomplete
            v-model="innerValue"
            :error-messages="errors"
            v-bind="$attrs"
            :success="valid"
            class="vee-field"
            persistent-hint
            chips
            small-chips
            deletable-chips
            v-on="$listeners"></v-autocomplete>
      </ValidationProvider>
    </v-col>
  </v-row>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  components: {
    ValidationProvider
  },
  props: {
    rules: {
      type: [Object, String],
      default: ""
    },
    value: {
      type: [Object, String, Number, Array]
    },
    name: {
      type: String,
      required: true
    }
  },
  data: () => ({
    innerValue: null
  }),
  created () {
    this.innerValue = this.value
  },
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    }
  },
}
</script>
