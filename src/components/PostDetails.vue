<template>
  <div class="post-details">
    <h2>{{post.title}}</h2>
    <p>Date: {{post.created}}</p>
    <p>Last update: {{post.lastEdited}}</p>
    <router-link :to="editLink">Edit</router-link>
  </div>
</template>


<script>
  export default {
    data() {
      return {};
    },

    props: {
      post: Object,
    },

    computed: {
      editLink() { return `/edit/${this.post.id}`; }
    }
  };
</script>


<style lang="scss" scoped>
  .post-details {
    position: relative;
  }
</style>