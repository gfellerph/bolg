<template>
  <div class="post-details">
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
    <div class="post-controls">
      <post-status :post="post"></post-status>
      <button class="edit-button" @click="deletePost">Lösche</button>
      <router-link class="button edit-button" :to="editLink">Ändere</router-link>
    </div>
  </div>
</template>

<script>
  import dateFormat from '@/filters/date-format';
  import PostMixin from '@/mixins/post-mixin';
  import PostStatus from '@/components/PostStatus';
  import {states} from '@/config/constants';
  import marked from 'marked';

  export default {
    mixins: [PostMixin],
  
    data() {
      return {
        states,
      };
    },

    props: {
      post: Object,
    },

    computed: {
      editLink() { return `/edit/${this.post.id}`; },
      shortText() { return marked(`${this.post.markdown.replace(/#+.+\n/gm, '').split(' ').slice(0, 20).join(' ')}...`); },
    },

    methods: {
      dateFormat,
    }
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
    display: flex;
    
  }

  .short-text,
  .meta-infos {
    flex: 0 1 auto;
  }

  .meta-infos {
    text-align: right;

    dl {
      color: grey;
      font-size: 0.8em;
      font-family: $sans-serif;

      dt,
      dd {
        white-space: nowrap;
      }

      dt {
        padding-right: 0.5em;
      }
    }
  }
</style>