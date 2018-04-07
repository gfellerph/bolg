<template>
  <div class="post-edit">
    <div v-if="post" class="post-form">
      <div class="post-text">
        <div class="post-markdown">
          <editor
            @input="writePost"
            @save="savePost"
            @help="toggleCheatsheet"
          ></editor>
        </div>
      </div>
      <div class="post-images">
        <image-selector
          :post="post"
        ></image-selector>
      </div>
      <div class="post-stats">
        <post-status :post="post"></post-status>
        <button class="notification-button" @click="sendNotification" :disabled="post.notificationSent || !connected || notificationPending">Notify</button>
        <button class="unpublish-button" @click="unpublishPost">Unpublish</button>
        <button class="publish-button" @click="publishPost">Publish</button>
      </div>
    </div>
    <div class="post-preview">
      <article id="post-preview" ref="previewArticle">
        <div class="container" v-html="compiledContent"></div>
      </article>
      <markdown-cheatsheet @closeCheatsheet="toggleCheatsheet" v-if="showCheatSheet"></markdown-cheatsheet>
    </div>
  </div>
</template>

<script>
  import { marked } from 'src/config/markdown';
  import Post from 'src/models/Post';
  import router from 'src/config/router';
  import ImageSelector from 'src/components/ImageSelector.vue';
  import Editor from 'src/components/Editor';
  import PostStatus from 'src/components/PostStatus';
  import MarkdownCheatsheet from 'src/components/MarkdownCheatsheet';
  import { mapState, mapActions } from 'vuex';

  export default {
    data() {
      return {
        cursorPosition: 0,
        postLoaded: false,
        showCheatSheet: false,
        notificationPending: false,
        error: false,
      };
    },

    computed: {
      compiledContent() {
        if (!this.post || !this.post.markdown) return '';
        return marked(this.post.markdown);
      },
      hasTitle() { return !!this.post.title; },
      errorMessage() {
        if (!this.post.title) { return 'This post has no title'; }
        return this.error ? this.error.message : false;
      },
      ...mapState({
        connected: state => state.connection.connected,
        post: state => state.post.post,
      }),
    },

    methods: {
      toggleCheatsheet() {
        this.showCheatSheet = !this.showCheatSheet;
      },
      sendNotification() {
      },
      ...mapActions({
        getPost: 'POST_GET',
        savePost: 'POST_PUT',
        createPost: 'POST_POST',
        writePost: 'POST_WRITE',
        publishPost: 'POST_PUBLISH',
        unpublishPost: 'POST_UNPUBLISH',
        sendNotification: 'POST_SENDNOTIFICATION',
      }),
    },

    created() {
      if (this.$route.params && this.$route.params.id) {
        this.getPost(this.$route.params.id);
      }
      if (this.$route.fullPath === '/createpost') {
        this.createPost()
          .then(() => {
            router.replace(`/editpost/${this.post._id}`);
            this.getPost(this.$route.params.id);
          });
      }
    },

    beforeDestroy() {
      this.$store.commit('POST_DESTROY');
    },

    watch: {
      $route(to) {
        if (to.params.id) {
          this.getPost(to.params.id);
        } else {
          this.post = new Post();
        }
      },
    },

    components: {
      ImageSelector,
      Editor,
      PostStatus,
      MarkdownCheatsheet,
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/core/_index';

  .post-edit {
    flex-grow: 1;
    display: flex;
  }
  .post-form,
  .post-preview {
    flex: 1 1 50%;
  }

  .post-form {
    display: flex;
    flex-direction: column;
  }

  .post-text {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;

    > p {
      flex: 0 0 auto;
      margin-right: 0;
      margin-left: 0;
    }

    .post-markdown {
      flex: 1 0 auto;
      display: flex;
    }
  }

  .post-images {
    overflow: auto;
    max-width: 50vw;
  }

  .post-preview {
    position: relative;
    border-left: 1px solid black;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 0;
      box-shadow: 0 0 20px white;
    }

    > article {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: auto;
      transform: translate3d(0,0,0);
    }
  }

  .errors {
    background: red;
    color: white;
    font-family: $sans-serif;
    padding: $golden-rem / 4 $golden-rem / 2;
    font-size: 0.65em;

    p {
      margin: 0.25em 0;

      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .post-stats {
    display: flex;
    position: relative;
    border-top: 1px solid black;

    .post-status {
      flex: 1 0 auto;
    }
  }

  .post-title {
    position: relative;

    input {
      font-family: $sans-serif;
      font-weight: bold;
    }

    label {
      position: absolute;
      top: 50%;
      left: $golden-rem / 2;
      margin: 0;
      transform: translate3d(0, -50%, 0);
      transition: transform 0.2s;
      opacity: 0.5;
      font-family: $sans-serif;
    }

    input:focus ~ label,
    &.hasInput label {
      font-size: 11px;
      transform: translate3d(0, -28px, 0);
    }
  }

  .publish-button,
  .notification-button,
  .unpublish-button {
    padding: $golden-rem / 4 $golden-rem / 2;
    background: white;
    color: black;
    border: none;
    border-left: 1px solid black;
    line-height: $golden-rem;
    margin: 0;
  }

  .markdown-cheatsheet {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
