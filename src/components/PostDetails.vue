<template>
  <div class="post-details">
    <h1 class="h4">{{post.title}}</h1>
    <div class="post-infos">
      <div class="short-text" v-html="shortText"></div>
      <div class="meta-infos">
        <dl>
          <dt>Date: </dt>
          <dd>{{dateFormat(post.created, 'D. MMM YYYY')}}</dd>
          <dt>Last update: </dt>
          <dd>{{dateFormat(post.lastEdited, 'D. MMM YYYY')}}</dd>
          <dt>State: </dt>
          <dd>
            <span v-if="state === states.LOADING">Loading...</span>
            <span v-if="state === states.EDITING">Editing</span>
            <span v-if="state === states.SAVED">Save</span>
            <span v-if="state === states.PUBLISHED">Published</span>
            <span v-if="state === states.EDITING_OFFLINE">Editing (offline)</span>
            <span v-if="state === states.SAVED_OFFLINE">Save (offline)</span>
          </dd>
        </dl>
        <p class="text-align-right">
          <router-link class="button small" :to="editLink">Edit</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import dateFormat from '@/filters/date-format';
  import PostMixin from '@/mixins/post-mixin';
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
    flex: 1 0 50%;
  }

  .meta-infos {
    text-align: right;
    color: grey;

    dl {
      font-size: 0.8em;
      font-family: $sans-serif;
    }
  }
</style>