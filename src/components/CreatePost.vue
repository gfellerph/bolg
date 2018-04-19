<template>
  <div class="create-post">
    <h1>Creating Post...</h1>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';

  export default {
    created() {
      this.createPost()
        .then((res) => {
          this.editPost(res.data);
          this.$router.push(`/editpost/${res.data._id}`);
        })
    },

    methods: {
      ...mapMutations({
        editPost: 'POST_EDIT',
      }),
      ...mapActions({
        createPost: 'POST_POST',
      }),
    },
  }
</script>
