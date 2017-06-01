<template>
  <div class="bookmark">
    <a v-if="bookmark" :href="post.postUrl">
      <h1 class="h4">{{post.postTitle}}</h1>
      <p class="post-created">{{post.created}}</p>
      <p v-html="post.description"></p>
    </a>
  </div>
</template>

<script>
  import Post from '@/models/Post';
  import { database } from '@/config/firebase';

  export default {
    data() {
      return {
        bookmark: false,
        post: new Post(),
      };
    },

    created() {
      if (!window.localStorage) return;

      const bookmark = window.localStorage.getItem('bookmark');
      
      if (!bookmark) return;

      const postRef = database.ref(`/published/${bookmark.postId}`);
      postRef.once('value', (snapshot) => {
        this.post = new Post(snapshot.val());
      });
    }
  };
</script>


<style lang="scss" scoped>
  
</style>