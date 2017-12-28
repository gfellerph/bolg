<template>
  <div class="image-selector" ref="imageSelector">
    <div class="images">
      <post-image
        v-for="image in post.images"
        :key="image.id"
        :image="image"
        @activate="activateImage"
        @remove-image="removeImage"
      ></post-image>
      <image-component
        v-for="image in imageQueue"
        :key="image.id"
        :image="image"
        @retry-upload="retryUpload"
      ></image-component>
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
  import QueuedImage from 'src/components/QueuedImage';
  import ImageComponent from 'src/components/Image';
  import Image from 'src/models/Image';
  import PostController from 'src/controllers/post-controller';
  import ImageController from 'src/controllers/image-controller';
  import { database } from 'src/config/firebase';
  import { imageStates } from 'src/config/constants';
  import io from 'src/config/socket.io-client';

  const postCtrl = PostController(database);
  const imageCtrl = ImageController();

  export default {
    data() {
      return {
        imageQueue: [],
      };
    },

    props: {
      post: Object,
    },

    mounted() {
      window.addEventListener('dragover', (e) => { e.preventDefault(); });
      window.addEventListener('drop', this.onFileChange);

      // Map vertical scrolling to horizontal scroll events
      this.$refs.imageSelector.addEventListener('mousewheel', (event) => {
        this.$refs.imageSelector.scrollLeft += event.deltaY;
      });

      io.on('server:image-processing-finished', this.addImage);
      io.on('server:image-processing-error', this.processingError);
    },

    methods: {
      startUpload() {
        // If queue is empty, exit
        if (!this.imageQueue) return;

        // Find first waiting image
        const imageToUpload = this.imageQueue.find(image => image.state === imageStates.QUEUED);

        // No more images to upload
        if (!imageToUpload) return;
        imageToUpload.state = imageStates.UPLOADING;
        imageCtrl.upload(imageToUpload)
          .then((res) => {
            // const index = this.imageQueue.findIndex(image => image.id === res.data.id);
            imageToUpload.downloadURL = res.data.downloadURL;
            imageToUpload.thumbnails = res.data.thumbnails;
            imageToUpload.state = res.data.state;
            // this.$set(this.imageQueue, index, new Image(res.data));
            this.startUpload();
          })
          .catch(() => {
            imageToUpload.state = imageStates.ERROR;
          });
      },
      retryUpload(id) {
        const img = this.imageQueue.find(image => id === image.id);
        if (!img) return;
        img.state = imageStates.QUEUED;
        this.startUpload();
      },
      processingError(data) {
        const img = this.imageQueue.find(image => data.id === image.id);
        img.state = imageStates.ERROR;
      },
      isImageActive(imgId) {
        return this.post.titleImage ? imgId === this.post.titleImage.id : false;
      },
      onFileChange(event) {
        event.preventDefault();
        const files = event.target.files || event.dataTransfer.files;
        const images = [...files].map(file => new Image({ file }));
        this.imageQueue = this.imageQueue.concat(images);
        this.$nextTick(this.startUpload);
      },
      addImage(id) {
        const img = this.imageQueue.find(image => image.id === id);
        if (img) {
          this.imageQueue = this.imageQueue.filter(image => image.id !== id);
          this.post.images.push(img);
          postCtrl.set(this.post);
        }
      },
      removeImage(id) {
        this.post.images = this.post.images.filter(image => image.id !== id);
        postCtrl.set(this.post);
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
      QueuedImage,
      ImageComponent,
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
