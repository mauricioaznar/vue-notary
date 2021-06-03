<template>
  <validation-observer ref="obs">
    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
            class="mb-6"
          >
            <v-btn
              v-if="showClose"
              icon
              @click="dialog = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-container>
              <slot></slot>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-row justify="end" class="my-6">
              <v-col cols="3">
                <v-btn
                    v-if="showClose"
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                >
                  Submit
                </v-btn>
              </v-col>
            </v-row>
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
  name: 'DialogLayout',
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

