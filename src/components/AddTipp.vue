<template>
  <div class="add-tipp" @click="closeOverlay" @keydown.esc="closeOverlay">
    <div class="tipp-wrapper">
      <div class="yellow"></div>
      <form class="tipp-form box" @click.stop>
        <h2 class="h5 tipp-title">
          <input ref="nameInput" v-bind:style="displayNameWidth" id="username" class="username" type="text" v-model="tipp.user.displayName" placeholder="Housi">
          <span ref="mirror" class="mirror">{{tipp.user.displayName}}</span>
          <span>Tipp für {{country}}:</span>
        </h2>
        <textarea
          name="add-tipp"
          id="add-tipp"
          v-model="tipp.text"
        ></textarea>
        <p>
          <input class="email" type="email" v-model="tipp.user.email" placeholder="Email (wed wosch)">
        </p>
        <p class="error" v-if="error">{{error}}</p>
        <p class="text-align-right">
          <button @click="closeOverlay">Abbrechen</button>
          <button @click="saveTipp" :disabled="loading || !canSave">Senden</button>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
  import Tipp from '@/models/Tipp';
  import AuthGuard from '@/components/AuthGuard';
  import GoogleLogin from '@/components/GoogleLogin';

  export default {
    data() {
      return {
        loading: false,
        error: false,
        tipp: new Tipp(),
      };
    },

    props: {
      lat: Number,
      lng: Number,
      country: String,
    },

    computed: {
      user() { return this.$store.state.auth.user; },
      canSave() { return this.tipp.user.displayName && this.tipp.text; },
      displayNameWidth() {
        const width = this.$refs.mirror ? this.$refs.mirror.offsetWidth : 0;
        return `width: ${width}px`;
      }
    },

    methods: {
      saveTipp(event) {
        event.preventDefault();

        this.error = false;
        this.loading = true;
        this.tipp.lat = this.lat;
        this.tipp.lng = this.lng;
        this.tipp.country = this.country;

        this.tipp.set().then(() => {
          this.loading = false;
          this.tipp = new Tipp();
          this.closeOverlay();
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message;
        });
      },
      closeOverlay() {
        this.$emit('tipp-closed');
      },
      
    },

    watch: {
      'tipp.user.displayName': function (newName) {
        const width = this.$refs.mirror ? this.$refs.mirror.offsetWidth : 0;
        this.$nextTick(() => {
          this.$refs.nameInput.style.width = `${width}px`;
        });
        return `width: ${width}px`;
      },
    },

    mounted() {
      document.getElementById('username').focus();
    },

    components: {
      AuthGuard,
      GoogleLogin,
    },
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/_mixins';
  @import 'src/styles/_variables';

  .tipp-title {
    position: relative;
  }

  .mirror {
    position: absolute;
    visibility: hidden;
    z-index: -1;
    pointer-events: none;
    white-space: nowrap;
  }

  .add-tipp {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(white, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .email {
    width: 100%;
  }

  .tipp-wrapper {
    position: relative;

    &:before,
    &:after {
      content: '';
      position: absolute;
    }

    &:before {
      top: -5px;
      right: -6px;
      bottom: -2px;
      left: -4px;
      opacity: 0.4;
      background-color: cyan;
      transform: rotate(0.5deg);
    }

    &:after {
      top: -2px;
      right: -2px;
      bottom: -4px;
      left: -5px;
      opacity: 0.4;
      background-color: magenta;
      transform: rotate(-0.75deg);
    }

    .yellow {
      position: absolute;
      top: -3px;
      right: -3px;
      bottom: -5px;
      left: -2px;
      background: yellow;
    }
  }

  .tipp-form {
    position: relative;
    background: white;
    background: white;
    padding: $golden-rem;
    z-index: 1;
    font-family: $sans-serif;
    
    @include max($xs) {
      max-width: 90vw;
    }

    @include min($xs) {
      max-width: 60vw;
    }

    input {
      display: inline;
      width: auto;
      min-width: 100px;
      padding: $golden-rem / 4 0;
    }

    textarea {
      font-family: inherit;
      font-size: inherit;
      width: 100%;
      height: 20vh;
      border: 1px solid black;
      padding: $golden-rem / 2;
    }
  }
</style>
