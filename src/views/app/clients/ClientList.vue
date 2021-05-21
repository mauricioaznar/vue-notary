<template>
  <advanced-pagination-table
      entity-url="clients"
      title="Clients"
      :headers="headers"
      banner="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      edit-route-name="ClientsEdit"
      create-route-name="ClientsNew"
      :fetch-params="{
        search
      }"
  >
    <template slot="toolbar">
      <v-text-field
          v-model="search"
          hide-details
      />
    </template>
  </advanced-pagination-table>
</template>

<script lang="ts">
import Vue from 'vue'
import AdvancedPaginationTable from "@/components/tables/AdvancedPaginationTable.vue";

export default Vue.extend({
  components: {AdvancedPaginationTable},
  data() {
    return {
      search: '',
    }
  },
  computed: {
    headers: function () {
      return [
        {
          text: 'Fullname',
          value: 'fullname',
          width: '20%',
        },
        {
          text: 'Email',
          value: 'email',
          width: '20%',
        },
        {
          text: 'Grantors',
          value: 'grantors',
          width: '50%',
          formatter: (grantor) => {
            return grantor.fullname
          },
        },
      ]
    }
  },
})
</script>

<style scoped>

</style>