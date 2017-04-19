<template>
  <div class="posts">
    <div class="post-list-container">
      <ul class="post-list">
        <li v-for="post in posts" @click="changeCurrentPost(post)" @mouseenter="changeCurrentPost(post)">
          <post-details :post="new Post(post)" />
        </li>
      </ul>
    </div>
    <div class="post-preview" v-if="currentPost">
      <iframe class="post-preview-frame" :src="currenPost.URL" frameborder="0"></iframe>
      <a :href="editURL" class="button cta">Edit post</a>
    </div>
  </div>
</template>

<script>
  import Post from '@/models/Post';
  import PostDetails from '@/components/PostDetails';
  import {database} from '@/config/firebase';

  export default {
    data() {
      return {
        currentPost: null,
        posts: [],
        Post,
      };
    },

    /*firebase: {
      posts: database.ref('/posts'),
    },*/

    created() {
      this.$bindAsArray('posts', database.ref('/posts'));
    },

    computed: {
      editURL() { return this.currentPost ? `#edit-post/${this.currentPost.id}` : ''; },
    },

    methods: {
      changeCurrentPost(post) {
        // this.currentPost = new Post(post);
      },
    },

    components: {
      PostDetails,
    }
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .posts {
    display: flex;
    width: 100%;
  }

  .post-list-container {
    flex: 0 0 50%;
    border-right: 1px solid black;
  }

  .post-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 0;

      & + li {
        border-top: none;
        border-bottom: 1px solid black;
      }
    }
  }
</style>