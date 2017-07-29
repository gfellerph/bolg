<template>
  <div class="story__create">
    <div class="panel story__pages-panel">
      <div class="story__page-controls">
        <button>Add page</button>
      </div>
      <ul class="story__page-list">
        <li v-for="page in pages" :key="page.id">
          <span>Site {{page.order + 1}}</span>
          <button>X</button>
        </li>
      </ul>
    </div>
    <div class="panel story__editor"></div>
    <div class="panel story__preview"></div>
  </div>
</template>

<script>
  import Story from '@/models/StoryAdmin';

  export default {
    data() {
      return {
        pages: [{
          id: 'some',
          markdown: '',
          created: '',
          author: '',
          lastSaved: '',
          lastPublished: '',
          type: 'story',
          order: 0,
        }],
      };
    },
  }
</script>

<style lang="scss" scoped>
  .story__create {
    display: flex;
    height: 100%;
  }
  .panel {
    flex: 1 0 auto;
  }
</style>
