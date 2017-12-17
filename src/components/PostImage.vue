<template>
  <div
    class="post-image"
    :class="{active: active, deleting: deleting}"
    @click="activateImage"
  >
    <img
      class="post-image--preview"
      :src="smallestImage"
    >
    <div class="image-controls">
      <button
        class="post-image--insert"
        :disabled="deleting"
        @click.stop="insertImage"
      >
        <img src="/img/insert.svg" alt="">
      </button>
      <button
        class="post-image--remove"
        :disabled="deleting"
        @click.stop="removeImage"
      >
        <img src="/img/trash.svg" alt="">
      </button>
    </div>
  </div>
</template>


<script>
  import bus from 'src/config/bus';
  import ImageController from 'src/controllers/image-controller';

  const imageCtrl = ImageController();

  export default {
    data() {
      return {
        deleting: false,
      };
    },

    props: {
      image: Object,
      active: Boolean,
    },

    computed: {
      smallestImage() {
        return this.image.getSmallestThumbUrl();
      },
    },

    methods: {
      removeImage() {
        this.deleting = true;
        imageCtrl.deleteImages(this.image.id)
          .then(() => {
            this.$emit('remove-image', this.image.id);
          })
          .catch((err) => {
            this.deleting = false;
            throw new Error(err);
          });
      },
      insertImage() {
        bus.$emit('insert-image', this.image.downloadURL);
      },
      activateImage() {
        this.$emit('activate-image', this.image);
      },
    },
  };
</script>


<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .post-image {
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
    flex: 0 0 auto;
    margin-right: $golden-em / 2;
    transition: opacity 2s;

    &:hover {
      .image-controls {
        opacity: 0.8;
      }
    }

    &.active {
      outline: 5px solid dodgerblue;
    }

    &.deleting {
      opacity: 0.1;

      .image-controls {
        display: none;
      }
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
