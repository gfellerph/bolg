<template>
  <div class="tipp">
    <div class="tipp__summary box" v-if="!editMode">
      <h2 class="h5">
        <span>{{tipp.user.displayName}}</span>
        <span v-if="tipp.user.email">(<a :href="`mailto:${tipp.user.email}`">{{tipp.user.email}}</a>)</span>
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
        <input type="text" v-model="editTipp.user.displayName">
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
  import Tipp from '@/models/Tipp';

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
        this.editTipp = new Tipp(this.tipp);
        this.editMode = !this.editMode;
      },
      deleteTipp() {
        return confirm('Wosch würk lösche?') ? this.tipp.remove() : false;
      },
      saveTipp() {
        this.editMode = false;
        return this.editTipp.set();
      }
    },
  };
</script>

<style lang="scss" scoped>
  .tipp__text {
    border: 1px solid black;
    padding: 0.5em;
  }
</style>