<template>
  <advanced-pagination-table
    entity-url='documents'
    :title="'Documents'"
    :headers='headers'
    extended
    banner='https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg'
    edit-route-name='DocumentsEdit'
    create-route-name='DocumentsNew'
    show-expand
    :fetch-params='{
           search: search,
           year: dates.year,
        }'
  >
    <template slot='extension'>
      <date-tabs
        :dates.sync='dates'
      />
    </template>
    <template slot='toolbar'>
      <v-text-field
        v-model='search'
        hide-details
      />
    </template>
    <template v-slot:expanded-item='{ item }'>
      <v-container
        class='mb-12 mt-6'
      >
        <v-row justify='center'>
          <v-col sm='12' md='6'>
            <document-comments
              :comments='item.documentComments'
              :document-id='item.id'
            />
          </v-col>
          <v-col sm='12' md='6'>
            <v-toolbar dense>
              <v-toolbar-title>Attachments</v-toolbar-title>

              <v-spacer></v-spacer>
            </v-toolbar>
            <div>
              <v-simple-table>
                <template slot='default'>
                  <thead>
                  <tr>
                    <th class='text-left'>
                      Attachment name
                    </th>
                    <th class='text-left'>
                      Status
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for='attachment in item.documentAttachments' :key='attachment.id'>
                    <td>
                      {{ getDocumentAttachmentName(attachment) }}
                    </td>
                    <td>
                      <v-simple-checkbox :value='attachment.attachmentStatus === 1' :ripple='false' />
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </advanced-pagination-table>
</template>

<script lang='ts'>
import Vue from 'vue';
import { getAfterOrBefore, getCurrentYear, getDaysSubNow } from '@/helpers/date-formats';
import AdvancedPaginationTable from '@/components/tables/AdvancedPaginationTable.vue';
import DateTabs from '@/components/tabs/DateTabs.vue';
import { mapState } from 'vuex';
import DocumentComments from '@/views/app/documents/DocumentComments.vue';


export default Vue.extend({
  components: { DocumentComments, DateTabs, AdvancedPaginationTable },
  data() {
    return {
      search: '',
      dates: {
        year: getCurrentYear(),
      },
    };
  },
  created() {
    const year = window.localStorage.getItem('documents_year');
    if (year) {
      this.dates.year = Number(year);
    }
  },
  computed: {
    ...mapState('statics', ['documentAttachments']),
    headers: function() {
      return [
        {
          text: 'Folio',
          value: 'folio',
          width: '10%',
          sortable: false,
        },
        {
          text: 'Tome',
          value: 'tome',
          width: '10%',
          sortable: false,
        },
        {
          text: 'Document type',
          value: 'documentType.name',
          width: '15%',
          sortable: false,
        },
        {
          text: 'Status',
          value: 'documentStatus.name',
          width: '15%',
          sortable: false,
        },
        {
          text: 'Days before completion',
          value: 'expectedCompletionDate',
          width: '10%',
          formatter: function(value) {
            console.log(value);
            return value ? getAfterOrBefore(value) : '-';
          },
        },
        {
          text: 'Client',
          value: 'client.name',
          width: '15%',
          sortable: false,
        },
        {
          text: 'Group',
          value: 'groups',
          width: '15%',
          formatter: function(value) {
            return value.name;
          },
        },
      ];
    },
  },
  methods: {
    rowClass: function(item) {
      if (item.expectedCompletionDate && item.documentStatusId !== 4) {
        const days = getDaysSubNow(item.expectedCompletionDate);
        if (days <= 7) {
          return 'red darken-4 white--text';
        } else if (days <= 21) {
          return 'yellow darken-4 white--text';
        }
      }
      return '';
    },
    getDocumentAttachmentName: function(attachment) {
      const foundDocumentAttachment = this.documentAttachments.find(documentAttachment => documentAttachment.id === attachment.attachmentId);
      return foundDocumentAttachment ? foundDocumentAttachment.name : '';
    },
  },
  watch: {
    'dates': {
      handler: function() {
        window.localStorage.setItem('documents_year', this.dates.year);
      },
      deep: true,
    },
  },
});
</script>

<style scoped>

</style>