<template>
  <div class="add-subscriber">
    <p>
      <label for="add-subscriber-display-name">Name</label>
      <input
        type="text"
        id="add-subscriber-display-name"
        placeholder="Pesche Müller"
        v-model="user.displayName"
      >
    </p>
    <p>
      <label for="add-subscriber-email">Email</label>
      <input
        type="text"
        id="add-subscriber-email"
        placeholder="oeppis@email.com"
        v-model="user.email"
      >
    </p>
    <p v-if="error">{{error}}</p>
    <p>
      <button
        @click="cancelSubscriber"
      >Abbräche</button>
      <button
        @click="saveSubscriber"
        :disabled="loading || error"
      >Spichere</button>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

const UserModel = () => {
  this.displayName = '';
  this.email = '';
}

export default {
  data() {
    return {
      user: new UserModel(),
      error: false,
      loading: false,
    }
  },

  methods: {
    cancelSubscriber() {
      this.error = false;
      this.loading = false;
      this.user = new UserModel();
    },
    saveSubscriber() {
      this.loading = true;
      this.error = false;
      axios.post('/api/subscriber', this.user)
        .then(() => {
          this.loading = false;
          this.error = false;
          this.user = new UserModel();
          this.$emit('subscriber-added');
        })
        .catch((error) => {
          this.loading = false;
          this.error = error.message;
        });
    },
  },
}
</script>
