<template>
  <div class="image-upload">
    <img
      class="image-upload--preview"
      :class="{ 'upload-complete': uploadComplete }"
      :src="image.url()"
      :title="error"
    >
    <div
      class="image-upload--progress"
      v-if="progress"
      :style="progressStyle"
    >
      <img
        :class="{ 'loading-thumbnails': uploadComplete }"
        :src="image.url()"
      >
    </div>
    <div
      class="image-upload__error"
      v-if="error"
      :title="error"
    >
      <button
        class="blank"
        @click="removeImage"
      >dehaut</button>
      <button
        class="blank"
        @click="upload"
      >nomau</button>
    </div>
  </div>
</template>

<script>
  import ImageController from 'src/controllers/image-controller';

  const imageCtrl = ImageController();

  export default {
    data() {
      return {
        progress: 0,
        URL: null,
        generatingThumbs: false,
        error: false,
      }
    },

    props: {
      image: Object,
    },

    mounted() {
      // Upload image if it is a file
      this.URL = this.image.url();
      this.upload();
    },

    computed: {
      progressStyle() {
        return `width: ${this.progress}%;`;
      },
      uploadComplete() {
        return this.progress === 100;
      },
    },

    methods: {
      upload() {
        this.error = false;
        this.progress = 0;

        imageCtrl.upload(this.image, {
          onUploadProgress: this.onUploadProgress,
        })
          .then((res) => {
            this.error = false;
            this.progress = 100;
            const imageWithLinks = Object.assign({}, this.image, res.data);
            this.$emit('upload-success', imageWithLinks);
          })
          .catch((err) => {
            this.progress = 0;
            this.error = err.message;
          });
      },
      onUploadProgress(event) {
        this.progress = (event.loaded / event.total) * 100;
      },
      removeImage() {
        this.$emit('remove-image', this.image.id);
      },
    },
  };
</script>


<style lang="scss" scoped>
  @import 'src/styles/core/_index';

  .image-upload {
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
    margin-right: $golden-em / 2;
  }

  .image-upload--preview {
    filter: grayscale(1);
    // object-fit: cover;
    display: block;
    height: 14vh;
    flex: 0 0 auto;
    opacity: 0.7;

    &.upload-complete {
      visibility: hidden;
    }
  }

  .image-upload__error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    background: crimson;
    opacity: 0.66;

    button {
      color: white;
      flex: 1 0 auto;
    }

    svg {
      max-width: 100%;
    }
  }

  .image-upload--progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    will-change: width;
    transition: width 300ms;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    img {
      object-fit: cover;
      height: 100%;
      max-width: none;
    }
  }

  .loading-thumbnails {
    animation: loading-thumbnails 2s infinite;
  }

  @keyframes loading-thumbnails {
    0% {
      filter: grayscale(1);
      opacity: 0.7;
    }
    50% {
      filter: grayscale(0);
      opacity: 1;
    }
    100% {
      filter: grayscale(1);
      opacity: 0.7;
    }
  }
</style>
