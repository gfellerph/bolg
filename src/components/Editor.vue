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
      v-model="markdown"
      @input="change"
      ref="md"
      @keydown="keydown"
      @scroll="scroll"
      @keyup="cursorPositionChanged"
      @click="cursorPositionChanged"
      @focus="cursorPositionChanged"
    ></textarea>
    <div class="mirror" ref="mirror" v-html="startToCursor"></div>
    <div class="mirror" ref="mirrorRef" v-html="entireText"></div>
  </div>
</template>

<script>
  let lastValue = '';

  export default {
    data() {
      return {
        markdown: this.value,
        cursorPositionPercent: 0,
        cursorLine: 0,
        selectionStart: 0,
        startToCursor: '',
        entireText: '',
      };
    },

    props: {
      value: String,
    },

    methods: {
      toggle(str, head, tail, start, end) {
        let toggled = '';
        const regex = new RegExp(`[${head}].+[${tail}]`, 'g');
        const selected = str.slice(start, end);

        if (!selected) return str;

        if (str.substring(start, end).match(regex)) {
          toggled = [str.slice(0, start), str.slice(start, end).replace(head, '').replace(tail, ''), str.slice(end, str.length)].join('');
        } else {
          toggled = [str.slice(0, start), head, str.slice(start, end), tail, str.slice(end, str.length)].join('')
        }

        return toggled;
      },
      bolden(e) {
        const md = this.$refs.md;
        const start = md.selectionStart;
        const end = md.selectionEnd;
        this.markdown = this.toggle(this.markdown, '**', '**', start, end);
        this.change();
        this.$nextTick(() => {
          md.setSelectionRange(start, end);
          md.focus();
        });
      },
      pizzaparty() {
        const md = this.$refs.md;
        this.markdown = this.toggle(this.markdown, '_', '_', md.selectionStart, md.selectionEnd);
        this.keyup();
      },
      change() {
        if (this.markdown !== lastValue) {
          lastValue = this.markdown;
          this.$emit('input', this.markdown);
        }
      },
      keydown(event) {
        // Save on ctrl+s
        if (event.key === 's' && event.ctrlKey) {
          event.preventDefault();
          this.$emit('save');
        }

        // Toggle bold on ctrl+b
        if (event.key === 'b' && event.ctrlKey) {
          event.preventDefault();
          this.bolden();
        }
      },
      scroll(event) {
        const target = event.target;
        const percent = target.scrollTop / (target.scrollHeight - target.clientHeight);
        this.$emit('scroll', percent);
      },
      toggleClippy() {},
      cursorPositionChanged(event) {
        this.startToCursor = this.markdown.substring(0, this.$refs.md.selectionStart)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, '<br>');
        this.entireText = this.markdown
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, '<br>');
        this.$nextTick(function () {
          const textareaHeight = this.$refs.mirrorRef.scrollHeight;
          const mirrorHeight = this.$refs.mirror.scrollHeight;
          let percent = mirrorHeight / textareaHeight;
          if (percent > 0.95) percent = 1;
          this.$emit('scroll', percent);
        });
      },
    },

    created() {
      this.$watch('value', function () {
        this.markdown = this.value;
      });
    },

    mounted() {
      this.selectionStart = this.$refs.md ? this.$refs.md.selectionStart : 0;
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .mirror {
    position: absolute;
    top: 37.31px;
    left: 0;
    right: 0;
    height: auto;
    width: 100%;
    padding: 0 $golden-rem / 2;
    z-index: -1;
    visibility: hidden;
  }

  .mirror,
  textarea {
    font-family: monospace;
    font-size: 12px;
    line-height: 1.3em;
    letter-spacing: 0;
    overflow-y: scroll;
  }

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
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
  }

  textarea {
    display: flex;
    flex: 1 0 auto;
    width: 100%;
  }
</style>
