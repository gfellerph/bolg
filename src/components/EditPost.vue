<template>
  <div class="post-edit">
    <div class="post-form">
      <form action="">
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
        </p>
      </form>
    </div>
    <div class="post-preview" v-html="compiledContent"></div>
  </div>
</template>

<script>
  import marked from 'marked';
  import debounce from 'debounce';
  import Post from '@/models/Post';
  import {database} from '@/config/firebase';

  export default {
    data() {
      return {
        post: new Post(),
      };
    },

    computed: {
      compiledContent() { return marked(this.post.markdown, {sanitize: true}); },
      saved() { return this.post.lastEdited.getSeconds() < this.post.lastSaved.getSeconds(); }
    },

    methods: {
      savePost() {
        this.post.lastEdited = new Date();
        this.debouncedSave();
      },
      debouncedSave: debounce(function () {
        this.post.set();
      }, 1000),
      savePostImmediately() {
        this.post.set();
      }
    },

    created() {
      console.log('route id', this.$route.params.id);
      if (this.$route.params.id) {
        database
          .ref(`/posts/${this.$route.params.id}`)
          .on('value', snapshot => {
            this.post = new Post(snapshot.val());
          });
      }
    }
  };
</script>


<style lang="scss" scoped>
  .post-edit {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
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
      height: 80%;
      background: black;
      transform: translateY(-50%);
    }
  }

  .post-form,
  .post-preview {
    flex: 0 0 50%;
  }
</style>