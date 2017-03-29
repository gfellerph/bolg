<template>
  <div class="post-details">
    <h1 class="h4">{{post.title}}</h1>
    <p>Date: {{dateFormat(post.created, 'D. MMM YYYY')}}</p>
    <p>Last update: {{dateFormat(post.lastEdited, 'D. MMM YYYY')}}</p>
    <router-link class="button small" :to="editLink">Edit</router-link>
  </div>
</template>

<script>
  import dateFormat from '@/filters/date-format';

  export default {
    data() {
      return {};
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