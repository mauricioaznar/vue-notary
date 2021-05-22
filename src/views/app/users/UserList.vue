<template>
  <simple-pagination-table
      entity-url="users"
      title="Users"
      :headers="headers"
      banner="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      edit-route-name="UsersEdit"
      create-route-name="UsersNew"
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
        },
        {
          text: 'Last name',
          value: 'lastname',
          width: '30%',
          sortable: false
        },
        {
          text: 'Groups',
          value: 'groups',
          width: '30%',
          formatter: (groups) => {
            return groups.name
          }
        },
        {
          text: 'Role',
          value: 'role.name',
          width: '30%',
          sortable: false
        },
      ]
    }
  },
})
</script>

<style scoped>

</style>