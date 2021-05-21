<template>
  <v-radio-group
      v-bind="$attrs"
      v-on="inputListeners"
      row
  >
    <v-radio
        :label="FilterEnable[FilterEnable.DISABLED].toLowerCase()"
        :value="FilterEnable.DISABLED"
    ></v-radio>
    <v-radio
        :label="FilterEnable[FilterEnable.ENABLED].toLowerCase()"
        :value="FilterEnable.ENABLED"
    ></v-radio>
    <v-radio
        :label="FilterEnable[FilterEnable.ALL].toLowerCase()"
        :value="FilterEnable.ALL"
    ></v-radio>
  </v-radio-group>
</template>

<script lang="ts">
  import Vue from 'vue'

  export enum FilterEnable {
    ENABLED = 0,
    DISABLED = 1,
    ALL = 2
  }

  export default Vue.extend({
    inheritAttrs: false,
    data () {
      return {
        FilterEnable: FilterEnable
      }
    },
    computed: {
      inputListeners: function (): {} {

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm = this;


        return Object.assign({},
            // We add all the listeners from the parent
            vm.$listeners,
            // Then we can add custom listeners or override the
            // behavior of some listeners.
            {
              // This ensures that the component works with v-model
              change: function (value: unknown) {
                vm.$emit('input', value)
                vm.$emit('change', value)
              }
            }
        )
      }
    },
  })
</script>