<template>
  <div class="editor">
    <nav class="controls">
      <div class="left-controls">
        <button class="bold small" @click="bolden" title="Bold">B</button>
        <button class="italic small" @click="pizzaparty" title="Italic">I</button>
        <button class="small" @click="toggleYoutubeEmbed" title="YouTube">YT</button>
        <button class="small" @click="insertPictureGrid" title="Picture Grid">PG</button>
        <label><input type="checkbox" v-model="autoscroll">autoscroll</label>
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
    ></textarea>
    <div class="mirror" ref="mirror" v-html="startToCursor"></div>
    <div class="mirror" ref="mirrorRef" v-html="entireText"></div>
    <div class="youtube-embed box" :class="{show: showYoutubeEmbed}">
      <h4>Tue dr iFrame Embed Code hie drii:</h4>
      <input type="text" v-model="youtubeEmbed" id="youtube-embed" >
      <p class="text-align-right">
        <button class="small" @click="toggleYoutubeEmbed">Doch nid</button>
        <button class="small" @click="youtubeInsert">Guet</button>
      </p>
    </div>
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
        showYoutubeEmbed: false,
        youtubeEmbed: '',
        autoscroll: false,
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
      bolden() {
        const { md } = this.$refs;
        const start = md.selectionStart;
        const end = md.selectionEnd;
        const newMarkdown = this.toggle(this.markdown, '**', '**', start, end);
        const modifier = this.markdown.length < newMarkdown.length ? 4 : -4;
        this.markdown = newMarkdown;
        this.change();
        this.$nextTick(() => {
          md.setSelectionRange(start, end + modifier);
          md.focus();
        });
      },
      pizzaparty() {
        const { md } = this.$refs;
        const start = md.selectionStart;
        const end = md.selectionEnd;
        const newMarkdown = this.toggle(this.markdown, '_', '_', start, end);
        const modifier = this.markdown.length < newMarkdown.length ? 2 : -2;
        this.markdown = newMarkdown;
        this.change();
        this.$nextTick(() => {
          md.setSelectionRange(start, end + modifier);
          md.focus();
        });
      },
      insertPictureGrid() {
        const md = this.$refs.md;
        const start = md.selectionStart;
        const template = `<div class="picture-grid">\n</div>\n\n<p class="picture-subtitle"></p>`;
        this.markdown = `${this.markdown.slice(0, start)}${template}${this.markdown.slice(start, this.markdown.length)}`;
        this.change();
        this.$nextTick(() => {
          md.setSelectionRange(start + 26, start + 26);
          md.focus();
        });
      },
      youtubeInsert() {
        const { md } = this.$refs;
        const start = md.selectionStart;
        const stringToInsert = `\n<div class="video-wrapper">${this.youtubeEmbed}</div>\n`;
        this.markdown = [this.markdown.slice(0, start), stringToInsert, this.markdown.slice(start)].join('');
        this.youtubeEmbed = '';
        this.toggleYoutubeEmbed();
        this.change();
        this.$nextTick(() => {
          md.setSelectionRange(start + 1, start + stringToInsert.length);
          md.focus();
        });
      },
      toggleYoutubeEmbed() {
        this.showYoutubeEmbed = !this.showYoutubeEmbed;
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
        if (!this.autoscroll) return;
        const { target } = event;
        const percent = target.scrollTop / (target.scrollHeight - target.clientHeight);
        this.$emit('scroll', percent);
      },
      toggleClippy() {
        this.$emit('help');
      },
      cursorPositionChanged() {
        this.startToCursor = this.markdown.substring(0, this.$refs.md.selectionStart)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br>');
        this.entireText = this.markdown
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br>');
        this.$nextTick(() => {
          const textareaHeight = this.$refs.mirrorRef.scrollHeight;
          const mirrorHeight = this.$refs.mirror.scrollHeight;
          let percent = mirrorHeight / textareaHeight;
          if (percent > 0.95) percent = 1;
          this.$emit('scroll', percent);
        });
      },
    },

    created() {
      this.$watch('value', () => {
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
      align-items: center;
    }

    button {
      display: block;
      border: none;
      margin-left: 0;
      min-width: 2rem;
      text-align: center;
    }

    label {
      margin: 0;
    }

    input[type="checkbox"] {
      margin: 0 $golden-rem / 4;
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

  .youtube-embed {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 80%;
    transform: translate(-50%, -50%);
    background: white;
    // border: 1px solid black;
    box-shadow: 0 0 20px rgba(black, 0.7);
    padding: $golden-rem;

    font-family: $sans-serif;

    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s, visibility 0s 0.5s;

    &.show {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.5s, visibility 0s 0s;
    }
  }
</style>
