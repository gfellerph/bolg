<template>
  <div class="post-details">
    <router-link class="edit-post-link" :to="editUrl">
      <div class="post-infos">
          <h1 class="h4">{{post.title}}</h1>
          <table class="meta-infos">
            <tr>
              <th>Gmacht:</th>
              <td>{{formatDate(post.created)}}</td>
            </tr>
            <tr>
              <th>Zletscht gschribe:</th>
              <td>{{formatDate(post.lastEdited)}}</td>
            </tr>
          </table>
      </div>
    </router-link>
    <div class="post-controls">
      <post-status :post="post"></post-status>
      <button class="edit-button" @click="deletePost">Lösche</button>
      <button class="edit-button" @click="publishPost">Publiziere</button>
    </div>
  </div>
</template>

<script>
  import PostStatus from 'src/components/PostStatus';
  import { description } from 'src/config/markdown';
  import { database } from 'src/config/firebase';
  import PostController from 'src/controllers/post-controller';
  import { formatDate } from 'src/config/constants';

  const postCtrl = PostController(database);

  export default {
    props: {
      post: Object,
    },

    computed: {
      shortText() { return description(this.post.markdown); },
      editUrl() { return `/editpost/${this.post._id}` },
    },

    methods: {
      formatDate,
      deletePost() {
        /* eslint no-restricted-globals: 0 */
        /* eslint no-alert: 0 */
        if (confirm('wosch würk dä Post lösche?')) {
          postCtrl.remove(this.post);
        }
      },
      publishPost() {
        this.post.publish();
      },
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
  }

  .short-text,
  .meta-infos {
    flex: 0 1 auto;
  }

  .meta-infos {
    font-family: $sans-serif;
    color: grey;
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
