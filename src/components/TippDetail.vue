<template>
  <div class="tipp">
    <div class="tipp__summary box" v-if="!editMode">
      <h2 class="h5">
        <span>{{tipp.name}}</span>
        <span v-if="tipp.email">(<a :href="`mailto:${tipp.email}`">{{tipp.email}}</a>)</span>
        <br>
        <time class="tipp__created">{{dateFormat(tipp.created, 'dd.mm.yy')}}</time>
      </h2>
      <p>{{tipp.text}}</p>
      <p>
        <button class="small" @click="deleteTipp">Delete</button>
        <button class="small" @click="toggleEditMode">Edit</button>
      </p>
    </div>
    <div class="tipp__edit-form box" v-if="editMode">
      <p>
        <label for="">Name</label>
        <input type="text" v-model="editTipp.name">
      </p>
      <p>
        <label for="">Tipp Text</label>
        <textarea class="tipp__text" type="text" v-model="editTipp.text"></textarea>
      </p>
      <p>
        <button class="small" @click="toggleEditMode">Abbräche</button>
        <button class="small" @click="saveTipp">Spichere</button>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import dateFormat from 'dateformat';

  export default {
    data() {
      return {
        editMode: false,
        editTipp: null,
      }
    },
    props: {
      tipp: Object,
    },
    methods: {
      toggleEditMode() {
        this.editTipp = this.tipp;
        this.editMode = !this.editMode;
      },
      deleteTipp() {
        /* eslint no-alert: 0 */
        /* eslint no-restricted-globals: 0 */
        if (confirm('Wosch würk lösche?')) {
          axios.delete(`/api/tipp/${this.tipp._id}`)
            .then(() => this.$emit('deletetipp', this.tipp._id));
        }
      },
      saveTipp() {
        this.editMode = false;
        axios.put(`/api/tipp/${this.tipp._id}`, this.editTipp)
          .then((newTipp) => { this.$emit('updatetipp', newTipp); });
      },
      dateFormat,
    },
  };
</script>

<style lang="scss" scoped>
  .tipp__text {
    border: 1px solid black;
    padding: 0.5em;
  }

  .tipp__created {
    font-style: italic;
    color: grey;
    font-size: 0.9em;
  }
</style>
