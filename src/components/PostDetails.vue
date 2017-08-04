<template>
  <div class="post-details">
    <router-link class="edit-post-link" :to="post.editUrl">
      <div class="post-infos">
          <h1 class="h4">{{post.title}}</h1>
          <div class="short-text" v-html="shortText"></div>
          <table class="meta-infos">
            <tr>
              <th>Gmacht:</th>
              <td>{{dateFormat(post.created, 'D. MMM YYYY')}}</td>
            </tr>
            <tr>
              <th>Zletscht gschribe:</th>
              <td>{{dateFormat(post.lastEdited, 'D. MMM YYYY')}}</td>
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
  import dateFormat from '@/filters/date-format';
  import PostStatus from '@/components/PostStatus';
  import { description } from '@/config/markdown';

  export default {
    // mixins: [PostMixin],
  
    data() {
      return {
        // states,
      };
    },

    props: {
      post: Object,
    },

    computed: {
      shortText() { return description(this.post.markdown); },
    },

    methods: {
      dateFormat,
      deletePost() {
        if (confirm('wosch würk dä Post lösche?')) {
          this.post.remove();
        }
      },
      publishPost() {
        this.post.publish();
      }
    },

    components: {
      PostStatus,
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';

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