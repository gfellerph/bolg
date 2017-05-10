<template>
  <div class="markdown-cheatsheet box">
    <h1 class="h3">Markdown Cheatsheet</h1>
    <p>Kompletti liste: <a target="_blank" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">Markdown Cheatsheet</a></p>
    <h4>Headings</h4>
    <pre>
      # Heading 1
      ## Heading 2
      ### Heading 3
      #### Heading 4
      ##### Heading 5
      ###### Heading 6
    </pre>
    <h4>Lists</h4>
    <pre>
      - One
      - Two
      - Three
    </pre>
    <h4>Image grid</h4>
    <pre>
      &lt;div class="picture-grid"&gt;
        ![alt text](https://placehold.it/300x400 "Placeholder")
        ![alt text](https://placehold.it/400x400 "Placeholder")
        ![alt text](https://placehold.it/400x300 "Placeholder")
        ![alt text](https://placehold.it/300x300 "Placeholder")
      &lt;/div&gt;
    </pre>
    <p class="text-align-right">
      <button class="small" @click="closeCheatsheet">Fertig cheatet</button>
    </p>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      };
    },

    methods: {
      closeCheatsheet() {
        this.$emit('closeCheatsheet');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .markdown-cheatsheet {
    background: white;
    padding: $golden-rem * 2;
  }
</style>
