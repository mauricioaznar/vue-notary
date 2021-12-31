<template>
  <custom-container>
    <validation-observer ref="obs">
      <v-card>
        <form>
          <v-container class="px-4">
            <v-row justify="center">
              <v-col sm="12" xl="10">
                <v-row class="my-6">
                  <v-col>
                    <h1>{{title}}</h1>
                  </v-col>
                </v-row>
                <slot />
                <v-row justify="end" class="mt-12 mb-8">
                  <v-col cols="3">
                    <v-btn @click="handleCancel">Cancelar</v-btn>
                  </v-col>
                  <v-col cols="3">
                    <v-btn
                        color="primary"
                        @click="save"
                        :disabled="disabled"
                    >Save</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </form>
      </v-card>
    </validation-observer>
    <v-snackbar
        v-model="errorSnackbar"
        color="red"
        right
        bottom
    >
      The following fields have an error:
      <ul>
        <li v-for="field in errorFields" :key="field" >{{ field }}</li>
      </ul>
    </v-snackbar>
  </custom-container>
</template>

<script lang="ts">
import Vue, {VueConstructor} from "vue";
import {ValidationObserver} from "vee-validate";
import CustomContainer from "@/components/layouts/CustomContainer.vue";

  export default (Vue as VueConstructor<
      Vue & {
        $refs: {
          obs: InstanceType<typeof ValidationObserver>;
        };
      }
      >).extend({
    data() {
      return {
        errorSnackbar: false,
        errorFields: []
      }
    },
    components: {
      CustomContainer,
      ValidationObserver,
    },
    props: {
      title: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: () => {
          return false
        }
      }
    },
    methods: {
      handleCancel: function () {
        this.$router.back()
      },
      save: async function () {
        const isValid = await this.$refs.obs.validate()
        this.$emit('save:form', isValid)
        if (!isValid) {
          const errors = Object.keys(this.$refs.obs.errors)
          this.errorFields = errors.filter(field => {
            return this.$refs.obs.errors[field].length >= 1
          })
          this.errorSnackbar = true
        }
      }
    }
  })
</script>
