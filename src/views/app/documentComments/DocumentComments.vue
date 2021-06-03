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
          @click="commentDialog = true"
      >
        <v-icon
        >
          mdi-plus
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-list two-line max-height="400" class="overflow-y-auto">
      <template v-for="(item, index) in comments">
        <v-list-item :key="item.id">
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
    <dialog-layout
      title="New comment"
      v-model="commentDialog"
      show-close
      @submit="submit"
    >
      <vee-text-field
        name="comment"
        rules="required"
        v-model="comment"
      />

    </dialog-layout>
    <error-toaster
      v-model="error"
    />
  </v-card>
</template>

<script>
import DialogLayout from "@/components/forms/DialogLayout";
import VeeTextField from "@/components/forms/VeeTextField";
import ErrorToaster from "@/views/app/ErrorToaster";
import {NOTARY} from "@/api/NOTARY";
export default {
  name: 'DocumentComments',
  components: {ErrorToaster, VeeTextField, DialogLayout},
  data() {
    return {
      selected: [],
      comment: "",
      commentDialog: false,
      error: {}
    }
  },
  props: {
    comments: {
      required: true,
      type: Array
    },
    documentId: {
      required: true,
      type: Number,
    }
  },
  created() {
    //
  },
  methods: {
    submit:async function (isValid) {
      if (isValid) {
        try {
          const data = {
            comment: this.comment,
            documentId: this.documentId,
          }
          await NOTARY.post('documents/documentComment', data)
        } catch (e){
          this.error = e
        }
      }
    }
  }
}
</script>

<style scoped>

</style>