<template>
  <div class="tipp" @click="closeOverlay" @keydown.esc="closeOverlay">
    <div class="tipp__wrapper" @click.stop>
      <div class="tipp__card">
        <h4 class="tipp__title">Wie heissisch du?</h4>
        <p>
          <input
            ref="nameInput"
            id="username"
            class="username"
            type="text"
            v-model="tipp.user.displayName">
        </p>
        <div class="tipp__meta">
          <span class="tipp__counter">1/3</span>
          <div class="tipp__buttons">
            <button
              class="tipp__forward"
              :disabled="!tipp.user.displayName"
            >
              <img src="/img/arrow-forward.svg" alt="">
            </button>
          </div>
        </div>
      </div>
      <div class="tipp__card">
        <h4 class="tipp__title">Was isch di Tipp, {{tipp.user.displayName}}</h4>
        <p>
          <textarea
            class="tipp__text"
            name="add-tipp"
            id="add-tipp"
            v-model="tipp.text"
          ></textarea>
        </p>
        <div class="tipp__meta">
          <span class="tipp__counter">2/3</span>
          <div class="tipp__buttons">
            <button
              class="tipp__back"
            >
              <img src="/img/arrow-back.svg" alt="">
            </button>
            <button
              class="tipp__forward"
            >
              <img src="/img/arrow-forward.svg" alt="">
            </button>
          </div>
        </div>
      </div>
      <div class="tipp__card">
        <h4 class="card__title">Merci schön</h4>
        <p>
          <input
            id="tipp__email"
            class="tipp__email"
            type="text"
            v-model="tipp.user.email">
        </p>
        <div class="tipp__meta">
          <span class="tipp__counter">3/3</span>
          <div class="tipp__buttons">
            <button
              class="tipp__back"
            >
              <img src="/img/arrow-back.svg" alt="">
            </button>
            <button @click="saveTipp" :disabled="loading || !canSave">Fertig!</button>
          </div>
        </div>
      </div>
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
        step: 0,
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
  @import 'src/styles/convenience';

  .tipp {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .tipp__wrapper {
    width: 300%;
    height: 100%;

    display: flex;
    justify-content: space-around;
    align-items: center;

    transform: translate3d(0,0,0);
    transition: transform 300ms;
  }

  .tipp__card {
    @extend .box;
    background: white;
    padding: 2rem;
    max-width: 80vw;
    overflow: hidden;
    box-shadow: 0 0 40px black;
  }

  .tipp__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
