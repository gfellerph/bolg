<template>
  <div class="posts">
    <div class="post-list-container">
      <ul class="post-list">
        <li v-for="post in posts" @click="changeCurrentPost(post)" @mouseenter="changeCurrentPost(post)">
          <post-details :post="post" />
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
      };
    },

    firebase: {
      firebasePosts: database.ref('/posts'),
    },

    computed: {
      editURL() { return this.currencPost ? `#edit-post/${this.currentPost.id}` : ''; },
      posts() { return this.firebasePosts.map(post => new Post(post)); }
    },

    methods: {
      changeCurrentPost(post) {
        this.currenPost = post;
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
      padding: $golden-em / 2;
      
      & + li {
        border-top: 1px solid black;
      }


    }
  }
</style>