<template>
  <v-container style="max-width: 1000px">
    <v-timeline
      dense
      clipped
    >
      <v-timeline-item
        hide-dot
        class="mb-12 align-center"
      >
        <h1 class="text-center">Roadmap</h1>
      </v-timeline-item>
      <roadmap-title
        title="NOTARY v.2.0.0"
      />
      <roadmap-item
          date="2022-05-18"
      >
        [Characteristic] Application has been approved by users.
      </roadmap-item>

      <roadmap-title
          title="NOTARY v.2.0.0-beta-2 (current)"
      />
      <roadmap-item
          color="green"
          date="2021-05-03"
      >
        [Caracteristica] Los usuarios pueden cerrar sesion
      </roadmap-item>
      <roadmap-item
          color="green"
          date="2021-05-03"
      >
        [Caracteristica] Application detects when there is not a connection to the server and shows a message.
      </roadmap-item>


      <roadmap-title
          title="NOTARY v.2.0.0-beta-1"
      />
      <roadmap-item
          color="green"
          date="2021-04-30"
      >
        [Caracteristica] Show a dialog when an appointment gets clicked.
      </roadmap-item>
      <roadmap-item
          color="green"
          date="2021-04-30"
      >
        [Caracteristica] Improve overall user experience when users logs in
      </roadmap-item>
    </v-timeline>
  </v-container>
</template>

<script>
import RoadmapTitle from "@/views/roadmap/RoadmapTitle";
import RoadmapItem from "@/views/roadmap/RoadmapItem";
export default {
  name: 'Roadmap',
  components: {RoadmapItem, RoadmapTitle}
}
</script>

<style scoped>

</style>