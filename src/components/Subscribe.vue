<template>
  <div class="subscribe" @keydown.esc="cancel">
    <h2 class="h3">Benachrichtigunge</h2>
    <div v-if="step==0">
      <p>Wosch es Mail becho we mir e nöii Gschicht gschribe hei? De gib üs doch churz di Name und dini Mail Adrässe aa, mir verspräche o dassmer di nid zuespame und dini Adrässe nid de Chinese verchoufe (vilech).</p>
      <p class="text-align-center">
        <button @click="stepForward">Ou ja, bitte!</button>
      </p>
    </div>
    <div  
      v-if="step==1"
      @blur="errors.has('name') || !subscriber.displayName ? null : stepForward()"
    >
      <p>
        <label for="name">Wie heissisch du?</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          ref="name"
          v-validate="'required'"
          v-model="subscriber.displayName"
        >
      </p>
      <p class="error" v-bind:key="error.id" v-for="error in errors.collect('name')">{{error}}</p>
      <p>
        <label for="mail">Und wie isch dis Email?</label>
        <input
          id="mail"
          name="mail"
          type="email"
          placeholder="Email"
          ref="email"
          v-model="subscriber.email"
          v-validate="'required|email'"
        >
      </p>
      <p class="error" v-bind:key="error.id" v-for="error in errors.collect('mail')">{{error}}</p>
      <p class="text-align-right">
        <button @click="cancel">Doch nid</button>
        <button :disabled="loading || errors.any()" @click="addSubscriber">Schicke</button>
      </p>
    </div>
    <div v-if="step===2" class="subscribe__slide">
      <h3>He merci {{subscriber.displayName}}!</h3>
      <p>Mir schicke dir itz immer es Mail wemer e nöii Gschicht gschribe hei.</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import User from 'src/models/User';

  export default {
    data() {
      return {
        subscriber: new User(),
        step: 0,
        loading: false,
      };
    },

    methods: {
      addSubscriber() {
        this.$validator.validateAll()
          .then((result) => {
            if (!result) throw new Error('Form invalid');
            this.loading = true;
            this.error = false;
            return axios.post('/api/subscriber', this.subscriber.normalize());
          })
          .then(() => {
            this.loading = false;
            this.step = 2;
          })
          .catch(() => {
            this.loading = false;
          });
      },
      stepBack() { this.step -= 1; },
      stepForward() {
        this.step += 1;
        this.$nextTick(() => this.$refs.name.focus());
      },
      cancel() {
        this.step = 0;
        this.subscriber = new User();
      },
    },
  }
</script>
