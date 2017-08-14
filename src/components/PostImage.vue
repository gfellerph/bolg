<template>
  <div class="post-image" :class="{active: active}" @click="activateImage">
    <img class="post-image--preview" :src="smallestImage">
    <div class="image-controls">
      <button @click.stop="insertImage" class="post-image--insert">
        <img src="/img/insert.svg" alt="">
      </button>
      <button @click.stop="removeImage" class="post-image--remove">
        <img src="/img/trash.svg" alt="">
      </button>
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
      active: Boolean,
    },

    computed: {
      smallestImage() {
        if (!this.image.thumbnails) return this.image.downloadURL;
        return this.image.thumbnails[Math.min.apply(null, Object.keys(this.image.thumbnails))];
      }
    },

    methods: {
      removeImage() {
        this.$emit('remove-image', this.image.id);
      },
      insertImage() {
        bus.$emit('insert-image', this.image.downloadURL);
      },
      activateImage() {
        const url = this.image.thumbnails[640] ? this.image.thumbnails[640] : this.image.downloadURL;
        this.$emit('activate-image', { id: this.image.id, url });
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
    
    &:hover {
      .image-controls {
        opacity: 0.8;
      }  
    }

    &.active {
      outline: 5px solid dodgerblue;
    }
  }
  
  .post-image--preview {
    display: block;
    height: 14vh;
  }

  .image-controls {
    opacity: 0;
    transition: opacity 200ms;

  }
  
  .post-image--insert {
    position: absolute;
    background: seagreen;
    bottom: 0;
    left: 0;
    border: none;
    padding: 10px;

    &:hover {
      text-shadow: none;
      animation: none;
      transform: scale(1.1);
    }

    img {
      display: block;
      width: 32px;
      height: 32px;
    }
  }

  .post-image--remove {
    position: absolute;
    background: crimson;
    right: 0px;
    bottom: 0px;
    padding: 10px;
    border: none;
    margin: 0;
    transition: transform 200ms;

    &:hover {
      text-shadow: none;
      animation: none;
      transform: scale(1.1);
    }

    img {
      display: block;
      width: 32px;
      height: 32px;
    }
  }
</style>