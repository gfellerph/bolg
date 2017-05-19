<template>
  <div class="post-image">
    <img class="post-image--preview" :src="smallestImage">
    <div class="image-controls">
      <div @click="removeImage" class="post-image--remove"></div>
      <div @click="insertImage" class="post-image--insert"></div>
    </div>
  </div>
</template>


<script>
  import Image from '@/models/Image';
  import bus from '@/config/bus';

  export default {
    data() {
      return {};
    },

    props: {
      image: Object,
    },

    computed: {
      smallestImage() {
        if (!this.image.thumbnails) return this.image.downloadURL;
        return this.image.thumbnails[Math.min.apply(null, Object.keys(this.image.thumbnails))];
      }
    },

    methods: {
      removeImage() {
        bus.$emit('remove-image', this.image.id);
      },
      insertImage() {
        bus.$emit('insert-image', this.image.downloadURL);
      },
    }
  };
</script>


<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .post-image {
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
    flex: 0 0 auto;
    margin-right: $golden-em / 2;
  }
  
  .post-image--preview {
    display: block;
    height: 14vh;
  }

  .image-controls {
    opacity: 0;
    transition: opacity 200ms;

    &:hover {
      opacity: 0.8;
    }
  }
  
  .post-image--insert {
    position: absolute;
    background: royalblue;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
  }

  .post-image--remove {
    position: absolute;
    background: crimson;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
  }
</style>