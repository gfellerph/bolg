<template>
  <div class="image-selector" ref="imageSelector">
    <div v-if="post" class="images">
      <post-image
        v-for="image in post.images"
        :key="image.shortid"
        :image="new Image(image)"
        :class="{active: isImageActive(image.shortid)}"
        @activate-image="activateImage"
        @remove-image="removeImage"
      ></post-image>
      <image-component
        v-for="image in imageQueue"
        :key="image.shortid"
        :image="image"
        @retry-upload="retryUpload"
      ></image-component>
      <div class="image-upload-wrapper">
        <p class="text-align-center">Drop or click for pics</p>
        <label for="image-uploader"></label>
        <input
          id="image-uploader"
          type="file"
          accept=".jpg,.jpeg,.png"
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
  import ImageComponent from 'src/components/Image';
  import Image from 'src/models/Image';
  import ImageController from 'src/controllers/image-controller';
  import { imageStates } from 'src/config/constants';
  import io from 'src/config/socket.io-client';
  import bus from 'src/config/bus';

  const imageCtrl = ImageController();

  export default {
    data() {
      return {
        imageQueue: [],
        Image,
        uploading: false,
      };
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

    destroyed() {
      io.removeListener('server:image-processing-finished', this.addImage);
      io.removeListener('server:image-processing-error', this.processingError);
    },

    computed: {
      post() { return this.$store.state.post.post; },
    },

    methods: {
      startUpload() {
        if (this.uploading) return;

        // If queue is empty, exit
        if (!this.imageQueue) return;

        // Find first waiting image
        const imageToUpload = this.imageQueue.find(image => image.state === imageStates.QUEUED);

        // If no more images to upload, return
        if (!imageToUpload) return;

        // Start uploading
        this.uploading = true;
        imageToUpload.state = imageStates.UPLOADING;
        imageCtrl.upload(imageToUpload, {
          onUploadProgress: (event) => {
            const progress = (event.loaded / event.total) * 100;
            bus.$emit(`upload-progress:${imageToUpload.shortid}`, progress);
          },
        })
          .then((res) => {
            imageToUpload.url = res.data.url;
            imageToUpload.state = res.data.state;
            imageToUpload.ratio = res.data.ratio;
            this.uploading = false;
            this.startUpload();
          })
          .catch(() => {
            this.uploading = false;
            imageToUpload.state = imageStates.ERROR;
          });
      },
      retryUpload(shortid) {
        const img = this.imageQueue.find(image => shortid === image.shortid);
        if (!img) return;
        img.state = imageStates.QUEUED;
        this.startUpload();
      },
      processingError(data) {
        const img = this.imageQueue.find(image => data.shortid === image.shortid);
        img.state = imageStates.ERROR;
        img.progress = 0;
        this.startUpload();
      },
      isImageActive(imgId) {
        return this.post.titleImage ? imgId === this.post.titleImage.shortid : false;
      },
      onFileChange(event) {
        event.preventDefault();
        const files = event.target.files || event.dataTransfer.files;
        const images = [...files].map(file => new Image({ file }));
        this.imageQueue = this.imageQueue.concat(images);
        this.$nextTick(this.startUpload);
      },
      addImage(shortid) {
        const img = this.imageQueue.find(image => image.shortid === shortid);
        if (img) {
          this.imageQueue = this.imageQueue.filter(image => image.shortid !== shortid);
          this.$store.commit('POST_ADD_IMAGE', img);
          this.$store.dispatch('POST_PUT');
        }
      },
      removeImage(shortid) {
        this.$store.commit('POST_REMOVE_IMAGE', shortid);
        this.$store.dispatch('POST_PUT');
      },
      activateImage(image) {
        if (this.isImageActive(image.shortid)) {
          this.$store.commit('POST_SET_TITLE_IMAGE', { image: null });
        } else {
          this.$store.commit('POST_SET_TITLE_IMAGE', { image });
        }
        this.$store.dispatch('POST_PUT');
      },
    },

    components: {
      ImageUploader,
      PostImage,
      ImageComponent,
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/core/_index';

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
    outline: 4px dashed gainsboro;
    outline-offset: -4px;

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
      margin: 0;
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
    padding: $golden-em / 4;
  }
</style>
