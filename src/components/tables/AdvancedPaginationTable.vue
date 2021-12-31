<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar
            dark
            :src="banner"
        >
          <v-toolbar-title>{{ title }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn
              icon
              @click="createItem"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>

          <template v-if="extended" v-slot:extension>
            <slot name="extension">

            </slot>
          </template>

        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
            :headers="computedHeaders"
            :items="items"
            :loading="loading"
            loading-text="Cargando..."
            :server-items-length="totalItems"
            :items-per-page="itemsPerPage"
            :options.sync="options"
            disable-sort
            :expanded="expanded"
            :single-expand="true"
            :show-expand="showExpand"
            :footer-props="{
              'items-per-page-options': [10, 20, 30, 40, 50],
              'items-per-page-text': ''
            }"
        >

          <template v-slot:top="{ pagination, options, updateOptions }">
            <v-toolbar
                elevation="0"
            >
              <slot name="toolbar">

              </slot>
              <v-spacer/>
              <v-data-footer
                  :pagination="pagination"
                  :options="options"
                  :items-per-page-options="rowsPerPageItems"
                  @update:options="updateOptions"
                  items-per-page-text=""
              />
            </v-toolbar>
          </template>

          <template
              v-for="header in headers.filter((h) =>
                h.hasOwnProperty('formatter')
              )"
              v-slot:[`item.${header.value}`]="{ header: header, value }"
          >
            <template v-if="Array.isArray(value)">
              <ul :key="header.text">
                <li v-for="(item, index) in value" :key="index">
                  {{header.formatter(item)}}
                </li>
              </ul>
            </template>
            <template v-else>
              {{header.formatter(value)}}
            </template>
          </template>


          <template v-slot:item.actions="{ item }">
            <v-row dense class="flex-nowrap">
              <v-col>
                <v-btn
                    small
                    icon
                    elevation="6"
                    @click="() => {editItem( item )}"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                    small
                    icon
                    elevation="6"
                    @click="confirmDialog = true; selectedItem = item"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
              <slot name="actions" :item="item">

              </slot>
            </v-row>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <slot name="expanded-item" :item="item">

              </slot>
            </td>
          </template>
        </v-data-table>
      </v-col>
      <confirm-dialog
          v-model="confirmDialog"
          @confirm="confirmDeletion"
      />
      <error-toaster
          v-model="customFetchError"
          @relogin="customFetch"
      />
      <error-toaster
          v-model="deleteError"
          @relogin="confirmDeletion"
      />
    </v-row>
  </v-container>
</template>

<script>
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {NOTARY} from '@/api/NOTARY'
import Vue from "vue";

export default {
  name: 'AdvancedPaginationTable',
  components: {ErrorToaster, ConfirmDialog},
  props: {
    headers: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    entityUrl: {
      type: String,
      required: true
    },
    banner: {
      type: String,
      default: () => {
        return
      }
    },
    editRouteName: {
      type: String,
      required: true,
    },
    createRouteName: {
      type: String,
      required: true,
    },
    fetchParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
    showExpand: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    extended: {
      type: Boolean,
      default: () => {
        return false
      }
    },
  },
  data () {
    return {
      items: [],
      itemsPerPage: 10,
      selectedItem: {},
      loading: true,
      options: {},
      rowsPerPageItems: [10, 20, 30, 40, 50],
      totalItems: 0,
      confirmDialog: false,
      customFetchError: {},
      deleteError: {},
      expanded: []
    }
  },
  sockets: {
    new_activity: function (activity) {
      if (activity.entityName === this.$props.entityUrl) {
        this.customFetch()
      }
    }
  },
  computed: {
    computedHeaders: function () {
      return [
          ...this.headers,
        {
          width: '10%',
          text: 'Acciones',
          value: 'actions'
        }
      ]
    }
  },
  methods: {
    customFetch: async function () {
      this.loading = true
      const {sortBy, sortDesc, page, itemsPerPage} = this.options
      const params = {
        page,
        itemsPerPage,
        ...this.fetchParams,
      }
      try {
        const responses = await Promise.all([
          NOTARY.get(`${this.entityUrl}/pagination?`, {params})
        ])
        const response1 = responses[0]
        if (response1.data) {
          this.totalItems = response1.data.total
          this.items = response1.data.results
        }
      } catch (e) {
        this.customFetchError = e
      }
      this.loading = false
    },
    editItem: function (item) {
      const id = String(item.id)
      this.$router.push({
        name: this.editRouteName,
        params: {id}
      })
    },
    createItem: function () {
      this.$router.push({
        name: this.createRouteName
      })
    },
    deleteItem: async function (item) {
      try {
        await NOTARY.delete(`${this.entityUrl}/${item.id}`)
        await this.customFetch()
      } catch (e) {
        this.deleteError = e
      }
    },
    confirmDeletion: function () {
      if (this.selectedItem) {
        this.deleteItem(this.selectedItem)
      }
    }
  },
  watch: {
    options: {
      handler() {
        this.customFetch()
      },
      deep: true,
    },
    fetchParams: {
      handler: function () {
        this.customFetch()
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>