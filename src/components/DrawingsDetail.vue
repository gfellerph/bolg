<template>
  <div class="drawings-detail">
    <img :src="drawing.url" alt="">
    <button
      @click="deleteDrawing"
    >Lösche</button>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    props: {
      drawing: Object,
      postid: String,
    },

    methods: {
      async deleteDrawing() {
        /* eslint no-alert: 0 */
        /* eslint no-restricted-globals: 0 */
        if (!confirm('Wosch die Zeichnig würk lösche?')) return;
        const res = await axios.delete(`/api/post/${this.postid}/drawing/${this.drawing.shortid}`);
        this.$emit('updatepost', res.data);
      },
    },
  }
</script>

<style lang="scss">
  .drawings-detail {
    position: relative;
    border: 1px solid lightgrey;

    button {
      position: absolute;
      right: 0;
      bottom: 0;

      &:hover {
        background: crimson;
        color: white;
      }
    }
  }
</style>
