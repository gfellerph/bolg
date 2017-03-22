<template>
  <div class="posts">
    <div class="post-list">
      <ul>
        <li v-for="post in posts">
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
      editURL() { return `#edit-post/${this.currentPost.id}`; },
      posts() { return this.firebasePosts.map(post => new Post(post)); }
    },

    components: {
      PostDetails,
    }
  };
</script>

<style>

</style>