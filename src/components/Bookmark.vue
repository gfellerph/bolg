<template>
  <div class="bookmark">
    <a v-if="bookmark" href="{{post.url}}">
      <h1 class="h4">{{post.title}}</h1>
      <p class="post-created"></p>
      <p></p>
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