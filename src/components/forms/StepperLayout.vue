<template>
  <custom-container>
    <validation-observer
        ref="obs"
    >
      <v-stepper
          v-model="e1"
          class="elevation-0 pa-0"
      >
        <v-stepper-header
        >
          <v-stepper-step
              v-for="(item, index) in steps"
              :key="index + 1"
              :color="isStepValid(index + 1) ? 'green' : 'light-blue'"
              :complete="isStepValid(index + 1)"
              :edit-icon="'mdi-pencil'"
              complete-icon="mdi-check"
              :step="index + 1"
              :rules="hasStepErrors(index + 1)"
              :editable="!isSequential"
          >
            {{ item.title }}
            <small v-if="item.optional">Optional</small>
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <validation-observer
              v-for="(item, index) in steps"
              :key="index + 1"
              :ref="`step-${index + 1}`"
              tag="div"
              v-slot="props"
          >
            <v-stepper-content
                :key="`${index + 1}-content`"
                :step="index + 1"
                class="px-0 px-md-6"
            >
              <v-container>
                <v-row justify="center">
                  <v-col sm=12>
                    <v-card
                        class="px-3 pt-3 pb-12"
                        outlined
                    >
                      <slot :name="`step-${index + 1}`"/>
                    </v-card>
                    <v-row justify="end" class="my-6">
                      <v-col cols="auto">
                        <v-btn text @click="previousStep(index + 1)">
                          Previous
                        </v-btn>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                            color="primary"
                            @click="nextStep(index + 1)"
                            :disabled="!props.valid || (steps.length === index + 1 && disabled)"
                        >
                          {{ steps.length === index + 1 ? 'Save' : 'Next' }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>
          </validation-observer>
        </v-stepper-items>
      </v-stepper>
      <v-snackbar
          v-model="errorSnackbar"
          color="red"
          right
          bottom
      >
        The following fields have an error:
        <ul>
          <li v-for="field in errorFields" :key="field">{{ field }}</li>
        </ul>
      </v-snackbar>
    </validation-observer>
  </custom-container>
</template>

<script lang="ts">
import Vue from "vue";
import {ValidationObserver} from "vee-validate";
import CustomContainer from "@/components/layouts/CustomContainer.vue";

export default Vue.extend({
  name: "StepperLayout",
  data() {
    return {
      e1: 1,
      errorSnackbar: false,
      errorFields: []
    }
  },
  components: {
    CustomContainer,
    ValidationObserver,
  },
  props: {
    steps: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isSequential: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  watch: {
    steps(val) {
      if (this.e1 > val.length) {
        this.e1 = val.length
      }
    },
    e1: function () {
      this.$emit('change', this.e1)
    }
  },
  methods: {
    nextStep: async function (position: number) {
      const step = this.$refs[`step-${position}`] as InstanceType<typeof ValidationObserver>[]
      const isStepValid = await step[0].validate();
      if (isStepValid) {
        if (position === this.steps.length) {
          const form = this.$refs['obs'] as InstanceType<typeof ValidationObserver>
          const isFormValid = await form.validate()
          if (isFormValid) {
            this.$emit('submit', true);
          } else {
            const errors = Object.keys(this.$refs.obs.errors)
            this.errorFields = errors.filter(field => {
              return this.$refs.obs.errors[field].length >= 1
            })
            this.errorSnackbar = true
          }
        } else {
          this.e1 = position + 1;
        }
      }
    },
    previousStep: function (position: number) {
      if (position !== 1) {
        this.e1 = position - 1;
      } else {
        this.$router.back()
      }
    },
    isStepValid: function (position: number) {
      const ref = this.$refs[`step-${position}`] as InstanceType<typeof ValidationObserver>[]
      if (ref) {
        const step = ref[0]
        const fields = Object.values(step.fields)
        const isInvalid = fields.some(field => {
          return (!field.valid)
        })
        return !isInvalid
      } else {
        return true
      }
    },
    hasStepErrors: function (position: number) {
      const ref = this.$refs[`step-${position}`] as InstanceType<typeof ValidationObserver>[]
      if (ref) {
        const step = ref[0]
        const errors = Object.values(step.errors)
        const isInvalid = errors.some(error => {
          return error.length >= 1
        })
        return [() =>
            (!isInvalid)
        ]
      } else {
        return [() =>
            (true)
        ]
      }
    },
  },
})
</script>

<style>
</style>
