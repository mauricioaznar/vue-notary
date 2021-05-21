<template>
  <v-tooltip v-bind="$attrs">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-bind="{...attrs, ...$attrs}"
        v-on="{...on, ...$listeners}"
      >
        <slot name="default" />
      </v-icon>
    </template>
    <span>{{label}}</span>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'TooltipIcon',
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>