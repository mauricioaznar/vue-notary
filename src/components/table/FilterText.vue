<template>
  <v-text-field
      v-on="$listeners"
      v-bind="$attrs"
      :placeholder="placeholder"
      hide-details
      dense
      filled
      append-icon="mdi-magnify"
  />
</template>

<script>
  import Vue from "vue";

  export default Vue.extend({
    data () {
      return {

      }
    },
    props: {
      placeholder: {
        type: String,
        default: () => {
          return 'Search'
        }
      }
    }
  })
</script>