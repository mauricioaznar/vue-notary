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

    <div id="comment-list" class="overflow-y-auto" style="max-height: 400px">
      <v-list two-line>

        <template v-for="(item, index) in comments">
          <v-list-item :key="item.id">
            <v-list-item-content>
              <v-list-item-title
                  class="text--primary"
                  v-text="item.user ? item.user.fullname : 'no-user'"
              ></v-list-item-title>
              <v-list-item-subtitle v-text="item.comment"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action
                class="d-flex flex-column align-center"
            >
              <v-row
                  class="my-1"
              >
                <v-col cols="auto">
                  <v-btn
                      icon
                      rounded
                      elevation="6"
                      small
                      @click="deleteComment(item.id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                      icon
                      rounded
                      elevation="6"
                      small
                      @click="patchComment(item.id)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-list-item-action-text v-text="item.createdAt"></v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>

          <v-divider
              v-if="index < comments.length - 1"
              :key="index"
          ></v-divider>
        </template>
      </v-list>
    </div>
    <dialog-layout
        title="New comment"
        v-model="commentDialog"
        show-close
        @submit="submit"
    >
      <vee-text-field
          v-if="commentDialog"
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
      comments: [],
      commentDialog: false,
      error: {}
    }
  },
  props: {
    documentId: {
      required: true,
      type: [Number, String],
      validator: function (val) {
        return Number(val) > 0
      }
    },
    isVisible: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch: async function () {
      try {
        const response = await NOTARY.get(`documents/documentComments/${this.documentId}`)
        this.comments = response.data
      } catch (e) {
        this.error = e
      }
    },
    submit: async function (isValid) {
      if (isValid) {
        try {
          const data = {
            comment: this.comment,
            documentId: Number(this.documentId),
          }
          await NOTARY.post(`documents/documentComments/${this.documentId}`, data)
          await this.fetch()
          this.commentDialog = false
        } catch (e) {
          this.error = e
        }
      }
    },
    deleteComment: async function (documentCommentId) {
      try {
        await NOTARY.delete(`documents/documentComments/${this.documentId}/${documentCommentId}`)
      } catch (e) {
        this.error = e
      }
    },
    patchComment: async function (documentCommentId) {
      try {
        const data = {
          comment: this.comment,
          documentId: Number(this.documentId),
        }
        await NOTARY.patch(`documents/documentComments/${this.documentId}/${documentCommentId}`, data)
      } catch (e) {
        this.error = e
      }
    },
    scrollToBottom: function () {
      const commentListElement = document.getElementById('comment-list')
      if (commentListElement) {
        commentListElement.scrollTop = commentListElement.scrollHeight;
      }
    }
  },
  updated() {
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  watch: {
    isVisible: function () {
      this.scrollToBottom()
    }
  }
}
</script>

<style scoped>

</style>