<template>
  <div class="image-upload">
    <img class="image-upload--preview" :src="image.dataURL">
    <div class="image-upload--progress" :style="progressStyle" v-if="uid">
      <img :src="image.dataURL">
    </div>
    <div @click="removeImage" class="image-upload--remove" v-if="uid"></div>
    <div @click="insertImage" class="image-upload--insert" v-if="uid"></div>
  </div>
</template>


<script>
  import cuid from 'cuid';
  import { storage } from '@/config/firebase';

  export default {
    data() {
      return {
        progress: 0,
        blob: null,
        uid: cuid(),
        downloadURL: '',
      }
    },

    mounted() {
      this.upload();
    },

    props: {
      image: File,
      index: Number,
    },

    computed: {
      progressStyle() {
        return `width: ${this.progress}%;`;
      },
    },

    methods: {
      upload() {
        var uploader = storage
          .ref(`/gallery/${this.uid}`)
          .put(this.image);

        uploader.on('state_changed', this.onUploadProgress);

        return uploader
          .then(snapshot => {
            this.$emit('image-uploaded', snapshot.downloadURL);
            this.downloadURL = snapshot.downloadURL;
          });
      },
      onUploadProgress(snapshot) {
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      removeImage() {
        this.$emit('remove-image', this.index);
      },
      insertImage() {
        this.$emit('insert-image', this.downloadURL);
      }
    }
  };
</script>


<style lang="scss" scoped>
  .image-upload {
    position: relative;
    width: 200px;
    min-height: 100px;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .image-upload--preview {
    width: 100%;
    height: 100%;
    max-width: none;
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
      width: 200px;
      height: 100%;
      max-width: none;
    }
  }
  
  .image-upload--insert {
    position: absolute;
    background: royalblue;
    mix-blend-mode: multiply;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    opacity: 0;
    transition: opacity 200ms;
    &:hover {
      opacity: 1;
    }
  }

  .image-upload--remove {
    position: absolute;
    background: crimson;
    mix-blend-mode: multiply;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    opacity: 0;
    transition: opacity 200ms;
    &:hover {
      opacity: 1;
    }
  }
</style>