<template>
  <div class="image-selector" ref="imageSelector">
    <div class="images" :class="{dragover: dragover}">
      <post-image
        v-for="image in post.images"
        :image="image"
        :key="image.id"
      ></post-image>
      <image-uploader
        v-for="image in imagesForUpload"
        :image="image"
        :key="image.id"
      ></image-uploader>
      <div class="image-upload-wrapper">
        <p class="text-align-center">Drop or click for pics</p>
        <input type="file" multiple @change="onFileChange" />
      </div>
    </div>
  </div>
</template>

<script>
  import ImageUploader from '@/components/ImageUploader';
  import PostImage from '@/components/PostImage';
  import Image from '@/models/Image';
  import bus from '@/config/bus';

  export default {
    data() {
      return {
        imagesForUpload: [],
        dragover: false,
      };
    },

    props: {
      post: Object,
    },

    mounted() {
      window.addEventListener('dragover', function (e) { e.preventDefault(); });
      window.addEventListener('dragenter', this.onDragEnter);
      window.addEventListener('dragleave', this.onDragLeave);
      window.addEventListener('drop', this.onFileChange);

      this.$refs.imageSelector.addEventListener('mousewheel', (event) => {
        this.$refs.imageSelector.scrollLeft += event.deltaY;
      });
    },

    created() {
      bus.$on('remove-image', this.removeImage);
      bus.$on('thumbnails-generated', this.addImage);
    },

    computed: {
      
    },

    methods: {
      onDragEnter(event) {
        if (event.target === event.currentTarget) this.dragover = true;
      },
      onDragLeave(event) {
        if (event.target === event.currentTarget) this.dragover = false;
      },
      onFileChange(event) {
        event.preventDefault();
        var images = event.target.files || event.dataTransfer.files;
        for (var i = 0; i < images.length; i++) {
          this.imagesForUpload.push(new Image({file: images[i]}));
        }
      },
      addImage(image) {
        this.imagesForUpload = this.imagesForUpload.filter(img => image.id !== img.id);
        this.post.images.push(image);
        this.post.set();
      },
      removeImage(id) {
        this.post.images = this.post.images.filter(image => image.id !== id);
        this.post.set();
      },
    },

    components: {
      ImageUploader,
      PostImage,
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
    padding: 0 $golden-em / 2;

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