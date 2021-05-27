<template>
  <v-card
      class="mx-auto"
  >
    <v-toolbar dense>
      <v-toolbar-title>Comments</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn
          elevation="2"
          small
          icon
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-list two-line max-height="400" class="overflow-y-auto">
      <template v-for="(item, index) in comments">
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-title
                class="text--primary"
                v-text="item.user ? item.user.fullname : 'no-user'"
            ></v-list-item-title>
            <v-list-item-subtitle v-text="item.comment"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-action-text v-text="item.createdAt"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>

        <v-divider
            v-if="index < comments.length - 1"
            :key="index"
        ></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'DocumentComments',
  data() {
    return {
      selected: []
    }
  },
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  created() {
    //
  }
}
</script>

<style scoped>

</style>