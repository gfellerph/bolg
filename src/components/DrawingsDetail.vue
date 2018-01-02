<template>
  <div class="drawings-detail">
    <img :src="drawing" alt="">
    <button
      @click="deleteDrawing"
    >Lösche</button>
  </div>
</template>

<script>
  import { database } from 'src/config/firebase';

  export default {
    props: {
      drawing: String,
      postid: String,
      drawingkey: String,
    },

    methods: {
      deleteDrawing() {
        /* eslint no-alert: 0 */
        /* eslint no-restricted-globals: 0 */
        if (!confirm('Wosch die Zeichnig würk lösche?')) return;

        database.ref(`posts/${this.postid}/drawings/${this.drawingkey}`).remove();
        database.ref(`published/${this.postid}/drawings/${this.drawingkey}`).remove();
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
