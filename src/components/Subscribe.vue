<template>
  <div class="subscribe" @keydown.esc="cancel">
    <button
      class="subscribe__toggler map__box"
      :class="{ hidden: togglerHidden }"
      @click="toggleForm"
    >
      <img v-show="formClosed" src="/img/brief.png" alt="Brief">
      <img v-show="!formClosed" src="/img/brief_offe.png" alt="Brief offe">
    </button>
    <div
      class="subscribe__form map__box floating-form"
      :class="{ closed: formClosed }"
    >
      <div class="field">
        <h2 class="h4 text-align-center">Emails...</h2>
        <p>jedes mau wes e nöii Gschicht het.<br>Was gits schöners?</p>
      </div>
      <p>
        <label for="name">Wie heissisch du?</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          ref="name"
          v-validate="'required'"
          v-model="subscriber.name"
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
      <p
        class="error"
        v-bind:key="error.id" v-for="error in errors.collect('mail')"
      >{{error}}</p>
      <p class="error" v-if="error">{{error}}</p>
      <p class="floating-form__controls">
        <button @click="cancel">Abbräche</button>
        <button :disabled="loading || errors.any()" @click="addSubscriber">Schicke</button>
      </p>
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
        error: false,
        formClosed: true,
        togglerHidden: true,
      };
    },

    mounted() {
      this.showOrHideToggler();
      document.addEventListener('scroll', this.showOrHideToggler, { passive: true });
    },

    methods: {
      showOrHideToggler() {
        const ash = window.screen.availHeight / 2;
        const dest = document.documentElement.scrollTop;
        this.togglerHidden = ash > dest;
      },
      addSubscriber() {
        this.$validator.validateAll()
          .then((result) => {
            if (!result) throw new Error('Öppis isch nid richtig');
            this.loading = true;
            this.error = false;
            return axios.post('/api/subscriber', this.subscriber.normalize());
          })
          .then(() => {
            this.error = false;
            this.loading = false;
            this.subscriber = new User();
            this.cancel();
          })
          .catch((err) => {
            this.error = err.message;
            this.loading = false;
          });
      },
      cancel() {
        this.formClosed = true;
        this.subscriber = new User();
      },
      openForm() {
        this.errors.clear();
        this.formClosed = false;
        this.$nextTick(() => this.$refs.name.focus());
      },
      toggleForm() {
        if (this.formClosed) {
          this.openForm();
        } else {
          this.cancel();
        }
      },
    },
  }
</script>

<style lang="scss">
  @import 'src/styles/core/index';

  .subscribe__form {
    position: fixed;
    right: $golden-rem * 6;
    bottom: $golden-rem * 1;
    transform: scale(1);
    transition:
      transform 400ms cubic-bezier(.16,.63,.18,1.3),
      opacity 400ms cubic-bezier(.16,.63,.18,1.3),
      visibility 0s 0s;
    will-change: transform, opacity;
    visibility: visible;
    z-index: 2;

    @include max($xxs) {
      right: $golden-rem/2;
      bottom: $golden-rem/2;
      left: $golden-rem/2;
    }

    &.closed {
      opacity: 0;
      // visibility: hidden;
      transform: scale(0);
      transition:
        transform 200ms ease-in,
        opacity 200ms ease-in,
        visibility 0s 200ms;
    }

    h2 {
      margin: $golden-rem/2 auto $golden-rem/4;
    }
  }

  .subscribe__toggler {
    position: fixed;
    right: $golden-rem * 2;
    bottom: $golden-rem * 2;

    display: flex;
    width: $golden-rem * 3;
    height: $golden-rem * 3;
    padding: $golden-rem/8;

    border-radius: 100%;
    border: none;

    transition: opacity 500ms, visibility 0s 0s;

    z-index: 1;

    @include max($xxs) {
      right: $golden-rem/2;
      bottom: $golden-rem/2;
    }

    &.hidden {
      opacity: 0;
      visibility: hidden;
      transition: opacity 500ms, visibility 0s 500ms;
    }
  }
</style>
