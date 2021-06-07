<template>
  <v-container>
    <v-row>
      <v-col cols="auto">
        <h1>
          Actividades
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <simple-table
            :items="activities"
            :headers="headers"
            :item-class="row_classes"
        >
          <template
              v-slot:item.type="{ item }"
          >
            <v-icon :color="getActivityColor(item)">
              mdi-{{ getActivityIcon(item) }}
            </v-icon>
          </template>
          <template
              v-slot:item.entityName="{ item }"
          >
            <v-btn
                elevation="2"
                v-if="item.type !== 'delete'"
                icon
                small
                :to="`${item.entityName}/${item.entityId}`"
            >
              <v-icon>
                mdi-link-variant
              </v-icon>
            </v-btn>
          </template>
        </simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {mapActions, mapState} from "vuex";
import getActivityColor from "./get-activity-color";
import SimpleTable from "../../../components/tables/SimpleTable.vue";
import moment from "moment";
import getActivityIcon from "./get-activity-icon";

export default {
  name: 'NotificationList',
  components: {SimpleTable},
  data() {
    return {
      previousLastUpdateCheck: null,
      headers: [
        {
          text: 'Tipo de actividad',
          value: 'type',
          renderInline: true,
          align: 'center'
        },
        {
          text: 'Descripcion',
          value: 'description'
        },
        {
          text: 'Usuario que realizo el cambio',
          value: 'user.fullname'
        },
        {
          text: 'Fecha',
          value: 'updatedAt',
          formatter: (value) => {
            return moment(value).fromNow()
          }
        },
        {
          text: 'Link',
          value: 'entityName',
          renderInline: true,
          align: 'center'
        },
      ]
    }
  },
  created() {
    this.previousLastUpdateCheck = this.lastActivityUpdateCheck
    const mostRecentActivity = this.activities.length > 0 ? this.activities[0] : null
    if (mostRecentActivity) {
      this.setLastActivityUpdateCheck(mostRecentActivity.updatedAt)
    }
  },
  beforeDestroy() {
    const mostRecentActivity = this.activities.length > 0 ? this.activities[0] : null
    if (mostRecentActivity) {
      this.setLastActivityUpdateCheck(mostRecentActivity.updatedAt)
    }
  },
  computed: {
    ...mapState('activities', ['activities', 'lastActivityUpdateCheck']),
  },
  methods: {
    ...mapActions('activities', ['setLastActivityUpdateCheck']),
    getActivityColor: getActivityColor,
    getActivityIcon: getActivityIcon,
    row_classes(item) {
      const momentLastActivityUpdateCheck = moment(this.previousLastUpdateCheck)
      const momentUpdatedAt = moment(item.updatedAt)
      if (momentUpdatedAt.isAfter(momentLastActivityUpdateCheck)) {
        return "yellow darken-3";
      }
    }
  }
}
</script>

<style scoped>
</style>