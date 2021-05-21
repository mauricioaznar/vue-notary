<template>
  <validation-observer ref="obs">
    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{title}}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <slot />
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                v-if="showClose"
                color="blue darken-1"
                text
                @click="dialog = false"
            >
              Cerrar
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="save"
            >
              Enviar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
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
  data() {
    return {
      dialog: false
    }
  },
  components: {
    ValidationObserver
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
    },
    value: {
      type: Boolean,
      required: true
    },
    showClose: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      }
    }
  },
  methods: {
    handleCancel: function () {
      this.dialog = false
      this.$emit('cancel')
    },
    save: async function () {
      const isValid = await this.$refs.obs.validate()
      this.$emit('submit', isValid)
    }
  },
  created () {
    this.dialog = this.value
  },
  watch: {
    value: function () {
      this.dialog = this.value
    },
    dialog: function () {
      this.$emit('input', this.dialog)
      this.$refs.obs.reset()
    }
  }
})

</script>

