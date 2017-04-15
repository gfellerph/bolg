<template>
  <div class="editor">
    <nav class="controls">
      <div class="left-controls">
        <button class="bold small" @click="bolden">B</button>
        <button class="italic small" @click="pizzaparty">I</button>
      </div>
      <div class="right-controls">
        <button class="help bold small" @click="toggleClippy">?</button>
      </div>
    </nav>
    <textarea
      id="markdown-editor"
      name="markdown-editor"
      v-model="post.markdown"
      ref="markdownEditor"
      @keyup="keyup"
      @scroll="scroll"
    ></textarea>
  </div>
</template>

<script>
  let lastMarkdown = '';

  export default {
    data() {
      return {
        lastCursorPosition: 0,
      };
    },

    props: {
      post: Object,
    },

    computed: {
      hasTitle() {
        return !!this.post.title;
      }
    },

    methods: {
      bolden() {

      },
      pizzaparty() {

      },
      keyup() {
        if (this.post.markdown !== lastMarkdown) {
          lastMarkdown = this.post.markdown;
          this.$emit('change', this.post.markdown);
        }
      },
      scroll(event) {
        const target = event.target;
        const percent = target.scrollTop / (target.scrollHeight - target.clientHeight);
        this.$emit('scroll', percent);
      },
      toggleClippy() {

      },
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .controls {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid black;

    .left-controls,
    .right-controls {
      display: flex;
    }

    button {
      display: block;
      border: none;
      margin-left: 0;
      min-width: 2rem;
      text-align: center;
    }

    .left-controls {
      button {
        border-right: 1px solid black;
      }
    }

    .right-controls {
      button {
        border-left: 1px solid black;
      }
    }
  }

  .editor {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  textarea {
    display: flex;
    flex: 1 0 auto;
    width: 100%;
  }
</style>
