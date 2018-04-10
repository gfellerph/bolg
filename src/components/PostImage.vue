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
        <img src="/img/close.svg" alt="">
      </button>
    </div>
  </div>
</template>

<script>
  import bus from 'src/config/bus';
  import Image from 'src/models/Image';
  import ImageController from 'src/controllers/image-controller';

  const imageCtrl = ImageController();

  export default {
    data() {
      return {
        deleting: false,
      };
    },

    props: {
      image: {
        type: Object,
        default: () => new Image(),
      },
      active: Boolean,
    },

    computed: {
      smallestImage() {
        return this.image ? this.image.getSmallestThumbUrl() : '';
      },
    },

    methods: {
      removeImage() {
        this.deleting = true;
        imageCtrl.deleteImages(this.image.shortid, this.image.url)
          .then(() => {
            this.$emit('remove-image', this.image._id);
          })
          .catch((err) => {
            this.deleting = false;
            throw new Error(err);
          });
      },
      insertImage() {
        bus.$emit('insert-image', this.image.url);
      },
      activateImage() {
        this.$emit('activate-image', this.image);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/core/_index';

  .post-image {
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
    flex: 0 0 auto;
    margin-right: $golden-em / 4;
    transition: opacity 4s;

    &:hover {
      .image-controls {
        opacity: 1;
      }
    }

    &.active {
      outline: 0.402rem solid dodgerblue;
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
    right: 0;
    bottom: 0;
    left: 0;
    border: none;
    padding: 0.402rem;
    display: block;
    width: 100%;
    opacity: 0.85;

    img {
      display: block;
      width: 18px;
      height: 18px;
    }
  }

  .post-image--remove {
    position: absolute;
    background: gainsboro;
    top: -0.402rem;
    right: -0.402rem;
    padding: 0.402rem;
    border: none;
    margin: 0;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
    transition: transform 200ms;

    img {
      display: block;
      width: 12px;
      height: 12px;
    }
  }
</style>
