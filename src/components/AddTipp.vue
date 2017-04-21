<template>
  <div class="add-tipp" @click="closeOverlay">
    <form class="tipp-form" @click.stop>
      <img class="user-image" :src="user.photoURL" alt="">
      <div>
        <h2 class="h5">
          <input type="text" v-model="username">
          <span>'s Tipp für {{country}}:</span>
        </h2>
        <textarea
          name="add-tipp"
          id="add-tipp"
          v-model="tipp.text"
        ></textarea>
        <p class="error" v-if="error">{{error}}</p>
        <p class="text-align-right">
          <button @click="saveTipp" :disabled="loading">Senden</button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
  import Tipp from '@/Models/Tipp';
  import AuthGuard from '@/components/AuthGuard';
  import GoogleLogin from '@/components/GoogleLogin';
  import { reverseGeocode } from '@/config/constants';

  export default {
    data() {
      return {
        loading: false,
        error: false,
        country: '',
        username: '',
        tipp: new Tipp(),
      };
    },

    props: {
      lat: Number,
      lng: Number,
    },

    computed: {
      user() { return this.$store.state.auth.user; }
    },

    methods: {
      saveTipp(event) {
        event.preventDefault();

        this.error = false;
        this.loading = true;
        this.tipp.username = this.username;
        this.tipp.lat = this.lat;
        this.tipp.lng = this.lng;

        this.tipp.set().then(() => {
          this.loading = false;
          this.$emit('tipp-added', this.tipp);
          this.tipp = new Tipp();
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

    created() {
      reverseGeocode(this.lat, this.lng)
        .then(res => {
          if (res.data.results < 1) {
            this.country = 'di witi See';
          } else {
            this.country = res.data.results[0].address_components.filter(component => {
              return component.types.indexOf('country') >= 0;
            })[0].long_name;
          }
        })
        .catch(err => {
          throw err;
        });
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

  .tipp-form {
    display: flex;
    background: white;
    
    @include max($xs) {
      max-width: 90vw;
    }

    @include min($xs) {
      max-width: 60vw;
    }

    img {
      width: 80px;
      height: 80px;
      margin-right: 2rem;
    }

    textarea {
      font-family: inherit;
      width: 100%;
      height: 20vh;
    }
  }
</style>
