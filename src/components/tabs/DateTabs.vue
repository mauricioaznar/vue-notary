<template>
  <v-tabs
      v-model="tab"
      align-with-title
      show-arrows
      center-active
      @change="emitDates"
  >
    <v-tabs-slider color="green"></v-tabs-slider>

    <v-tab
        v-for="dateRange in dateRanges"
        :key="dateRange"
    >
      {{ dateRange }}
    </v-tab>
  </v-tabs>
</template>

<script>
import moment from "moment";

export default {
  name: 'DateTabs',
  props: {
    dates: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      tab: 6,
      dateRanges: [],
    }
  },
  created () {
    const dateRanges = []
    const oneMonthFromTodayMoment = moment().add('1', 'month')
    let current = moment('2018-01-01')
    while(current < oneMonthFromTodayMoment) {
      dateRanges.unshift(current.format('YYYY'))
      current = current.add(1, 'year')
    }
    this.dateRanges = dateRanges
    this.tab = dateRanges.findIndex(dr => {
      return dr === moment(`${this.dates.year}`, 'YYYY')
          .format('YYYY')
    })
  },
  methods: {
    emitDates: function () {
      const dateRange = this.dateRanges[this.tab]
      const year = moment(dateRange, 'YYYY-MM').format('YYYY')
      this.$emit('update:dates', { year })
    }
  },
}
</script>

<style scoped>

</style>