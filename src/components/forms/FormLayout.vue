<template>
  <validation-observer ref="obs">
    <v-card>
      <form>
        <v-container>
          <v-row justify="center">
            <v-col sm="12" md="8">
              <v-row class="my-6">
                <v-col>
                  <h1>{{title}}</h1>
                </v-col>
              </v-row>
              <slot />
              <v-row justify="end" class="my-4">
                <v-col cols="3">
                  <v-btn @click="handleCancel">Cancelar</v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn
                      color="primary"
                      @click="save"
                      :disabled="disabled"
                  >Guardar</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </form>
    </v-card>
  </validation-observer>
</template>

<script lang="ts">
import Vue, {VueConstructor} from "vue";
import {ValidationObserver} from "vee-validate";

  export default (Vue as VueConstructor<
      Vue & {
        $refs: {
          obs: InstanceType<typeof ValidationObserver>;
        };
      }
      >).extend({
    components: {
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
      }
    }
  })
</script>