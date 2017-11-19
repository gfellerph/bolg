<template>
  <div class="drawings">
    <h1>Zeichnige</h1>
    <div 
      class="drawing-collection"
      :key="collection.id"
      v-for="collection in drawingCollection"
    >
      <h2>{{collection.title}}</h2>
      <div class="drawings__list">
        <drawings-detail
          :postid="collection.id"
          :drawing="drawing"
          :drawingkey="key"
          :key="key"
          v-for="(drawing, key) in collection.drawings"
        ></drawings-detail>
      </div>
    </div>
  </div>
</template>

<script>
  import Post from '@/models/Post';
  import DrawingsDetail from '@/components/DrawingsDetail';
  import { database } from '@/config/firebase';

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
      this.$bindAsArray('posts', database.ref('/published').orderByChild('created'));
    },

    computed: {
      drawingCollection() {
        return this.posts.map((postData) => {
          const post = new Post(postData);
          return {
            id: post.id,
            title: post.title,
            drawings: post.drawings,
          };
        });
      }
    }
  }
</script>

<style lang="scss">
  .drawings__list {
    display: flex;
    flex-wrap: wrap;
  }
</style>
