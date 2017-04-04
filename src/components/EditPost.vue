<template>
  <div class="post-edit">
    <div class="post-form">
      <div class="post-text">
        <div class="post-title" :class="{hasInput: hasInput}">
          <input
            v-model="post.title"
            @keyup="savePost"
            type="text"
            id="post-title"
            name="post-title"
          >
          <label for="">Post title and URL</label>
        </div>
        <div class="post-markdown">
          <textarea
            id="markdown-editor"
            name="markdown-editor"
            v-model="post.markdown"
            ref="markdownEditor"
            @keyup="savePost"
            @scroll="trackScrollposition"
          ></textarea>
        </div>
      </div>
      <div class="post-images">
        <image-selector :post="post"></image-selector>
      </div>
      <div class="post-stats">
        <span v-if="state === states.LOADING" class="post-status-loading">loading...<span v-if="!connected"> (offline)</span></span>
        <span v-if="state === states.EDITING" class="post-status-editing">write that shit</span>
        <span v-if="state === states.SAVED" class="post-status-saved">save</span>
        <span v-if="state === states.PUBLISHED" class="post-status-published">published</span>
        <span v-if="state === states.EDITING_OFFLINE" class="post-status-editing-offline">editing (offline)</span>
        <span v-if="state === states.SAVED_OFFLINE" class="post-status-saved-offline">save (offline)</span>
        <span v-if="error" class="post-status-error">{{error}}<span v-if="!connected"> (offline)</span></span>
        <button class="publish-button" @click="publishPost" :disabled="state !== states.SAVED">Publish</button>
      </div>
    </div>
    <div class="post-preview">
      <article id="post-preview" ref="previewArticle">
        <div class="container" v-html="compiledContent"></div>
      </article>
    </div>
  </div>
</template>

<script>
  import marked from 'marked';
  import debounce from 'debounce';
  import Post from '@/models/Post';
  import {database} from '@/config/firebase';
  import superagent from 'superagent';
  import router from '@/config/router';
  import ImageSelector from '@/components/ImageSelector';
  import bus from '@/config/bus';
  import PostMixin from '@/mixins/post-mixin';
  import {states} from '@/config/constants';

  export default {
    mixins: [PostMixin],

    data() {
      return {
        post: new Post(),
        error: null,
        cursorPosition: 0,
        postLoaded: false,
        states,
      };
    },

    computed: {
      connected() { return this.$store.state.connection.connected; },
      compiledContent() { return marked(this.post.markdown, {sanitize: true, gfm: true}); },
      canPublish() {
        return this.state == 2;
      },
      hasInput() {
        return this.post.title.length > 0;
      },
    },

    methods: {
      trackScrollposition(event) {
        const target = event.target;
        const article = this.$refs.previewArticle;
        const percent = target.scrollTop / (target.scrollHeight - target.clientHeight);
        this.$refs.previewArticle.scrollTop = (article.scrollHeight - article.clientHeight) * percent;
      },
      insertImage(url) {
        const image = `\n![alt text](${url} "some alt")\n`;
        const position = document.getElementById('markdown-editor').selectionStart || 0;
        this.post.markdown = [
          this.post.markdown.slice(0, position),
          image,
          this.post.markdown.slice(position),
        ].join('');
      },
      savePost(event) {
        this.trackScrollposition(event);
        this.post.lastEdited = Date.now();
        this.debouncedSave();
      },
      debouncedSave: debounce(function () {
        this.savePostImmediately();
      }, 1000),
      savePostImmediately() {
        this.post.set().then(() => {
          if (this.$route.fullPath == '/create') router.replace(`/edit/${this.post.id}`);
        });
      },
      getPost(id) {
        database
          .ref(`/posts/${id}`)
          .once('value', snapshot => {
            this.postLoaded = true;
            const post = snapshot.val();
            if (post) this.post = new Post(post);
          });
      },
      publishPost() {
        superagent
          .get(`/rebuild/${this.post.id}`)
          .end((err, res) => {
            if (err) this.error = err;
            this.post.lastPublished = Date.now();
            this.post.published = true;
            this.post.set();
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
      $route (to, from) {
        if (to.params.id) {
          this.getPost(to.params.id);
        } else {
          this.post = new Post();
        }
      }
    },

    components: {
      ImageSelector,
    }
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
    flex: 0 0 50%;
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
      padding-top: $golden-rem / 2;
      padding-bottom: $golden-rem / 2;
    }
  }

  .post-images {
    overflow: auto;
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

  .post-stats {
    position: relative;
    color: white;
    font-family: $sans-serif;

    > span {
      font-size: 0.85em;
      line-height: $golden-rem;
      display: block;
      padding: $golden-rem / 4 $golden-rem / 2;
      
      &.post-status-loading {
        background: grey;
      }
      &.post-status-editing {
        background: gold;
      }
      &.post-status-saved {
        background: seagreen;
      }
      &.post-status-published {
        background: royalblue;
      }
      &.post-status-error {
        background: crimson;
      }
      &.post-status-editing-offline {
        background: gold;
        opacity: 0.8;
      }
      &.post-status-saved-offline {
        background: seagreen;
        opacity: 0.8;
      }
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

  .publish-button {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: $golden-rem / 4 $golden-rem / 2;
    background: white;
    color: black;
    border: none;
    line-height: $golden-rem;
  }
</style>