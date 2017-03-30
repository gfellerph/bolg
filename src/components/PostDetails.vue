<template>
  <div class="post-details">
    <h1 class="h4">{{post.title}}</h1>
    <p>Date: {{dateFormat(post.created, 'D. MMM YYYY')}}</p>
    <p>Last update: {{dateFormat(post.lastEdited, 'D. MMM YYYY')}}</p>
    <p>State: 
      <span v-if="state === states.LOADING">Loading...</span>
      <span v-if="state === states.EDITING">Editing</span>
      <span v-if="state === states.SAVED">Save</span>
      <span v-if="state === states.PUBLISHED">Published</span>
      <span v-if="state === states.EDITING_OFFLINE">Editing (offline)</span>
      <span v-if="state === states.SAVED_OFFLINE">Save (offline)</span>
    </p>
    <router-link class="button small" :to="editLink">Edit</router-link>
  </div>
</template>

<script>
  import dateFormat from '@/filters/date-format';
  import PostMixin from '@/mixins/post-mixin';
  import {states} from '@/config/constants';

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
      editLink() { return `/edit/${this.post.id}`; }
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
</style>