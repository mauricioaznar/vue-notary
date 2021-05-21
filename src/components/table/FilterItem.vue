<template>
  <v-select
      v-bind="$attrs"
      v-on="$listeners"
      :items="items"
      :item-text="itemText"
      :placeholder="placeholder"
      :item-value="itemValue"
      dense
      filled
      hide-details
      return-object
      single-line
  ></v-select>
</template>

<script>
  import Vue from "vue";

  export default Vue.extend({
    props: {
      items: {
        type: Array,
        required: true
      },
      itemValue: {
        type: String,
        required: true
      },
      itemText: {
        type: String,
        required: true
      },
      placeholder: {
        type: String,
        default: () => {
          return 'Select'
        }
      }
    }
  })
</script>

