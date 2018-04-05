<template>
  <div class="editor">
    <nav class="controls">
      <div class="left-controls">
        <button class="bold small" @click="bolden" title="Bold">B</button>
        <button class="italic small" @click="pizzaparty" title="Italic">I</button>
        <button class="small" @click="toggleYoutubeEmbed" title="YouTube">YT</button>
        <button class="small" @click="insertPictureGrid" title="Picture Grid">PG</button>
        <input
          type="date"
          :value="post.postDate"
          @change="setPostDate"
        />
      </div>
      <div class="right-controls">
        <button class="help bold small" @click="toggleClippy">?</button>
      </div>
    </nav>
    <textarea
      id="markdown-editor"
      name="markdown-editor"
      :value="post.markdown"
      @input="change"
      ref="md"
      @keydown="keydown"
    ></textarea>
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
  import bus from 'src/config/bus';
  import { mapState } from 'vuex';

  let lastValue = '';

  export default {
    data() {
      return {
        cursorPositionPercent: 0,
        cursorLine: 0,
        selectionStart: 0,
        startToCursor: '',
        entireText: '',
        showYoutubeEmbed: false,
        youtubeEmbed: '',
      };
    },

    computed: {
      ...mapState({
        post: state => state.post.post,
      }),
    },

    mounted() {
      this.selectionStart = this.$refs.md ? this.$refs.md.selectionStart : 0;
      bus.$on('insert-image', this.insertImage);
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
        const { md } = this.$refs;
        const start = md.selectionStart;
        const startLB = this.markdown.charAt(start - 1) === '\n';
        const template = `${startLB ? '' : '\n'}<figure>\n\n<figcaption></figcaption>\n</figure>${this.markdown.charAt(start) === '\n' ? '' : '\n'}`;
        this.markdown = `${this.markdown.slice(0, start)}${template}${this.markdown.slice(start, this.markdown.length)}`;
        this.change();
        this.$nextTick(() => {
          const offset = start + 8 + (startLB ? 1 : 0);
          md.setSelectionRange(offset, offset);
          md.focus();
        });
      },
      insertImage(url) {
        const { md } = this.$refs;
        const start = md.selectionStart;
        const startLB = this.markdown.charAt(start - 1) === '\n';
        const endLB = this.markdown.charAt(start) === '\n';
        const image = `${startLB ? '' : '\n'}![Bildbeschrieb](${url})${endLB ? '' : '\n'}`;
        this.markdown = `${this.markdown.slice(0, start)}${image}${this.markdown.slice(start, this.markdown.length)}`;
        this.change();
        this.$nextTick(() => {
          const newPosition = start + image.length;
          md.setSelectionRange(newPosition, newPosition);
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
      change(event) {
        if (event.target.value !== lastValue) {
          lastValue = event.target.value;
          this.$emit('input', event.target.value);
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
      toggleClippy() {
        this.$emit('help');
      },
      setPostDate(event) {
        this.$store.commit('POST_SET_DATE', event.target.value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/core/_index';

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
