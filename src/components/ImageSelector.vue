<template>
  <div class="image-selector" ref="imageSelector">
    <div class="images" :class="{dragover: dragover}">
      <post-image
        v-for="image in post.images"
        :image="new Image(image)"
        :key="image.id"
        :active="isImageActive(image.id)"
        @remove-image="removeImage"
        @activate-image="activateImage"
      ></post-image>
      <image-uploader
        v-for="image in imagesForUpload"
        :image="image"
        :key="image.id"
        @upload-success="addImage"
        @remove-image="removeImageForUpload"
      ></image-uploader>
      <div class="image-upload-wrapper">
        <p class="text-align-center">Drop or click for pics</p>
        <label for="image-uploader"></label>
        <input
          id="image-uploader"
          type="file"
          multiple
          @change="onFileChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import ImageUploader from 'src/components/ImageUploader';
  import PostImage from 'src/components/PostImage';
  import Image from 'src/models/Image';
  import PostController from 'src/controllers/post-controller';
  import { database } from 'src/config/firebase';

  const postCtrl = PostController(database);

  export default {
    data() {
      return {
        imagesForUpload: [],
        dragover: false,
        Image,
      };
    },

    props: {
      post: Object,
    },

    mounted() {
      window.addEventListener('dragover', (e) => { e.preventDefault(); });
      window.addEventListener('dragenter', this.onDragEnter);
      window.addEventListener('dragleave', this.onDragLeave);
      window.addEventListener('drop', this.onFileChange);

      // Map vertical scrolling to horizontal scroll events
      this.$refs.imageSelector.addEventListener('mousewheel', (event) => {
        this.$refs.imageSelector.scrollLeft += event.deltaY;
      });
    },

    methods: {
      isImageActive(imgId) {
        return this.post.titleImage ? imgId === this.post.titleImage.id : false;
      },
      onDragEnter(event) {
        if (event.target === event.currentTarget) this.dragover = true;
      },
      onDragLeave(event) {
        if (event.target === event.currentTarget) this.dragover = false;
      },
      onFileChange(event) {
        event.preventDefault();
        const images = event.target.files || event.dataTransfer.files;
        for (let i = 0; i < images.length; i++) {
          this.imagesForUpload.push(new Image({ file: images[i] }));
        }
      },
      addImage(payload) {
        const image = new Image(payload);
        this.imagesForUpload = this.imagesForUpload.filter(img => image.id !== img.id);
        this.post.images.push(image);
        postCtrl.set(this.post);
      },
      removeImage(id) {
        this.post.images = this.post.images.filter(image => image.id !== id);
        postCtrl.set(this.post);
      },
      removeImageForUpload(id) {
        this.imagesForUpload = this.imagesForUpload.filter(img => img.id !== id);
      },
      activateImage(image) {
        if (this.isImageActive(image.id)) {
          this.post.titleImage = null;
        } else {
          this.post.titleImage = {
            url: image.thumbnails[640] || image.downloadURL,
            id: image.id,
          };
        }
        return postCtrl.set(this.post);
      },
    },

    components: {
      ImageUploader,
      PostImage,
    },
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
    padding: 0 $golden-em / 2;
    height: 14vh;

    input[type="file"] {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 0%;
    }

    label {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
    }

    p {
      font-family: $sans-serif;
      margin: 0;
    }
  }

  .image-upload {
    flex: 0 0 auto;
    margin-right: $golden-em / 2;
  }

  .images {
    display: flex;
    min-width: 100%;
    padding: $golden-em / 2;
    outline: 4px dashed transparent;
    transition: outline 0.3s;

    &.dragover {
      outline-offset: -4px;
      outline-color: slategrey;
    }
  }
</style>
