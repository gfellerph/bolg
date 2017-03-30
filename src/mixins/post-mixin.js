import {states} from '@/config/constants';

export default {
  computed: {
    connected() { return this.$store.state.connection.connected; },
    state() {
      let status = states.LOADING;

      // Return loading if post is falsy
      if (!this.post) {
        return status;
      }

      // Post is edited when lastEdited is bigger than lastSaved and lastPublished
      if (this.post.lastEdited && this.post.lastEdited > this.post.lastSaved && this.post.lastEdited > this.post.lastPublished) {
        status = states.EDITING;
      }

      // Post is saved when lastSaved is bigger than or equal to lastEdited and bigger than lastPublished
      if (this.post.lastSaved && this.post.lastSaved >= this.post.lastEdited && this.post.lastSaved > this.post.lastPublished) {
        status = states.SAVED;
      }

      // Post is published when lastPublished is bigger than or equal to lastEdited and lastSaved
      if (this.post.lastPublished && this.post.lastPublished >= this.post.lastEdited && this.post.lastPublished >= this.post.lastSaved) {
        status = states.PUBLISHED;
      }

      // Alter editing or saved states to offline states
      if (!this.connected) {
        if (status == states.EDITING) status = states.EDITING_OFFLINE;
        if (status == states.SAVED) status = states.SAVED_OFFLINE;
      }

      return status;
    },
  }
};