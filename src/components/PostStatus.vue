<template>
  <span class="post-status" :class="stateClass">{{message}}</span>
</template>


<script>
  import { states } from 'src/config/constants';

  const classes = {
    0: 'loading',
    1: 'editing',
    2: 'saved',
    3: 'error',
    4: 'editing-offline',
    5: 'saved-offline',
    6: 'published',
  };

  export default {
    data() {
      return {};
    },

    props: {
      post: Object,
    },

    computed: {
      connected() { return this.$store.state.connection.connected; },
      stateClass() {
        return `status-${classes[this.state]}`;
      },
      message() {
        const lastPublished = this.post.lastPublished
          ? 'publiziert'
          : 'nid publiziert';

        const messages = {
          0: 'i bi am lade...',
          1: 'schribe',
          2: `gspicheret (${this.post.lastPublished ? 'publ.' : 'nid publ.'})`,
          3: 'fähler o.O:',
          4: 'schribe (ke netz)',
          5: 'gspicheret (ke netz)',
          6: lastPublished,
        }

        return messages[this.state];
      },
      state() {
        let status = states.LOADING;

        // Return loading if post is falsy
        if (!this.post) {
          return status;
        }

        // Post is edited when lastEdited is bigger than lastSaved and lastPublished
        if (this.post.lastEdited
          && this.post.lastEdited > this.post.lastSaved
          && this.post.lastEdited > this.post.lastPublished) {
          status = states.EDITING;
        }

        // Post is saved when lastSaved is bigger than or equal to
        // lastEdited and bigger than lastPublished
        if (this.post.lastSaved
          && this.post.lastSaved >= this.post.lastEdited
          && this.post.lastSaved > this.post.lastPublished) {
          status = states.SAVED;
        }

        // Post is published when lastPublished is bigger than or equal to lastEdited and lastSaved
        if (this.post.lastPublished
          && this.post.lastPublished >= this.post.lastEdited
          && this.post.lastPublished >= this.post.lastSaved) {
          status = states.PUBLISHED;
        }

        // Alter editing or saved states to offline states
        if (!this.connected) {
          if (status === states.EDITING) status = states.EDITING_OFFLINE;
          if (status === states.SAVED) status = states.SAVED_OFFLINE;
        }

        return status;
      },
    },
  };
</script>


<style lang="scss" scoped>
  @import 'src/styles/core/_index';

  span {
    font-family: $sans-serif;
  }
</style>
