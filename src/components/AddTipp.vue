<template>
  <div class="tipp" @click="closeOverlay" @keydown.esc="closeOverlay">
    <div class="tipp__wrapper" :style="stepOffset">
      <div class="tipp__slide">
        <div class="tipp__card" @click.stop>
          <h4 class="tipp__title">Wie heissisch du?</h4>
          <p>
            <input
              ref="nameInput"
              id="username"
              class="username"
              type="text"
              v-model="tipp.user.displayName"
              placeholder="Name">
          </p>
          <div class="tipp__meta">
            <span class="tipp__counter">1/3</span>
            <div class="tipp__buttons">
              <button
                class="tipp__forward"
                @click="stepForward"
                :disabled="!tipp.user.displayName"
              >
                <img src="/img/arrow-forward.svg" alt="">
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="tipp__slide">
        <div class="tipp__card" @click.stop>
          <h4 class="tipp__title">Was isch di Tipp, {{tipp.user.displayName}}?</h4>
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
                @click="stepBack"
              >
                <img src="/img/arrow-back.svg" alt="">
              </button>
              <button
                class="tipp__forward"
                @click="stepForward"
                :disabled="!tipp.text"
              >
                <img src="/img/arrow-forward.svg" alt="">
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="tipp__slide">
        <div class="tipp__card" @click.stop>
          <h4 class="tipp__title">Merci schön</h4>
          <p class="italic">Wed wosch chasch no dis Email agä, de chöi mir dir antworte. Muesch aber o nid.</p>
          <p>
            <input
              id="tipp__email"
              class="tipp__email"
              type="text"
              v-model="tipp.user.email"
              placeholder="Email">
          </p>
          <div class="tipp__meta">
            <span class="tipp__counter">3/3</span>
            <div class="tipp__buttons">
              <button
                class="tipp__back"
                @click="stepBack"
              >
                <img src="/img/arrow-back.svg" alt="">
              </button>
              <button
                @click="saveTipp"
                :disabled="loading || !canSave"
              >Fertig!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Tipp from 'src/models/Tipp';

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
      stepOffset() { return `transform: translate3d(${(this.step * -100) / 3}%, 0, 0);` },
    },

    methods: {
      saveTipp(event) {
        event.preventDefault();

        this.error = false;
        this.loading = true;
        this.tipp.lat = this.lat;
        this.tipp.lng = this.lng;
        this.tipp.country = this.country;

        this.tipp.set()
          .then(() => {
            this.loading = false;
            this.tipp = new Tipp();
            this.closeOverlay();
          })
          .catch((err) => {
            this.loading = false;
            this.error = err.message;
          });
      },
      closeOverlay() { this.$emit('tipp-closed'); },
      stepBack() { this.step -= 1; },
      stepForward() { this.step += 1; },
    },

    mounted() {
      document.getElementById('username').focus();
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
    display: flex;
    width: 300%;
    height: 100%;

    transform: translate3d(0,0,0);
    transition: transform 300ms;
  }

  .tipp__slide {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: percentage(1/3);
    height: 100%;
    padding: 0 2rem;
  }

  .tipp__card {
    @extend .box;
    background: white;
    padding: 2rem;
    max-width: 45rem;
    overflow: hidden;
    box-shadow: 0 0 40px black;
  }

  .tipp__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tipp__title {
    text-align: center;
  }

  .tipp__text {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    min-height: 100px;
    border: 1px solid black;
    padding: 0.5rem;
  }

  .tipp__buttons {
    display: flex;

    button {
      display: block;
      padding: 0;
      border: none;

      & + button {
        margin-left: 2rem;
      }
    }

    img {
      display: block;
      height: 24px;
    }
  }
</style>
