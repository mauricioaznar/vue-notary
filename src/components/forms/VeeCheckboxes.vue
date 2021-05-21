<template>
  <v-row>
    <v-col>
      <v-row align="center" v-for="(option) in options" :key="option">
        <v-col cols="4">
          <v-subheader>
            {{option}}
          </v-subheader>
        </v-col>
        <v-col>
          <v-row justify="start">
            <v-col cols="auto">
              <ValidationProvider
                  :ref="option"
                  :name="option"
                  :rules="rules"
                  v-slot="{errors, valid}"
              >
                <v-checkbox
                    class="vee-field"
                    v-model="innerValue"
                    v-bind="$attrs"
                    v-on="$listeners"
                    :value="option"
                    :error-messages="errors"
                    :success="valid"
                ></v-checkbox>
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
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
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      innerValue: [] as any[]
    }
  },
  watch: {
    innerValue: function () {
      this.$emit('input', this.innerValue)
    },
    value () {
      this.setInnerValue()
    }
  },
  methods: {
    setInnerValue: function () {
      this.innerValue = this.value
    }
  },
  created () {
    this.setInnerValue()
  }
});
</script>

<style>
</style>