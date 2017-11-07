<template>
  <div class="posts">
    <div class="post-list-container">
      <ul class="post-list">
        <li v-bind:key="post.id" v-for="post in reversedPosts" @mouseenter="changeCurrentPost(post)">
          <post-details :post="new Post(post)" />
        </li>
      </ul>
    </div>
    <div class="post-preview">
      <iframe v-if="currentPost" class="post-preview-frame" :src="currentPost.liveUrl" frameborder="0"></iframe>
      <p v-if="!currentPost" class="posts__blank-slate">Post no nid publiziert</p>
    </div>
  </div>
</template>

<script>
  import Post from '@/models/PostAdmin';
  import Story from '@/models/StoryAdmin';
  import PostDetails from '@/components/PostDetails';
  import { database } from '@/config/firebase';

  export default {
    data() {
      return {
        currentPost: null,
        posts: [],
        Post,
        Story,
      };
    },

    created() {
      this.$bindAsArray('posts', database.ref('/posts').orderByChild('created'));
    },

    computed: {
      editURL() { return this.currentPost ? `#edit-post/${this.currentPost.id}` : ''; },
      reversedPosts() { return this.posts.reverse(); }
    },

    methods: {
      changeCurrentPost(post) {
        if (post.lastPublished) {
          this.currentPost = new Post(post);
        } else {
          this.currentPost = null;
        }
      },
    },

    components: {
      PostDetails,
    }
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .post-preview-frame {
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 100%;
  }

  .post-preview {
    width: 100%;
  }

  .posts {
    position: relative;
    display: flex;
    width: 100%;
    height: calc(100vh - 80px);
    margin: 0;
  }

  .post-list-container {
    flex: 0 0 50%;
    border-right: 1px solid black;
    overflow: auto;
    height: 100%;
  }

  .post-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 0;
      border-top: none;
      border-bottom: 1px solid black;
    }
  }

  .posts__blank-slate {
    font-style: italic;
    color: rgba(black, 0.3);
    text-align: center;
    margin: 2em;
    font-size: 2em;
  }
</style>