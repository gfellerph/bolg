<template>
  <div
    class="image"
    :class="statusClassName"
  >
    <img
      class="image__preview"
      :src="blobOrUrl"
      alt="thumb"
    >
    <image-upload-progress
      v-if="image.state === imageStates.UPLOADING"
      :imageId="image.id"
      :src="blobOrUrl"
    ></image-upload-progress>
    <div
      class="image__error"
      v-if="image.state === imageStates.ERROR"
    >
      <button
        @click="retryUpload"
      >nomau?</button>
    </div>
    <div class="image__status-texts">{{statusText}}</div>
  </div>
</template>

<script>
import ImageUploadProgress from 'src/components/ImageUploadProgress';
import { imageStates } from 'src/config/constants';

const statusTexts = {
  0: 'warte',
  1: 'lade ufe',
  2: 'prozessere',
  3: 'fertig',
  4: '',
};

export default {
  components: { ImageUploadProgress },
  data() {
    return {
      imageStates,
    }
  },

  props: {
    image: Object,
  },

  computed: {
    statusClassName() {
      return Object.keys(imageStates)[this.image.state].toLowerCase();
    },
    statusText() {
      return statusTexts[this.image.state];
    },
    blobOrUrl() {
      return this.image.getBlobOrSmallestThumb();
    },
  },

  methods: {
    retryUpload() {
      this.$emit('retry-upload', this.image.id);
    },
  },
}
</script>

<style lang="scss" scoped>
  .image {
    position: relative;
    flex: 0 0 auto;
    margin-right: 0.402rem;

    &.queued,
    &.uploading,
    &.error {
      .image__preview {
        filter: grayscale(1);
        opacity: 0.8;
      }
    }

    &.processing {
      animation: loading-thumbnails 2s infinite;
    }
  }

  .image__preview {
    display: block;
    height: 14vh;
  }

  .image__status-texts,
  .image__error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    mix-blend-mode: overlay;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    color: white;
  }

  .image__status-texts {
    pointer-events: none;
  }

  .image__error {
    background: crimson;

    button {
      padding: 4px 8px;
      border: 1px solid white;
    }
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
