<template>
  <v-container>
    <v-row>
      <v-col>
        <v-toolbar
            dark
            :src="banner"
        >
          <v-toolbar-title>{{title}}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn
              icon
              @click="createItem"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
            :disable-pagination="disablePagination"
            :hide-default-footer="disablePagination"
            disable-sort
            :search="search"
            :headers="computedHeaders"
            :items="items"
            :loading="loading"
            loading-text="Cargando..."
            :items-per-page="itemsPerPage"
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
                  v-if="!disablePagination"
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
            <v-row>
              <v-btn
                  small
                  icon
                  @click="() => {editItem( item )}"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                  small
                  icon
                  @click="confirmDialog = true; selectedItem = item"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
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

<script lang="ts">
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import {User} from '@/models/User'
import {NOTARY} from '@/api/NOTARY'

export default {
  name: 'SimplePaginationTable',
  components: {ConfirmDialog, ErrorToaster},
  props: {
    disablePagination: {
      type: Boolean,
      default: () => {
        return false
      }
    },
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
    search: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      selectedItem: {},
      confirmDialog: false,
      deleteError: {},
      customFetchError: {},
      itemsPerPage: 10,
      selectedClient: {},
      loading: true,
      items: [],
      rowsPerPageItems: [10, 20, 30, 40, 50],
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
          text: 'Acciones',
          value: 'actions',
        }
      ]
    }
  },
  created() {
    this.customFetch()
  },
  methods: {
    editItem: function (item: { id: number }) {
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
    confirmDeletion: function () {
      if (this.selectedItem) {
        this.deleteItem(this.selectedItem)
      }
    },
    deleteItem: async function (item: User) {
      try {
        await NOTARY.delete(`${this.entityUrl}/${item.id}`)
        this.items = this.items.filter(c => {
          return c.id !== this.selectedItem?.id
        })
      } catch (e) {
        this.deleteError = e
      }
    },
    customFetch: async function () {
      this.loading = true
      try {
        const responses = await Promise.all([
          NOTARY.get(`${this.entityUrl}`, {
            params: {...this.fetchParams}
          })
        ])
        const response1 = responses[0]
        if (response1.data) {
          this.items = response1.data
        }
      } catch (e) {
        this.customFetchError = e
      }
      this.loading = false
    },
  },
  watch: {
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