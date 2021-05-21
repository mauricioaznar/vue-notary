<template>
  <v-timeline-item
      class="mb-4"
      :color="color"
      small
  >
    <v-row justify="space-between">
      <v-col cols="8">
        <slot />
      </v-col>
      <v-col
          class="text-right"
          cols="4"
      >
        {{ formatDate(date) }}
      </v-col>
    </v-row>
  </v-timeline-item>
</template>

<script>
import {formatDate} from "@/helpers/date-formats";

export default {
  name: 'RoadmapItem',
  props: {
    date: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: () => {
        return 'grey'
      }
    }
  },
  methods: {
    formatDate: formatDate
  }
}
</script>

<style scoped>

</style>