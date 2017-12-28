<template>
  <div class="image">
    <img
      v-if="image.state === imageStates.DONE"
      :src="image.getSmallestThumbUrl()"
      alt="thumb"
    >
    <span v-if="image.state === imageStates.QUEUED">QUEUED</span>
    <span
      v-if="image.state === imageStates.ERROR"
      @click="retryUpload"
    >ERROR</span>
    <span v-if="image.state === imageStates.UPLOADING">UPLOADING</span>
    <span v-if="image.state === imageStates.PROCESSING">PROCESSING</span>
  </div>
</template>

<script>
import { imageStates } from 'src/config/constants';

export default {
  data() {
    return {
      imageStates,
    }
  },

  props: {
    image: Object,
  },

  methods: {
    retryUpload() {
      this.$emit('retry-upload', this.image.id);
    },
  },
}
</script>
