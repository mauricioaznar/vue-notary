<template>
  <v-timeline-item
      class="mb-6"
      hide-dot
  >
    <h2>{{title}}</h2>
  </v-timeline-item>
</template>

<script>
export default {
  name: 'RoadmapTitle',
  props: {
    title: {
      type: String,
      required: true,
    }
  }

}
</script>

<style scoped>

</style>