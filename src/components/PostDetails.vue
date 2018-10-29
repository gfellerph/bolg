<template>
  <div class="post-details">
    <router-link class="edit-post-link" :to="editUrl">
      <div class="post-infos">
          <img
            class="post-details__title-image"
            :src="titleImageUrl"
            alt=""
          >
          <div class="post-text">
            <h1 class="h4" v-html="post.title"></h1>
            <p class="small">
              <post-status :post="post"></post-status>
              <span> &mdash; {{post.formattedPostDate}}</span></p>
            <p class="post-controls">
              <button class="small cancel" @click.prevent="deletePost(post._id)">Lösche</button>
              <button class="small" @click.prevent="publishPost(post._id)">Publiziere</button>
            </p>
          </div>
      </div>
    </router-link>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import dateformat from 'dateformat';
  import PostStatus from 'src/components/PostStatus';
  import { constructThumborUrl } from 'src/config/constants';

  export default {
    props: {
      post: Object,
    },

    computed: {
      editUrl() { return `/editpost/${this.post._id}` },
      titleImageUrl() {
        if (!this.post.titleImage) {
          return '//placehold.it/300x300?text=Keis_Titubiud';
        }
        return constructThumborUrl(this.post.titleImage.url, {
          width: 160,
          height: 160,
        })
      },
    },

    methods: {
      dateformat,
      deletePost() {
        /* eslint no-restricted-globals: 0 */
        /* eslint no-alert: 0 */
        if (confirm('wosch würk dä Post lösche?')) {
          this.postsDeleteOne(this.post._id);
        }
      },
      ...mapActions({
        publishPost: 'POSTS_PUBLISH',
        postsDeleteOne: 'POSTS_DELETE_ONE',
      }),
    },

    components: {
      PostStatus,
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/core/_index.scss';

  .post-details {
    position: relative;
  }

  h1 {
    margin-top: 0;
  }

  .post-infos {
    padding: $golden-rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .short-text,
  .meta-infos {
    flex: 0 1 auto;
  }

  .meta-infos {
    font-family: $sans-serif;
    font-size: 0.75em;
  }

  .post-text {
    flex-grow: 1;
    > *:last-child {
      margin-bottom: 0;
    }
  }

  .post-controls {
    display: flex;
    justify-content: flex-end;
  }

  .edit-post-link {
    color: black;
    text-decoration: none;
  }

  .post-details__title-image {
    max-width: 25%;
    margin: 0 2em 0 0;
    border-radius: 10px;
  }
</style>
