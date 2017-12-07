<template>
  <div class="story__create">
    <div class="panel story__pages-panel">
      <div class="story__meta-panel">
        <div class="story__page-controls">
          <button @click="addPage">Add page</button>
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
          <li
            class="story__page"
            v-bind:key="page.id"
            v-for="(page, index) in story.pages"
            @click="switchPage(index)"
            :class="{'story__page--active': index == activePage}"
          >
            <span>Site {{index + 1}}</span>
            <button v-if="index" @click="removePage(index)">X</button>
          </li>
        </ul>
      </div>
      <PostStatus :post="story"></PostStatus>
    </div>
    <div class="panel story__editor">
      <Editor />
    </div>
    <div class="panel story__preview"></div>
  </div>
</template>

<script>
  import debounce from 'debounce';
  import Story from 'src/models/StoryAdmin';
  import StoryPage from 'src/models/StoryPage';
  import Editor from 'src/components/Editor';
  import PostStatus from 'src/components/PostStatus';
  import Post from 'src/models/Post';
  import router from 'src/config/router';

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
      addPage() {
        this.story.pages.push(new StoryPage());
      },
      removePage(index) {
        this.story.pages.splice(index, 1);
      },
      switchPage(index) {
        if (this.activePage !== index) this.activePage = index;
      },
      saveStory(markdown) {
        this.story.pages[this.activePage].markdown = markdown;
        this.story.lastEdited = Date.now();
        this.debouncedSave();
      },
      debouncedSave: debounce(() => {
        this.savePostImmediately();
      }, 1000),
      savePostImmediately() {
        this.post.set().then(() => {
          if (this.$route.fullPath === '/create') router.replace(`/edit/${this.post.id}`);
        });
      },
    },

    created() {
      if (this.$route.params && this.$route.params.id) {
        this.getStory(this.$route.params.id);
      } else {
        this.story.set();
      }
    },

    watch: {
      $route(to) {
        if (to.params.id) {
          this.getStory(to.params.id);
        } else {
          this.post = new Post();
        }
      },
    },

    components: {
      Editor,
      PostStatus,
    },
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

  .story__pages-panel {
    display: flex;
    flex-direction: column;
  }

  .story__meta-panel {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
  }

  .story__page-list {
    margin: 0;
    padding-left: 0;
    list-style: none;
  }

  .story__page {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    border-bottom: 1px solid black;

    &--active {
      background: rgba(black, 0.3);
    }

    span {
      flex: 1 0 auto;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    button {
      flex: 0 0 auto;
    }
  }
</style>
