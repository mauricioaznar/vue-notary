<template>
  <simple-pagination-table
      entity-url="users"
      title="Usuarios"
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
          text: 'Nombre',
          value: 'name',
          width: '30%',
          sortable: false
        },
        {
          text: 'Apellidos',
          value: 'lastname',
          width: '30%',
          sortable: false
        },
        {
          text: 'Grupos',
          value: 'groups',
          width: '30%',
          formatter: (groups) => {
            return groups.name
          }
        },
        {
          text: 'Rol',
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