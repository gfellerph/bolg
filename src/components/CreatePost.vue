<template>
  <div class="create-post">
    <h1>Gib däm Post e Titu</h1>
    <input
      type="text"
      v-model="title"
    >
    <p v-if="error">{{error}}</p>
    <button
      @click="create"
    >
      Guet
    </button>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        title: '',
        error: false,
      };
    },

    methods: {
      create() {
        this.createPost({
          markdown: `# ${this.title}`,
          title: this.title,
        })
          .then((res) => {
            this.editPost(res.data);
            this.$router.push(`/editpost/${res.data._id}`);
          })
          .catch((err) => {
            this.error = err.message;
          });
      },
      ...mapMutations({
        editPost: 'POST_EDIT',
      }),
      ...mapActions({
        createPost: 'POST_POST',
      }),
    },
  }
</script>
