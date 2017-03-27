<template>
  <div class="image-selector">
    <div class="images">
      <image-uploader
        v-for="(image, index) in images"
        :image="image"
        :index="index"
        :key="index"
        v-on:remove-image="removeImage"
        ref="images"
      ></image-uploader>
      <div class="image-upload-wrapper">
        <p class="text-align-center">Drop images here or <br>click to upload</p>
        <input type="file" multiple @change="onFileChange" />
      </div>
    </div>
  </div>
</template>

<script>
  import ImageUploader from '@/components/ImageUploader';

  export default {
    data() {
      return {
        images: [],
        uploads: [],
      };
    },

    methods: {
      uploadAll() {
        const uploads = this.$refs.images.map(image => image.upload());
        return Promise.all(uploads);
      },
      onFileChange(event) {
        var images = event.target.files || event.dataTransfer.files;
        for (var i = 0; i < images.length; i++) {
          images[i].dataURL = window.URL.createObjectURL(images[i]);
          this.images.push(images[i]);
        }
      },
      removeImage(index) {
        this.images.splice(index, 1);
      },
    },

    components: {
      ImageUploader,
    }
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .image-selector {
    position: relative;
    background: whitesmoke;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  
  .image-upload-wrapper {
    position: relative;
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;

    input[type="file"] {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      z-index: 1;
    }

    p {
      font-family: $sans-serif;
    }
  }

  .image-upload {
    flex: 0 0 auto;

    & + & {
      padding-left: $golden-em / 2;
    }
  }

  .images {
    display: flex;
    min-width: 100%;
    padding: $golden-em / 2;
  }
</style>