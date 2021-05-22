<template>
    <advanced-pagination-table
        entity-url="documents"
        :title="'Documents'"
        :headers="headers"
        banner="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
        edit-route-name="DocumentsEdit"
        create-route-name="DocumentsNew"
        :fetch-params="{
           search: search,
           year: dates.year,
        }"
    >
      <template slot="extension">
        <date-tabs
            :dates.sync="dates"
        />
      </template>
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
import {getCurrentMonth, getCurrentYear} from "@/helpers/date-formats";
import AdvancedPaginationTable from "@/components/tables/AdvancedPaginationTable.vue";
import DateTabs from "@/components/tabs/DateTabs.vue";


export default Vue.extend({
  components: {DateTabs, AdvancedPaginationTable},
  data() {
    return {
      search: '',
      dates: {
        month: getCurrentMonth(),
        year: getCurrentYear()
      },
    }
  },
  computed: {
    headers: function () {
      return [
        {
          text: 'Folio',
          value: 'folio',
          width: '15%',
          sortable: false
        },
        {
          text: 'Tome',
          value: 'tome',
          width: '15%',
          sortable: false
        },
        {
          text: 'Document type',
          value: 'documentType.name',
          width: '15%',
          sortable: false
        },
        {
          text: 'Status',
          value: 'documentStatus.name',
          width: '15%',
          sortable: false
        },
        {
          text: 'Client',
          value: 'client.name',
          width: '15%',
          sortable: false
        },
        {
          text: 'Group',
          value: 'groups',
          width: '15%',
          formatter: function (value) {
            return value.name
          }
        },
      ]
    }
  },
})
</script>

<style scoped>

</style>