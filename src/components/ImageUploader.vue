<template>
  <div class="image-upload">
    <img class="image-upload--preview" :src="URL">
    <div class="image-upload--progress" :style="progressStyle" v-if="progress">
      <img :src="URL">
    </div>
    <div class="image-controls" v-if="image.downloadURL">
      <div @click="removeImage" class="image-upload--remove"></div>
      <div @click="insertImage" class="image-upload--insert"></div>
    </div>
  </div>
</template>


<script>
  import cuid from 'cuid';
  import Image from '@/models/Image';
  import bus from '@/config/bus';

  export default {
    data() {
      return {
        progress: 0,
        URL: null,
      }
    },

    mounted() {
      if (this.image.file) {
        this.URL = this.image.dataURL();
        const upload = this.image.put()
        upload.on('state_changed', this.onUploadProgress);
        upload.then(snapshot => {
          this.image.file = null;
          this.image.downloadURL = snapshot.downloadURL;
          this.URL = this.image.downloadURL;
        });
      }
    },

    props: {
      image: Object,
    },

    computed: {
      progressStyle() {
        return `width: ${this.progress}%;`;
      },
    },

    methods: {
      onUploadProgress(snapshot) {
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      removeImage() {
        this.$emit('remove-image', this.image.id);
      },
      insertImage() {
        bus.$emit('insert-image', this.image.downloadURL);
      }
    }
  };
</script>


<style lang="scss" scoped>
  .image-upload {
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .image-upload--preview {
    filter: grayscale(1);
    object-fit: cover;
  }
  
  .image-upload--progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    will-change: width;
    transition: width 1000ms;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    img {
      object-fit: cover;
      height: 100%;
      max-width: none;
    }
  }

  .image-controls {
    opacity: 0;
    transition: opacity 200ms;

    &:hover {
      opacity: 0.8;
    }
  }
  
  .image-upload--insert {
    position: absolute;
    background: royalblue;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
  }

  .image-upload--remove {
    position: absolute;
    background: crimson;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
  }
</style>