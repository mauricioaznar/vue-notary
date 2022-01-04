<template>
  <v-container class='fill-height d-flex flex-column justify-start px-0 px-md-6'>
    <loader-simple v-if='loading' />
    <stepper-layout
      v-if='!loading'
      :steps='steps'
      @submit='save'
      @change='changeCurrentStep'
      :disabled='saving || !this.isEditable'
      :is-sequential='!editMode'
      title='Stepper form'
    >
      <template slot='step-1'>
        <vee-autocomplete
          name='Year'
          :items='years'
          v-model='document.year'
          :rules='{
              required: true,
            }'
          :disabled='!isEditable'
        />
        <vee-text-field
          name='Folio'
          :rules='{
              required: true,
              min_value: 1,
              max_value: 400
            }'
          v-model='document.folio'
          type='number'
          :disabled='!isEditable'
        />
        <vee-text-field
          name='Tome'
          :rules='{
              required: true,
              regex: /^[0-9]+([-][0-9]+)?$/,
              document_unique: {
                year: this.document.year,
                folio: this.document.folio,
                tome: this.document.tome,
                id: this.initialDocument ? this.initialDocument.id : undefined,
              }
            }'
          v-model='document.tome'
          hint='Formatos validos: 12-12 o 12'
          :disabled='!isEditable'
        />
        <vee-autocomplete
          name='Document type'
          :items='documentTypes'
          v-model='document.documentTypeId'
          item-text='name'
          item-value='id'
          rules='required'
          :disabled='!isEditable'
        />
        <vee-autocomplete
          name='Document status'
          :items='documentStatuses'
          v-model='document.documentStatusId'
          item-text='name'
          item-value='id'
          rules='required'
          :disabled='!isEditable'
        />
        <vee-date
          name='Expected completion date'
          v-model='document.expectedCompletionDate'
          clearable
        />
      </template>
      <template slot='step-2'>
        <vee-autocomplete
          name='Client'
          :items='clients'
          v-model='document.clientId'
          item-text='name'
          item-value='id'
          rules='required'
          :disabled='!isEditable'
        />
        <vee-autocomplete
          name='Operations'
          :items='filteredOperations'
          v-model='document.operations'
          multiple
          item-text='name'
          item-value='id'
          return-object
          :disabled='!isEditable'
        >
        </vee-autocomplete>
        <vee-autocomplete
          name='Grantors'
          :items='grantors'
          v-model='document.grantors'
          multiple
          item-text='fullname'
          item-value='id'
          return-object
          :disabled='!isEditable'
        >
        </vee-autocomplete>
        <vee-autocomplete
          name='Groups'
          :items='groups'
          v-model='document.groups'
          multiple
          item-text='name'
          item-value='id'
          return-object
          :disabled='!isEditable'
        >
        </vee-autocomplete>
      </template>
      <template slot='step-3'>
        <vee-autocomplete
          name='Document attachments'
          :items='filteredAttachments'
          v-model='document.attachments'
          multiple
          item-text='name'
          item-value='id'
          return-object
          :disabled='!isEditable'
        >
        </vee-autocomplete>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class='text-left'>
                Document attachment
              </th>
              <th class='text-left'>
                Status
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for='documentAttachment in document.documentAttachments'
              :key='documentAttachment.attachmentId'
            >
              <td>{{ findAttachment(documentAttachment.attachmentId) }}</td>
              <td>
                <vee-checkbox
                  v-model='documentAttachment.attachmentStatus'
                  :disabled='!isEditable'
                />
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
      <template slot="step-4">
        <vee-file
          name="Certificados"
          v-model="files"
          multiple
          hint="Only use this field to add new files"
        />
        <v-simple-table v-if="document.documentFiles.length > 0" class="mb-6">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Files
              </th>
              <th />
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="(documentFile, index) in document.documentFiles"
              :key="index"
            >
              <td>
                {{documentFile.originalName}}
              </td>
              <td class="d-flex align-center justify-end">
                <v-btn link icon :href="documentFile.url" target="_blank">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
                <v-btn class="ml-2" @click="removeDocumentFile(documentFile)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
      <template slot='step-5'>
        <document-comments
          v-if='editMode'
          :is-visible='currentStep === 4'
          :document-id='id'
        >

        </document-comments>
      </template>
    </stepper-layout>
    <ErrorToaster
      v-model='fetchError'
      @relogin='customFetch'
    />
    <ErrorToaster
      v-model='saveError'
      @relogin='() => { save(true) }'
    />
  </v-container>
</template>

<script lang='ts'>

import Vue from 'vue';
import VeeTextField from '@/components/forms/VeeTextField.vue';
import { NOTARY } from '@/api/NOTARY';
import { Documents } from '@/models/Documents';
import { years } from '@/helpers/date-formats';
import ErrorToaster from '@/views/app/ErrorToaster.vue';
import VeeDate from '@/components/forms/VeeDate.vue';
import VeeAutocomplete from '@/components/forms/VeeAutocomplete.vue';
import { mapState } from 'vuex';
import VeeCheckbox from '@/components/forms/VeeCheckbox.vue';
import LoaderSimple from '@/components/loaders/LoaderSimple.vue';
import DocumentComments from '@/views/app/documents/DocumentComments.vue';
import StepperLayout from '@/components/forms/StepperLayout.vue';
import VeeFile from '@/components/forms/VeeFile.vue';

export default Vue.extend({
  components: {
    VeeDate,
    VeeFile,
    StepperLayout,
    LoaderSimple,
    VeeCheckbox,
    VeeAutocomplete,
    ErrorToaster,
    VeeTextField,
    DocumentComments,
  },
  data() {
    return {
      document: {
        folio: '',
        fileNumber: '',
        tome: '',

        documentStatusId: '',
        clientId: '',
        documentTypeId: '',
        expectedCompletionDate: null,
        operations: [],
        grantors: [],
        groups: [],
        year: '',
        attachments: [],
        documentAttachments: [],
        documentProperties: [],
        documentComments: [],
        documentFiles: [],
      },
      files: [],
      comment: '',
      years: years,
      initialDocument: null as Documents | null,
      tripleBooleanOptions: [
        { value: 1, text: 'Complete' },
        { value: 0, text: 'Incomplete' },
        { value: -1, text: 'Doesnt apply' },
      ],
      fetchError: {},
      saveError: {},
      loading: false,
      saving: false,
      currentStep: 1,
    };
  },
  props: {
    id: {
      type: String,
    },
  },
  created() {
    this.customFetch();
  },
  computed: {
    ...mapState('statics', [
      'clients',
      'documentStatuses',
      'documentTypes',
      'documentOperations',
      'grantors',
      'groups',
      'documentAttachments',
      'users',
    ]),
    editMode: function() {
      return !!this.id;
    },
    steps: function() {
      const steps = [
        {
          title: 'Step 1',
          optional: false,
        },
        {
          title: 'Step 2',
          optional: false,
        },
        {
          title: 'Step 3',
          optional: false,
        },
        {
          title: 'Files',
          optional: false,
        },
      ];
      if (this.editMode) {
        steps.push({
          title: 'Comments',
          optional: true,
        });
      }
      return steps;
    },
    filteredOperations: function() {
      return this.documentOperations.filter(operation => {
        return operation.documentTypeOperations.some(documentTypeOperation => {
          return documentTypeOperation.documentTypeId === this.document.documentTypeId;
        });
      });
    },
    filteredAttachments: function() {
      return this.documentAttachments.filter(attachment => {
        return attachment.documentTypeAttachments.some(documentTypeAttachment => {
          return documentTypeAttachment.documentTypeId === this.document.documentTypeId;
        });
      });
    },
    isEditable: function() {
      if (this.initialDocument === null) {
        return true;
      } else {
        return this.initialDocument.editable;
      }
    },
  },
  methods: {
    customFetch: async function() {
      if (this.id) {
        try {
          this.loading = true;
          const result = await NOTARY.get(`documents/${this.id}`);
          const document = result.data as Documents;
          this.initialDocument = result.data as Documents;
          this.document.folio = document.folio;
          this.document.tome = document.tome;
          this.document.year = document.year;
          this.document.documentStatusId = document.documentStatusId;
          this.document.documentTypeId = document.documentTypeId;
          this.document.clientId = document.clientId;
          this.document.operations = document.operations;
          this.document.groups = document.groups;
          this.document.grantors = document.grantors;
          this.document.attachments = document.attachments;
          this.document.documentAttachments = document.documentAttachments;
          this.document.documentProperties = document.documentProperties;
          this.document.documentFiles = document.documentFiles;
          this.document.expectedCompletionDate = document.expectedCompletionDate;
        } catch (e) {
          this.fetchError = e;
        }
      }
      this.loading = false;
    },
    save: async function(isValid) {
      if (isValid) {
        this.saving = true;
        const documentData = {
          ...this.document,
        };
        try {
          this.disabled = true;
          let id
          if (this.id) {
            id = this.id
            await NOTARY.patch(`documents/${this.id}`, documentData);
          } else {
            const post = await NOTARY.post(`documents`, documentData);
            id = post.data.id
          }

          if (this.files.length > 0) {
            const formData = new FormData()
            this.files.forEach((file) => {
              formData.append('files', file)
            })
            await NOTARY
              .post(`documents/files/${id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
          }

          this.$router.push({
            name: 'Documents',
          });
        } catch (e) {
          this.saveError = e;
        }
        this.saving = false;
      }
    },
    findAttachment: function(attachmentId) {
      return this.documentAttachments.find(attachment => attachment.id === attachmentId)?.name;
    },
    changeCurrentStep: function(val) {
      this.currentStep = val;
    },
    removeDocumentFile: function (val) {
      this.document.documentFiles = this.document.documentFiles.filter(dc => dc.id !== val.id)
    },
  },
  watch: {
    currentStep: function() {
      // console.log(this.currentStep);
    },
    'document.attachments': {
      handler: function(attachments) {
        const documentAttachments = [];
        attachments.forEach(attachment => {
          const prevDocumentAttachment = this.document.documentAttachments
            .find(documentAttachment => {
              return documentAttachment.attachmentId === attachment.id;
            });
          if (prevDocumentAttachment) {
            documentAttachments.push(prevDocumentAttachment);
          } else {
            documentAttachments.push({
              attachmentId: attachment.id,
              attachmentStatus: 0,
            });
          }
        });
        this.document.documentAttachments = documentAttachments;
      },
      deep: true,
    },
    'document.documentTypeId': {
      handler: function() {
        if (this.initialDocument && this.initialDocument.operations) {
          let operations = this.initialDocument.operations.slice();
          operations = operations.filter(initialOperation => {
            const documentOperation = this.documentOperations.find(operation => {
              return initialOperation.id === operation.id;
            });
            if (!documentOperation) return false;
            return documentOperation.documentTypeOperations.some(documentTypeOperation => {
              return documentTypeOperation.documentTypeId === this.document.documentTypeId;
            });
          });
          this.document.operations = operations;
        }
        if (this.initialDocument && this.initialDocument.attachments) {
          let attachments = this.initialDocument.attachments.slice();
          attachments = attachments.filter(initialAttachment => {
            const documentAttachment = this.documentAttachments.find(attachment => {
              return initialAttachment.id === attachment.id;
            });
            if (!documentAttachment) return false;
            return documentAttachment.documentTypeAttachments.some(documentTypeAttachment => {
              return documentTypeAttachment.documentTypeId === this.document.documentTypeId;
            });
          });
          this.document.attachments = attachments;
        }
      },
      deep: true,
    },
  },
});

</script>
