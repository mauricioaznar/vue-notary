<template>
  <simple-pagination-table
      entity-url="groups"
      title="Groups"
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
          text: 'Name',
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