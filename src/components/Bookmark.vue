<template>
  <ul class="posts">
    <li class="post" v-if="post">
      <a :href="postUrl">
        <div class="post__badge">witerläse</div>
        <img v-if="post.heroImageUrl" class="post__title-image" :src="post.heroImageUrl" :alt="`Titelbild für ${post.title}`">
        <div class="post__overlay">
          <h2 class="post__title h4">{{post.title}}</h2>
          <p class="post__published">{{post.created}}</p>
          <div v-html="post.description"></div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script>
  import Post from '@/models/Post';
  import { database } from '@/config/firebase';

  export default {
    data() {
      return {
        bookmark: false,
        post: null,
      };
    },

    created() {
      if (!window.localStorage) return;

      const bookmark = JSON.parse(window.localStorage.getItem('bookmark'));
      
      if (!bookmark) return;
      const postRef = database.ref(`/published/${bookmark.postId}`);
      postRef.on('value', (snapshot) => {
        if (!snapshot.val()) return;
        this.post = new Post(snapshot.val());
      });
    },

    computed: {
      postUrl() { return `${this.post.url}#bookmark`; }
    },
  };
</script>

<style lang="scss">
  .post__badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5rem 1rem;
    background: dodgerblue;
    color: white;
    transform-origin: top left;
    transform: rotate(90deg);

    &:before,
    &:after {
      content: '';
      position: absolute;
      left: 100%;
      height: 0;
      width: 0;
      display: block;
      border: 1px solid transparent;
      border-width: 11.25px;
      border-left-color: dodgerblue;
    }

    &:before {
      top: 0;
      border-top-color: dodgerblue;
    }

    &:after {
      bottom: 0;
      border-bottom-color: dodgerblue;
    }
  }
</style>