<template>
  <div class="story__create">
    <div class="panel story__pages-panel">
      <div class="story__page-controls">
        <button>Add page</button>
        <p class="story__title">
          <label for="story__title">Titel:</label>
          <input
            id="story__title"
            type="text"
            v-model="storyTitle"
          >
        </p>
      </div>
      <ul class="story__page-list">
        <li v-for="page in story.pages">
          <span>Site {{$index}}</span>
          <button v-if="$index">X</button>
        </li>
      </ul>
    </div>
    <div class="panel story__editor">
      <Editor />
    </div>
    <div class="panel story__preview"></div>
  </div>
</template>

<script>
  import debounce from 'debounce';
  import Story from '@/models/StoryAdmin';
  import Editor from '@/components/Editor';

  export default {
    data() {
      return {
        story: new Story(),
        storyTitle: '',
        activePage: 0,
      };
    },

    methods: {
      getStory() {
        return new Story();
      },
      saveStory(markdown) {
        this.story.pages[this.activePage].markdown = markdown;
        this.story.lastEdited = Date.now();
        this.debouncedSave();
      },
      debouncedSave: debounce(function () {
        this.savePostImmediately();
      }, 1000),
      savePostImmediately() {
        this.post.set().then(() => {
          if (this.$route.fullPath == '/create') router.replace(`/edit/${this.post.id}`);
        });
      },
    },

    created() {
      if (this.$route.params && this.$route.params.id) {
        this.getStory(this.$route.params.id);
      }
    },

    watch: {
      $route (to, from) {
        if (to.params.id) {
          this.getStory(to.params.id);
        } else {
          this.post = new Post();
        }
      }
    },

    components: {
      Editor,
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    flex-direction: column;
  }

  .story__create {
    display: flex;
    flex: 1 0 auto;
  }

  .panel {
    flex: 1 0 auto;

    & + .panel {
      border-left: 1px solid black;
    }
  }
</style>
