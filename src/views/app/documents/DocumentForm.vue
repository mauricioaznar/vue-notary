<template>
  <v-container class="fill-height d-flex flex-column justify-start px-0 px-md-6">
    <loader-simple v-if="loading"/>
    <horizontal-stepper-layout
        v-if="!loading"
        :steps="steps"
        @submit="save"
        @change="changeCurrentStep"
        :disabled="saving || !this.isEditable"
        :is-sequential="!editMode"
        title="Stepper form"
    >
      <template slot="step-1">
        <vee-date
            name="Date"
            rules="required"
            v-model="document.date"
            :disabled="!isEditable"
        />
        <vee-text-field
            rules="required"
            name="File number"
            v-model="document.fileNumber"
            :disabled="!isEditable"
        />
        <vee-text-field
            name="Folio"
            :rules="{
              required: true,
              min_value: 1,
              max_value: 400
            }"
            v-model="document.folio"
            type="number"
            :disabled="!isEditable"
        />
        <vee-text-field
            name="Tome"
            :rules="{
              required: true,
              regex: /^[0-9]+([-][0-9]+)?$/
            }"
            v-model="document.tome"
            hint="Formatos validos: 12-12 o 12"
            :disabled="!isEditable"
        />
        <vee-autocomplete
            name="Document type"
            :items="documentTypes"
            v-model="document.documentTypeId"
            item-text="name"
            item-value="id"
            rules="required"
            :disabled="!isEditable"
        />
        <vee-autocomplete
            name="Document status"
            :items="documentStatuses"
            v-model="document.documentStatusId"
            item-text="name"
            item-value="id"
            rules="required"
            :disabled="!isEditable"
        />
      </template>
      <template slot="step-2">
        <vee-autocomplete
            name="Client"
            :items="clients"
            v-model="document.clientId"
            item-text="name"
            item-value="id"
            rules="required"
            :disabled="!isEditable"
        />
        <vee-autocomplete
            name="Operations"
            :items="filteredOperations"
            v-model="document.operations"
            multiple
            item-text="name"
            item-value="id"
            return-object
            :disabled="!isEditable"
        >
        </vee-autocomplete>
        <vee-autocomplete
            name="Grantors"
            :items="grantors"
            v-model="document.grantors"
            multiple
            item-text="fullname"
            item-value="id"
            return-object
            :disabled="!isEditable"
        >
        </vee-autocomplete>
        <vee-autocomplete
            name="Groups"
            :items="groups"
            v-model="document.groups"
            multiple
            item-text="name"
            item-value="id"
            return-object
            :disabled="!isEditable"
        >
        </vee-autocomplete>
        <vee-date
            name="Public registry entry date"
            rules="required"
            v-model="document.publicRegistryEntryDate"
            :disabled="!isEditable"
        />
        <vee-date
            name="Public registry exit date"
            rules="required"
            v-model="document.publicRegistryExitDate"
            :disabled="!isEditable"
        />
      </template>
      <template slot="step-3">
        <vee-autocomplete
            name="Document attachments"
            :items="filteredAttachments"
            v-model="document.attachments"
            multiple
            item-text="name"
            item-value="id"
            return-object
            :disabled="!isEditable"
        >
        </vee-autocomplete>
        <vee-autocomplete
            name="Money laundering"
            :items="tripleBooleanOptions"
            v-model="document.moneyLaundering"
            item-text="text"
            item-value="value"
            @input="(val) => {
              if (val === -1) {
                document.moneyLaunderingExpirationDate = null
              } else {
                if (document.moneyLaunderingExpirationDate === null && initialDocument.moneyLaunderingExpirationDate) {
                  document.moneyLaunderingExpirationDate = initialDocument.moneyLaunderingExpirationDate
                }
              }
            }"
            :disabled="!isEditable"
        >
        </vee-autocomplete>
        <vee-date
            v-show="document.moneyLaundering !== -1"
            name="Money laundering date"
            :rules="{
               required: document.moneyLaundering !== -1
            }"
            clearable
            v-model="document.moneyLaunderingExpirationDate"
            :disabled="!isEditable"
        />
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Document attachment
              </th>
              <th class="text-left">
                Status
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="documentAttachment in document.documentAttachments"
                :key="documentAttachment.attachmentId"
            >
              <td>{{ findAttachment(documentAttachment.attachmentId) }}</td>
              <td>
                <vee-checkbox
                  v-model="documentAttachment.attachmentStatus"
                  :disabled="!isEditable"
                />
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <vee-autocomplete
            name="Entry users"
            :items="users"
            v-model="document.entryUsers"
            multiple
            item-text="fullname"
            item-value="id"
            return-object
            :disabled="!isEditable"
        >
        </vee-autocomplete>
        <vee-autocomplete
            name="Closure users"
            :items="users"
            v-model="document.closureUsers"
            multiple
            item-text="fullname"
            item-value="id"
            return-object
            :disabled="!isEditable"
        >
        </vee-autocomplete>
      </template>
      <template slot="step-4">
        <document-comments
            v-if="editMode"
            :is-visible="currentStep === 4"
            :document-id="id"
        >

        </document-comments>
      </template>
    </horizontal-stepper-layout>
    <ErrorToaster
        v-model="fetchError"
        @relogin="customFetch"
    />
    <ErrorToaster
        v-model="saveError"
        @relogin="() => { save(true) }"
    />
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue';
import VeeTextField from '@/components/forms/VeeTextField.vue';
import {NOTARY} from '@/api/NOTARY'
import {Documents} from '@/models/Documents'
import ErrorToaster from '@/views/app/ErrorToaster.vue'
import VeeDate from '@/components/forms/VeeDate.vue'
import VeeAutocomplete from '@/components/forms/VeeAutocomplete.vue'
import {mapState} from 'vuex'
import VeeCheckbox from '@/components/forms/VeeCheckbox.vue'
import LoaderSimple from '@/components/loaders/LoaderSimple.vue'
import HorizontalStepperLayout from "@/components/forms/HorizontalStepperLayout.vue";
import DocumentComments from "@/views/app/documents/DocumentComments.vue";

export default Vue.extend({
  components: {
    HorizontalStepperLayout,
    LoaderSimple,
    VeeCheckbox,
    VeeDate,
    VeeAutocomplete,
    ErrorToaster,
    VeeTextField,
    DocumentComments
  },
  data () {
    return {
      document: {
        folio: '',
        date: '',
        documentTypeOther: '',
        fileNumber: '',
        tome: '',
        moneyLaundering: -1,
        moneyLaunderingExpirationDate: '',
        documentStatusId: '',
        clientId: '',
        documentTypeId: '',
        operations: [],
        grantors: [],
        groups: [],
        attachments: [],
        electronicFolio: '',
        documentAttachments: [],
        marginalNotes: '',
        personalities: -1,
        documentRegistry: -1,
        publicRegistryPatent: -1,
        identifications: -1,
        publicRegistryExitDate: '',
        publicRegistryEntryDate: '',
        entryUsers: [],
        closureUsers: [],
        property: '',
        documentProperties: [],
        documentComments: []
      },
      comment: '',
      initialDocument: null as Documents | null,
      tripleBooleanOptions: [
        { value: 1, text: 'Complete' },
        { value: 0, text: 'Incomplete' },
        { value: -1, text: 'Doesnt apply' }
      ],
      fetchError: {},
      saveError: {},
      loading: false,
      saving: false,
      currentStep: 1
    }
  },
  props: {
    id: {
      type: String
    }
  },
  created () {
    this.customFetch()
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
      'users'
    ]),
    editMode: function () {
      return !!this.id
    },
    steps: function () {
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
      ]
      if(this.editMode) {
        steps.push({
          title: 'Comments',
          optional: true
        })
      }
      return steps
    },
    filteredOperations: function () {
      return this.documentOperations.filter(operation => {
        return operation.documentTypeOperations.some(documentTypeOperation => {
          return documentTypeOperation.documentTypeId === this.document.documentTypeId
        })
      })
    },
    filteredAttachments: function () {
      return this.documentAttachments.filter(attachment => {
        return attachment.documentTypeAttachments.some(documentTypeAttachment => {
          return documentTypeAttachment.documentTypeId === this.document.documentTypeId
        })
      })
    },
    isEditable: function () {
      if (this.initialDocument === null) {
        return true
      } else {
        return this.initialDocument.editable
      }
    }
  },
  methods: {
    customFetch: async function () {
      if (this.id) {
        try {
          this.loading = true
          const result = await NOTARY.get(`documents/${this.id}`)
          const document = result.data as Documents
          this.initialDocument = result.data as Documents
          this.document.folio = document.folio
          this.document.fileNumber = document.fileNumber
          this.document.tome = document.tome
          this.document.date = document.date
          this.document.moneyLaundering = document.moneyLaundering
          this.document.moneyLaunderingExpirationDate = document.moneyLaunderingExpirationDate
          this.document.documentStatusId = document.documentStatusId
          this.document.documentTypeId = document.documentTypeId
          this.document.documentTypeOther = document.documentTypeOther
          this.document.clientId = document.clientId
          this.document.operations = document.operations
          this.document.groups = document.groups
          this.document.grantors = document.grantors
          this.document.property = document.property
          this.document.marginalNotes = document.marginalNotes
          this.document.personalities = document.personalities
          this.document.identifications = document.identifications
          this.document.publicRegistryPatent = document.publicRegistryPatent
          this.document.documentRegistry = document.documentRegistry
          this.document.publicRegistryEntryDate = document.publicRegistryEntryDate
          this.document.publicRegistryExitDate = document.publicRegistryExitDate
          this.document.attachments = document.attachments
          this.document.documentAttachments = document.documentAttachments
          this.document.electronicFolio = document.electronicFolio
          this.document.entryUsers = document.entryUsers
          this.document.closureUsers = document.closureUsers
          this.document.documentProperties = document.documentProperties
        } catch (e) {
          this.fetchError = e
        }
      }
      this.loading = false
    },
    save: async function (isValid) {
      if (isValid) {
        this.saving = true
        const documentData = {
          ...this.document,
        }
        try {
          this.disabled = true
          if (this.id) {
            await NOTARY.patch(`documents/${this.id}`, documentData)
          } else {
            await NOTARY.post(`documents`, documentData)
          }
          this.$router.push({
            name: 'Documents'
          })
        } catch (e) {
          this.saveError = e
        }
        this.saving = false
      }
    },
    findAttachment: function (attachmentId) {
      return this.documentAttachments.find(attachment => attachment.id === attachmentId)?.name
    },
    addDocumentProperty: function () {
      this.document.documentProperties.push({
        property: '',
        electronicFolio: ''
      })
    },
    removeDocumentProperty: function (index) {
      this.document.documentProperties
          .splice(index, 1)
    },
    changeCurrentStep: function (val) {
      this.currentStep = val
    }
  },
  watch: {
    currentStep: function () {
      console.log(this.currentStep)
    },
    'document.attachments': {
      handler: function (attachments) {
        const documentAttachments = []
        attachments.forEach(attachment => {
          const prevDocumentAttachment = this.document.documentAttachments
              .find(documentAttachment => {
                return documentAttachment.attachmentId === attachment.id
              })
          if (prevDocumentAttachment) {
            documentAttachments.push(prevDocumentAttachment)
          } else {
            documentAttachments.push({
              attachmentId: attachment.id,
              attachmentStatus: 0
            })
          }
        })
        this.document.documentAttachments = documentAttachments
      },
      deep: true
    },
    'document.documentTypeId': {
      handler: function () {
        if (this.initialDocument && this.initialDocument.operations) {
          let operations = this.initialDocument.operations.slice()
          operations = operations.filter(initialOperation => {
            const documentOperation = this.documentOperations.find(operation => {
              return initialOperation.id === operation.id
            })
            if (!documentOperation) return false
            return documentOperation.documentTypeOperations.some(documentTypeOperation => {
              return documentTypeOperation.documentTypeId === this.document.documentTypeId
            })
          })
          this.document.operations = operations
        }
        if (this.initialDocument && this.initialDocument.attachments) {
          let attachments = this.initialDocument.attachments.slice()
          attachments = attachments.filter(initialAttachment => {
            const documentAttachment = this.documentAttachments.find(attachment => {
              return initialAttachment.id === attachment.id
            })
            if (!documentAttachment) return false
            return documentAttachment.documentTypeAttachments.some(documentTypeAttachment => {
              return documentTypeAttachment.documentTypeId === this.document.documentTypeId
            })
          })
          this.document.attachments = attachments
        }
      },
      deep: true
    }
  }
})

</script>
