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
          <v-list-item :key="item.id" :class="userId === item.userId ? 'grey darken-3' : undefined">
            <v-list-item-content>
              <v-list-item-title
                  :class="userId === item.userId ? 'yellow--text' : undefined"
              >
                {{item.user ? item.user.fullname : 'no-user'}}
              </v-list-item-title>
              <v-list-item-subtitle v-text="item.comment"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action
                class="d-flex flex-column justify-center align-center"
                style="height: 60px"
            >
              <v-row align-content="center">
                <v-col v-show="userId === item.user.id">
                  <v-btn
                      icon
                      rounded
                      elevation="6"
                      small
                      @click="deleteComment(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-col v-show="userId === item.user.id">
                  <v-btn
                      icon
                      rounded
                      elevation="6"
                      small
                      @click="patchCommentClick(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-list-item-action-text class="align-self-end" v-text="item.createdAt"></v-list-item-action-text>
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
        title="Comment form"
        v-model="commentDialog"
        show-close
        @submit="submit"
        @cancel="reset"
    >
      <vee-text-field
          v-if="commentDialog"
          name="comment"
          rules="required"
          v-model="comment"
          no-label
      />

    </dialog-layout>
    <confirm-dialog
      v-model="confirmDeleteDialog"
      title="comment"
      @confirm="confirmDelete"
      @cancel="reset"
    >

    </confirm-dialog>
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
import {mapState} from "vuex";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

export default {
  name: 'DocumentComments',
  components: {ConfirmDialog, ErrorToaster, VeeTextField, DialogLayout},
  data() {
    return {
      comment: "",
      comments: [],
      commentDialog: false,
      confirmDeleteDialog: false,
      selectedCommentDelete: null,
      selectedCommentPatch: null,
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
  computed: {
    ...mapState('auth', ['userId'])
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
    submit: function (isValid) {
      if (this.selectedCommentPatch && this.selectedCommentPatch.id) {
        this.patchComment(isValid)
      } else {
        this.postComment(isValid)
      }
    },
    postComment: async function (isValid) {
      if (isValid) {
        try {
          const data = {
            comment: this.comment,
            documentId: Number(this.documentId),
          }
          await NOTARY.post(`documents/documentComments/${this.documentId}`, data)
          await this.fetch()
          this.reset()
        } catch (e) {
          this.error = e
        }
      }
    },
    deleteComment: async function (documentComment) {
      this.selectedCommentDelete = documentComment
      this.confirmDeleteDialog = true
    },
    confirmDelete: async function () {
      if (this.selectedCommentDelete) {
        try {
          await NOTARY.delete(`documents/documentComments/${this.documentId}/${this.selectedCommentDelete.id}`)
          await this.fetch()
          this.reset()
        } catch (e) {
          this.error = e
        }
      }
    },
    patchCommentClick: async function (documentComment) {
      this.selectedCommentPatch = documentComment
      this.commentDialog = true
      this.comment = documentComment.comment
    },
    patchComment: async function (isValid) {
      if (this.selectedCommentPatch && isValid) {
        const documentCommentId = this.selectedCommentPatch.id
        try {
          const data = {
            comment: this.comment,
            documentId: Number(this.documentId)
          }
          await NOTARY.patch(`documents/documentComments/${this.documentId}/${documentCommentId}`, data)
          await this.fetch()
          this.reset()
        } catch (e) {
          this.error = e
        }
      }
    },
    scrollToBottom: function () {
      const commentListElement = document.getElementById('comment-list')
      if (commentListElement) {
        commentListElement.scrollTop = commentListElement.scrollHeight;
      }
    },
    reset: function () {
      this.comment = ''
      this.selectedCommentPatch = null
      this.selectedCommentDelete = null
      this.confirmDeleteDialog = false
      this.commentDialog = false
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