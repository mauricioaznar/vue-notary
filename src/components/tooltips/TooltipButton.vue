<template>
  <v-tooltip v-bind="$attrs">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          rounded
          v-bind="{...attrs, ...$attrs}"
          v-on="{...on, ...$listeners}"
      >
        <slot name="default">
        </slot>
      </v-btn>
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'TooltipButton',
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