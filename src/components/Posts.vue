<template>
  <div class="posts">
    <div class="post-list-container">
      <input
        type="text"
        v-model="search"
        placeholder="Gschicht sueche"
      >
      <span class="displayed-posts">{{displayedPosts}}</span>
      <ul class="post-list">
        <li
          v-bind:key="post.id"
          v-for="post in filteredPosts"
          @mouseenter="changeCurrentPost(post)"
        >
          <post-details :post="post" />
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
  import Post from 'src/models/Post';
  import PostDetails from 'src/components/PostDetails';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        search: '',
        currentPost: null,
        Post,
      };
    },

    created() {
      this.$store.dispatch('GETPOSTS');
    },

    computed: {
      filteredPosts() {
        const filterString = this.search.toLowerCase();
        return this.posts.filter((post) => {
          const searchString = post.title.toLowerCase();
          return searchString.includes(filterString)
        });
      },
      displayedPosts() {
        return `${this.filteredPosts.length}/${this.posts.length}`;
      },
      editURL() { return this.currentPost ? `#edit-post/${this.currentPost.id}` : ''; },
      ...mapState({
        posts: state => state.posts.posts,
      }),
    },

    methods: {
      changeCurrentPost(post) {
        if (post.lastPublished) {
          this.currentPost = post;
        } else {
          this.currentPost = null;
        }
      },
    },

    components: {
      PostDetails,
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/core/_index';

  .displayed-posts {
    font-size: 0.85em;
    color: grey;
    position: absolute;
    right: 1rem;
    top: 1rem;
  }

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

    @include max($xs) {
      display: none;
    }
  }

  .posts {
    position: relative;
    display: flex;
    width: 100%;
    height: 100vh;
    margin: 0;
  }

  .post-list-container {
    position: relative;
    flex: 1 0 50%;
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
