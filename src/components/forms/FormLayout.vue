<template>
  <custom-container>
    <validation-observer ref="obs">
      <form>
        <v-card>
          <v-container>
            <v-row>
              <v-col class="ml-2">
                <h1>{{ title }}</h1>
              </v-col>
            </v-row>
            <slot/>
            <v-row justify="end" class="my-4">
              <v-col sm="auto" md="3">
                <v-btn @click="handleCancel">Cancelar</v-btn>
              </v-col>
              <v-col sm="auto" md="3">
                <v-btn
                    color="primary"
                    @click="save"
                    :disabled="disabled"
                >Guardar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </form>
    </validation-observer>
  </custom-container>
</template>

<script lang="ts">
import Vue, {VueConstructor} from "vue";
import {ValidationObserver} from "vee-validate";
import CustomContainer from "@/components/layouts/CustomContainer.vue";

export default (Vue as VueConstructor<Vue & {
  $refs: {
    obs: InstanceType<typeof ValidationObserver>;
  };
}>).extend({
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
    }
  }
})
</script>