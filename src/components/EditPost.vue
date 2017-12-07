<template>
  <div class="post-edit">
    <div class="post-form">
      <div class="post-text">
        <div class="post-markdown">
          <editor
            v-model="post.markdown"
            @scroll="trackScrollposition"
            @input="savePost"
            @save="savePostImmediately"
            @help="toggleCheatsheet"
          ></editor>
        </div>
      </div>
      <div class="post-images">
        <image-selector :post="post"></image-selector>
      </div>
      <div class="post-stats">
        <post-status :post="post"></post-status>
        <button class="notification-button" @click="sendNotification" :disabled="post.notificationSent || !connected || notificationPending">Notify</button>
        <button class="unpublish-button" @click="unpublishPost" :disabled="state === states.LOADING || !post.lastPublished">Unpublish</button>
        <button class="publish-button" @click="publishPost" :disabled="state !== states.SAVED">Publish</button>
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
  import axios from 'axios';
  import debounce from 'debounce';
  import { marked } from 'src/config/markdown';
  import Post from 'src/models/Post';
  import { database } from 'src/config/firebase';
  import router from 'src/config/router';
  import ImageSelector from 'src/components/ImageSelector.vue';
  import bus from 'src/config/bus';
  import { states } from 'src/config/constants';
  import Editor from 'src/components/Editor';
  import PostStatus from 'src/components/PostStatus';
  import MarkdownCheatsheet from 'src/components/MarkdownCheatsheet';
  import PostController from 'src/controllers/post-controller';

  const postCtrl = PostController(database);

  export default {
    data() {
      return {
        post: new Post(),
        cursorPosition: 0,
        postLoaded: false,
        states,
        showCheatSheet: false,
        notificationPending: false,
      };
    },

    computed: {
      connected() { return this.$store.state.connection.connected; },
      compiledContent() {
        const images = this.post.images.reduce((acc, image) => {
          acc[image.id] = image.thumbnails;
          return acc;
        }, {});

        return marked(this.post.markdown, { images });
      },
      canPublish() { return this.state === states.SAVED; },
      hasTitle() { return !!this.post.title; },
      error() {
        if (!this.post.title) { return 'This post has no title'; }
        return false;
      },
    },

    methods: {
      trackScrollposition(percent) {
        const article = this.$refs.previewArticle;
        this.$refs.previewArticle.scrollTop = (article.scrollHeight - article.clientHeight) * percent;
      },
      insertImage(url) {
        const image = `\n![alt text](${url})\n`;
        const position = document.getElementById('markdown-editor').selectionStart || 0;
        this.post.markdown = [
          this.post.markdown.slice(0, position),
          image,
          this.post.markdown.slice(position),
        ].join('');
      },
      savePost(markdown) {
        this.post.markdown = markdown;
        this.post.lastEdited = Date.now();
        this.debouncedSave();
      },
      debouncedSave: debounce(() => {
        this.savePostImmediately();
      }, 1000),
      savePostImmediately() {
        postCtrl.set(this.post).then(() => {
          if (this.$route.fullPath === '/create') router.replace(`/edit/${this.post.id}`);
        });
      },
      getPost(id) {
        database
          .ref(`/posts/${id}`)
          .once('value', (snapshot) => {
            this.postLoaded = true;
            const post = snapshot.val();
            if (post) this.post = new Post(post);
          });
      },
      publishPost() {
        postCtrl.publish(this.post)
          .then(() => {
            this.error = false;
          })
          .catch((err) => {
            this.error = err.message;
          });
      },
      unpublishPost() {
        postCtrl.unpublish(this.post)
          .then(() => {
            this.error = false;
          })
          .catch((err) => {
            this.error = err.message;
          });
      },
      toggleCheatsheet() {
        this.showCheatSheet = !this.showCheatSheet;
      },
      sendNotification() {
        this.notificationPending = true;
        axios
          .get(`/notifysubscribers/${this.post.id}`)
          .then(() => {
            this.notificationPending = false;
            this.post.notificationSent = true;
            return postCtrl.set(this.post);
          })
          .catch((err) => {
            this.notificationPending = false;
            this.err = err.message;
          });
      },
    },

    created() {
      if (this.$route.params && this.$route.params.id) {
        this.getPost(this.$route.params.id);
      }
    },

    mounted() {
      bus.$on('insert-image', this.insertImage);
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
  @import 'src/styles/_variables';

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
    border-top: 1px solid black;
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
