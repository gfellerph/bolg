<template>
  <div class="drawings">
    <h1>Zeichnige</h1>
    <div
      class="drawing-collection"
      :key="collection._id"
      v-for="collection in drawingCollection"
    >
      <h2>{{collection.title}} ({{Object.keys(collection.drawings).length}})</h2>
      <div class="drawings__list">
        <drawings-detail
          :postid="collection._id"
          :drawing="drawing"
          :key="drawing.shortid"
          v-for="drawing in collection.drawings"
          @updatepost="updatePost"
        ></drawings-detail>
      </div>
    </div>
  </div>
</template>

<script>
  import DrawingsDetail from 'src/components/DrawingsDetail';
  import axios from 'axios';

  export default {
    components: {
      DrawingsDetail,
    },

    data() {
      return {
        posts: [],
      }
    },

    created() {
      axios.get('/api/posts')
        .then((res) => { this.posts = res.data; })
    },

    computed: {
      drawingCollection() {
        return this.posts
          .filter(post => post.drawings);
      },
    },

    methods: {
      updatePost(newPost) {
        /* eslint no-confusing-arrow: 0 */
        this.posts = this.posts.map(post => post._id === newPost._id ? newPost : post);
      },
    },
  }
</script>

<style lang="scss">
  .drawings__list {
    display: flex;
    flex-wrap: wrap;
  }
</style>
