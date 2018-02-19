<template>
  <div
    class="journey-point-editor floating-form"
    @keypress.enter="save"
  >
    <p>
      <label for="">Datum</label>
      <input
        type="date"
        v-model="journey.inputDate"
      >
    </p>
    <p>
      <label for="">Beschrieb</label>
      <input
        type="text"
        v-model="journey.description"
      >
    </p>
    <button
      :disabled="loading"
      @click="save"
    >Schicke</button>
    <button
      :disabled="loading"
      @click="copy"
    >Kopiere</button>
    <button
      class="journey-point__remove-button"
      :disabled="loading"
      @click="remove"
    >Lösche</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
    }
  },

  props: {
    journey: Object,
  },

  methods: {
    save() {
      this.loading = true;
      axios.put(`/api/journey/${this.journey._id}`, {
        description: this.journey.description,
        date: this.journey.inputDate,
      })
        .then(() => {
          this.error = false;
          this.loading = false;
          this.$emit('journey-update');
        })
        .catch((err) => {
          this.error = err.message;
          this.loading = false;
        })
    },
    copy() {
      this.loading = true;
      axios.post('/api/journey', Object.assign({}, this.journey, {
        _id: undefined,
      }))
        .then(() => {
          this.error = false;
          this.loading = false;
          this.$emit('journey-update');
        })
        .catch((err) => {
          this.error = err.message;
          this.loading = false;
        });
    },
    remove() {
      this.loading = true;
      axios.delete(`/api/journey/${this.journey._id}`)
        .then(() => {
          this.error = false;
          this.loading = false;
          this.$emit('journey-update');
        })
        .catch((err) => {
          this.error = err.message;
          this.loading = false;
        })
    },
  },
}
</script>

<style lang="scss" scoped>
  @import 'src/styles/core/_index';

  .journey-point-editor {
    padding: 0 $golden-rem/3;
    border: 1px solid lightgray;
    border-radius: 10px;
    margin: $golden-rem/2 auto;
    display: flex;
    align-items: center;

    button {
      flex: 0 1 auto;
      padding: $golden-rem/4;
    }

    input {
      border-bottom: none;
    }

    p {
      flex: 2 0 auto;
      border-bottom: none;

      & + p,
      & + button {
        border-left: 1px solid lightgray;
      }
    }
  }

  .journey-point__remove-button {
    background: crimson;
    color: white;
  }
</style>

