<template>
  <div class="post-status">
    <span :class="stateClass">{{message}}</span>
  </div>
</template>


<script>
  import { states, formatDate } from 'src/config/constants';

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
          ? `publiziert am ${formatDate(this.post.lastPublished)}`
          : 'nid publiziert';

        const messages = {
          0: 'i bi am lade...',
          1: 'du schribsch öppis',
          2: `gschpicheret (${lastPublished})`,
          3: 'fähler o.O:',
          4: 'du schribsch öppis (ke netz)',
          5: 'gschpicheret (ke netz)',
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
    font-size: 0.85em;
    color: white;
    font-family: $sans-serif;
    line-height: $golden-rem;
    display: block;
    padding: $golden-rem / 4 $golden-rem / 2;

    &.status-loading {
      background: grey;
    }
    &.status-editing {
      background: gold;
    }
    &.status-saved {
      background: seagreen;
    }
    &.status-published {
      background: royalblue;
    }
    &.status-error {
      background: crimson;
    }
    &.status-editing-offline {
      background: gold;
      opacity: 0.8;
    }
    &.status-saved-offline {
      background: seagreen;
      opacity: 0.8;
    }
  }
</style>
