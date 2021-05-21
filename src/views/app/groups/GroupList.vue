<template>
  <simple-pagination-table
      entity-url="groups"
      title="Grupos"
      :headers="headers"
      banner="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      edit-route-name="GroupsEdit"
      create-route-name="GroupsNew"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SimplePaginationTable from "@/components/tables/SimplePaginationTable.vue";

export default Vue.extend({
  components: {SimplePaginationTable},
  computed: {
    headers: function () {
      return [
        {
          text: 'Nombre',
          value: 'name',
          width: '30%',
          sortable: false
        }
      ]
    }
  },
})
</script>

<style scoped>

</style>