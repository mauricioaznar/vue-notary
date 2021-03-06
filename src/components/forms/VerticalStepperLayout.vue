<template>
  <custom-container>
    <validation-observer
        ref="obs"
    >
      <v-stepper
          v-model="e1"
          class="mau-stepper elevation-0 pa-0"
          :non-linear="false"
      >
        <validation-observer
            v-for="(item, index) in steps"
            :key="index + 1"
            :ref="`step-${index + 1}`"
            v-slot="props"
            tag="div"
        >
          <v-stepper-step
              :key="index + 1"
              :complete="props.valid"
              :step="index + 1"
              :rules="[() =>
                (Object.values(props.errors)).every(err => err.length === 0)
               ]"
              :editable="!isSequential"
          >
            {{item.title}}
            <small v-if="item.optional">Optional</small>
          </v-stepper-step>
          <v-stepper-content
              :key="`${index + 1}-content`"
              :step="index + 1"
          >
            <v-container>
              <v-row justify="center">
                <v-col sm=12 md="9">
                  <v-card
                      class="pa-3"
                      outlined
                  >
                    <slot :name="`step-${index + 1}`"/>
                  </v-card>
                  <v-row justify="end" class="my-6">
                    <v-col cols="auto">
                      <v-btn text @click="previousStep(index + 1)">
                        Previous step
                      </v-btn>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                          color="primary"
                          @click="nextStep(index + 1)"
                          :disabled="disabled"
                      >
                        {{ steps.length === index + 1 ? 'Finish' : 'Next step'}}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-stepper-content>
        </validation-observer>
      </v-stepper>
    </validation-observer>
  </custom-container>
</template>

<script lang="ts">
import Vue from "vue";
import {ValidationObserver} from "vee-validate";
import CustomContainer from "@/components/layouts/CustomContainer.vue";

export default Vue.extend({
  data() {
    return {
      e1: 1,
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
            console.log('is not valid')
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
    }
  },
})
</script>

<style>
  .mau-stepper .v-stepper__content {
    border-left: 1px solid #DDD;
  }
</style>