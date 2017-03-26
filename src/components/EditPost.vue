<template>
  <div class="post-edit">
    <div class="post-form">
      <p>
        <input v-model="post.title" @keyup="savePost" type="text">
      </p>
      <p>
        <input @change="savePost" type="file">
      </p>
      <p>
        <textarea v-model="post.markdown" @keyup="savePost" name="" id="" cols="30" rows="10"></textarea>
      </p>
      <p>
        <button @click="savePostImmediately" :disabled="saved">
          <span v-if="saved">Saved</span>
          <span v-if="!saved">Save</span>
        </button>
        <button @click="publishPost" :disabled="canPublish">Publish</button>
      </p>
      <div class="post-stats">
        <span v-if="status==0" class="post-status-loading">loading</span>
        <span v-if="status==1" class="post-status-editing">editing</span>
        <span v-if="status==2" class="post-status-saved">saved</span>
        <span v-if="status==3" class="post-status-published">published</span>
        <span v-if="status==4" class="post-status-error">{{error}}</span>
      </div>
    </div>
    <div class="post-preview">
      <article v-html="compiledContent"></article>
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

  export default {
    data() {
      return {
        post: new Post(),
        status: 0,
        error: '',
      };
    },

    computed: {
      compiledContent() { return marked(this.post.markdown, {sanitize: true}); },
      saved() {
        return this.post.lastEdited
          ? this.post.lastEdited < this.post.lastSaved
          : !this.post.lastEdited;
      },
      canPublish() {
        return this.post.lastPublished
          ? this.post.lastSaved < this.post.lastPublished
          : !this.post.lastSaved;
      }
    },

    methods: {
      savePost() {
        this.status = 1;
        this.post.lastEdited = Date.now();
        this.debouncedSave();
      },
      debouncedSave: debounce(function () {
        this.savePostImmediately();
      }, 1000),
      savePostImmediately() {
        this.post.set().then(() => {
          this.status = 2;
        });
      },
      getPost(id) {
        database
          .ref(`/posts/${id}`)
          .once('value', snapshot => {
            this.status = 2;
            const post = snapshot.val();
            if (post) this.post = new Post(post);
          });
      },
      publishPost() {
        superagent
          .get(`/rebuild/${this.post.id}`)
          .end((err, res) => {
            if (err) throw err;
            this.status = 3;
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

    watch: {
      $route (to, from) {
        console.log('route change');
        if (to.params.id) {
          this.getPost(to.params.id);
        } else {
          this.post = new Post();
        }
      }
    }
  };
</script>


<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .post-edit {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
  }

  .post-markdown-editor {
    height: 300px;
    width: 100%;
  }

  .post-form {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 50%;
      right: -1px;
      width: 3px;
      height: 100%;
      background: black;
      transform: translateY(-50%);
    }
  }

  .post-form,
  .post-preview {
    flex: 0 0 50%;
  }

  .post-stats {
    position: absolute;
    right: 0;
    bottom: 0;
    color: white;
    font-size: 0.85em;

    span {
      display: block;
      padding: $golden-em / 4 $golden-em / 2;
      
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
</style>