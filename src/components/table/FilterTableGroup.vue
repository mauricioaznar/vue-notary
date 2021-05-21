<template>
  <v-row
      align="center"
  >
    <v-col :cols="filterItemRequired ? '3' : '6'">
      <filter-text
          v-model="filters.filteredText"
          @keydown.enter="emitFilters"
          @click:append="emitFilters"
          :placeholder="'Search ' + entityName.toLowerCase()"
      />
    </v-col>
    <v-col
      v-if="filterItemRequired"
      cols="3"
    >
      <filter-item
          :items="items"
          :item-text="itemText"
          :item-value="itemValue"
          :placeholder="'Select ' + entityName.toLowerCase()"
      />
    </v-col>
    <v-col cols="4">
      <filter-enable-radio
          v-model="filters.filteredEnabled"
          @change="emitFilters"
      >
      </filter-enable-radio>
    </v-col>
    <v-col cols="2">
      <v-btn rounded @click="reset">
        <v-icon>
          mdi-refresh
        </v-icon>
      </v-btn>
      <v-btn class="ml-4" rounded @click="handleAddNew">
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import Vue from "vue";
  import FilterItem from "@/components/table/FilterItem.vue";
  import FilterText from "@/components/table/FilterText.vue";
  import FilterEnableRadio from "@/components/table/FilterEnableRadio.vue";
  import {FilterEnable} from "./FilterEnableRadio.vue";
  import {capitalize} from 'lodash'

  export interface TableGroupFilters<T>{
    filteredItem?: T;
    filteredText: string | undefined;
    filteredEnabled: FilterEnable;
  }

  interface Enabled {
    enabled: boolean;
  }

  export function filterEnabled (item: Enabled, filteredEnabled: FilterEnable): boolean {
    switch (filteredEnabled) {
      case FilterEnable.DISABLED:
        return !item.enabled
      case FilterEnable.ENABLED:
        return item.enabled
      case FilterEnable.ALL:
        return true
    }
  }

  export default Vue.extend({
    components: {
      FilterEnableRadio,
      FilterItem,
      FilterText
    },
    data() {
      return {
        filters: {
          filteredText: '',
          filteredItem: {},
          filteredEnabled: FilterEnable.ENABLED
        } as TableGroupFilters<unknown>
      }
    },
    props: {
      handleFilters: {
        type: Function,
        required: true
      },
      entityName: {
        type: String,
        required: true
      },
      items: {
        type: Array,
        default: () => {
          return []
        }
      },
      itemText: {
        type: String
      },
      itemValue: {
        type: String
      }
    },
    created() {
      this.emitFilters()
    },
    methods: {
      emitFilters: function () {
        // TODO change it to a callback
        this.handleFilters({
          ...this.filters
        })
      },
      reset: function () {
        this.filters.filteredText = ''
        this.filters.filteredItem = {}
        this.filters.filteredEnabled = FilterEnable.ENABLED
        this.$emit('reset')
        this.emitFilters()
      },
      handleAddNew: function () {
        this.$router.push({
          name: capitalize(this.entityName)
        })
      }
    },
    computed: {
      filterItemRequired (): boolean {
        // `this` points to the vm instance
        return this.items.length !== 0
      }
      // filterItemRequired: function () {
      //   return this.items.length !== 0
      // }
    },
  })
</script>