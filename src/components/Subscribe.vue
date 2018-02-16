<template>
  <div class="subscribe" @keydown.esc="cancel">
    <div class="subscribe__frame">
      <div class="subscribe__form box">
        <h2 class="h5">Benachrichtigunge</h2>
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
          <button :disabled="loading || errors.any()" @click="addSubscriber">Schicke</button>
        </p>
      </div>
      <button class="subscribe__toggler">
        <img src="" alt="">
        <img src="" alt="">
      </button>
    </div>
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

<style lang="scss">
  @import 'src/styles/core/index';

  .subscribe__frame {
    position: fixed;
    bottom: $golden-rem * 2;
    right: $golden-rem * 2;

    border-radius: $golden-rem * 2;
    overflow: hidden;

    width: $golden-rem * 4;
    height: $golden-rem * 4;

    background: dodgerblue;
    transition: all 300ms;

    z-index: 1;

    &:hover {
      width: 24rem;
      height: 28rem;
      border-radius: 3px;
    }
  }

  .subscribe__form {
    position: fixed;
    width: 24rem;
    height: 28rem;
    right: $golden-rem * 2;
    bottom: $golden-rem * 2;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    font-size: 0.85em;
    font-family: 'Roboto', sans-serif;

    .subscribe__frame:hover & {
      pointer-events: auto;
    }

    label,
    h2 {
      margin-top: 0;
    }

    p {
      margin: $golden-rem / 4 0;
    }

    input {
      padding: $golden-rem / 4 0;
    }

    button,
    input {
      border-color: white;
    }
  }

  .subscribe__toggler {
    position: absolute;
    right: $golden-rem;
    bottom: $golden-rem;
    width: $golden-rem * 2;
    height: $golden-rem * 2;
  }
</style>
