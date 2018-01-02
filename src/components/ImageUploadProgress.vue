<template>
  <div
      class="image-upload__progress"
      :style="progressStyle"
    >
      <img
        :src="src"
      >
    </div>
</template>

<script>
import bus from 'src/config/bus';

export default {
  data() {
    return {
      progress: 0,
    }
  },
  props: {
    src: [String, File],
    imageId: String,
  },
  mounted() {
    bus.$on(`upload-progress:${this.imageId}`, (progress) => {
      this.progress = progress;
    });
  },
  computed: {
    progressStyle() {
      return `width: ${this.progress}%;`;
    },
  },
}
</script>

<style lang="scss" scoped>
  .image-upload__progress {
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
</style>

