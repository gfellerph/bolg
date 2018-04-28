<template>
  <div class="post-details">
    <router-link class="edit-post-link" :to="editUrl">
      <div class="post-infos">
          <img
            class="post-details__title-image"
            :src="titleImageUrl"
            alt=""
          >
          <h1 class="h4">{{post.title}}</h1>
          <table class="meta-infos">
            <tr>
              <th>Gmacht:</th>
              <td>{{dateformat(post.created, 'dd.mm.yy')}}</td>
            </tr>
            <tr>
              <th>Zletscht gschribe:</th>
              <td>{{dateformat(post.lastEdited, 'dd.mm.yy')}}</td>
            </tr>
          </table>
      </div>
    </router-link>
    <div class="post-controls">
      <post-status :post="post"></post-status>
      <button class="edit-button" @click="deletePost(post._id)">Lösche</button>
      <button class="edit-button" @click="publishPost(post._id)">Publiziere</button>
    </div>
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
        return constructThumborUrl(this.post.titleImage.url, {
          width: 640,
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
    color: white;
  }

  .short-text,
  .meta-infos {
    flex: 0 1 auto;
  }

  .meta-infos {
    font-family: $sans-serif;
    font-size: 0.75em;

    th {
      font-weight: normal;
    }
  }

  .post-controls {
    display: flex;
    border-top: 1px solid black;

    .post-status {
      flex: 1 0 auto;
    }
  }

  .edit-post-link {
    color: black;
    text-decoration: none;
  }

  .post-details__title-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.5);
    z-index: -1;
  }

  .edit-button {
    padding: $golden-rem / 4 $golden-rem / 2;
    background: white;
    color: black;
    border: none;
    border-left: 1px solid black;
    line-height: $golden-rem;
    margin: 0;
  }
</style>
