<template>
  <v-row justify="center" align="center">
    <v-col cols="2" v-if="!noLabel">
      <v-subheader>
        {{ name }}
      </v-subheader>
    </v-col>
    <v-col>
      <ValidationProvider
          :ref="name"
          :name="name"
          :rules="rules"
          v-slot="{errors, valid}"
      >
        <v-file-input
            class="vee-field"
            v-model="innerValue"
            :error-messages="errors"
            :success="valid"
            v-bind="$attrs"
            v-on="$listeners"
            persistent-hint
        ></v-file-input>
      </ValidationProvider>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {ValidationProvider} from "vee-validate";
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
    value: {},
    name: {
      type: String,
      required: true
    },
    noLabel: {
      type: Boolean,
      default: () => {
        return false
      }
    },
  },
  data: () => ({
    innerValue: null
  }),
  methods: {
  },
  watch: {
    innerValue (newVal) {
      this.$emit('input', newVal);
    },
    value (newVal) {
      this.innerValue = newVal;
    }
  },
  created() {
    this.innerValue = this.value;
  }
});
</script>
