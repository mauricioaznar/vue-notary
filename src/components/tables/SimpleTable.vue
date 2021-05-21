<template>
  <v-data-table
      v-bind="$attrs"
      v-on="$listeners"
      disable-pagination
      hide-default-footer
      :headers="headers"
      :items="items"
      :loading="loading"
  >

    <template
        v-for="header in headers.filter((h) =>
                h.hasOwnProperty('formatter') || h.hasOwnProperty('renderInline')
              )"
        v-slot:[`item.${header.value}`]="{ header: header, value, item }"
    >
      <slot v-if="header.hasOwnProperty('formatter')" :name="`item.${header.value}`" :item="item" :value="value">
        {{ header.formatter(value) }}
      </slot>
      <slot v-if="header.hasOwnProperty('renderInline')" :name="`item.${header.value}`" :item="item" :value="value">

      </slot>
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <slot name="expanded-item" :headers="headers" :item="item">

      </slot>
    </template>

  </v-data-table>
</template>

<script>
export default {
  name: 'SimpleTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  }
}
</script>

<style scoped>

</style>