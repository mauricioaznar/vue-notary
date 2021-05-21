<template>
  <advanced-pagination-table
      entity-url="grantors"
      title="Otorgantes"
      :headers="headers"
      banner="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      edit-route-name="GrantorsEdit"
      create-route-name="GrantorsNew"
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
  data () {
    return {
      search: ''
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
          text: 'Clients',
          value: 'clients',
          width: '50%',
          formatter: (client) => {
            return client.fullname
          }
        },
      ]
    }
  },
  watch: {
    options: {
      handler() {
        this.customFetch()
      },
      deep: true,
    },
    search: {
      handler() {
        this.options.page = 1
        this.customFetch()
      }
    }
  },
})
</script>

<style scoped>

</style>