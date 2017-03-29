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
        <!--<p>
        </p>-->
      </div>
      <div class="post-images">
        <image-selector></image-selector>
      </div>
      <div class="post-stats">
        <span v-if="!postLoaded" class="post-status-loading">loading...<span v-if="!connected"> (offline)</span></span>
        <span v-if="!saved && !published" class="post-status-editing">write that shit<span v-if="!connected"> (offline)</span></span>
        <span v-if="saved && !published" class="post-status-saved">save<span v-if="!connected"> (offline)</span></span>
        <span v-if="published" class="post-status-published">published<span v-if="!connected"> (offline)</span></span>
        <span v-if="error" class="post-status-error">{{error}}<span v-if="!connected"> (offline)</span></span>
        <button class="publish-button" @click="publishPost" :disabled="!canPublish">Publish</button>
      </div>
    </div>
    <div class="post-preview">
      <article id="post-preview" ref="previewArticle" v-html="compiledContent"></article>
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

  export default {
    data() {
      return {
        post: new Post(),
        error: null,
        cursorPosition: 0,
        postLoaded: false,
      };
    },

    computed: {
      connected() { return this.$store.state.connection.connected; },
      compiledContent() { return marked(this.post.markdown, {sanitize: true}); },
      saved() {
        let test = true;

        // Online
        if (!this.connected) test = false;

        // lastEdited later than lastSaved
        if (this.post.lastSaved && this.post.lastEdited > this.post.lastSaved) test = false;

        return test;
      },
      canPublish() {
        let test = true;
        // Online
        if (!this.connected) test = false;
        // Save earlier than last publish
        if (this.post.lastPublished && this.post.lastSaved >= this.post.lastPublished) test = false;
        // lastEdit later than lastSave
        if (this.post.lastEdited > this.post.lastSaved) test = false;

        return test;
      },
      published() {
        let test = true;
        if (!this.connected && this.post.lastEdited > this.post.lastPublished) test = false;
        if (this.canPublish) test = false;
        return test;
      },
      hasInput() {
        return this.post.title.length > 0;
      }
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
          });
      }
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
    }
  }

  .post-images {
    flex: 0 0 16vh;
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