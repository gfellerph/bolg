<template>
  <div class="subscribe">
    <h2 class="h4">Wosch es Mail becho we mir e nöii Gschicht schribe?</h2>
    <p>De gib üs doch churz di Name und dini Mail Adrässe ah, mir verspräche o dassmer di nid zuespame und dini Adrässe nid de Chinese verchoufe (vilech).</p>
    <div class="subscribe__form" :style="stepOffset">
      <div class="subscribe__slide text-align-center">
        <button @click="stepForward">Ou ja, bitte!</button>
      </div>
      <div class="subscribe__slide">
        <p>
          <label for="name">Wie heissisch du?</label>
          <input
            id="name"
            name="name"
            type="text"
            v-model="subscriber.displayName"
          >
        </p>
        <p class="error"></p>
        <p class="text-align-right">
          <button @click="cancel">Doch nid</button>
          <button @click="stepForward">
            <img src="/img/arrow-forward.svg" alt="">
          </button>
        </p>
      </div>
      <div class="subscribe__slide">
        <p>
          <label for="mail">Email</label>
          <input
            id="mail"
            name="mail"
            type="email"
            v-model="subscriber.email"
          >
        </p>
        <p class="error"></p>
        <p class="text-align-right">
          <button @click="stepBack">
            <img src="/img/arrow-back.svg" alt="">
          </button>
          <button :disabled="loading" @click="addSubscriber">
            <img src="/img/arrow-forward.svg" alt="">
          </button>
        </p>
      </div>
      <div class="subscribe__slide">
        <h3>He merci {{subscriber.displayName}}!</h3>
        <p>Mir schicke dir itz immer es Mail wemer e nöii Gschicht schribe</p>
      </div>
    </div>
  </div>
</template>

<script>
  import Subscriber from '@/models/Subscriber';

  export default {
    data() {
      return {
        subscriber: new Subscriber(),
        step: 0,
        steps: 4,
        loading: false,
        error: false,
      };
    },

    computed: {
      stepOffset() { return `
        width: ${this.steps * 100}%;
        transform: translate3d(${this.step * -100/this.steps}%, 0, 0);
      `},
    },

    methods: {
      addSubscriber() {
        this.loading = true;
        this.error = false;
        this.subscriber
          .set()
          .then(() => {
            this.error = false;
            this.loading = false;
            this.stepForward();
          })
          .catch(error => {
            this.error = error;
            this.loading = false;
          });
      },
      stepBack() { this.step -= 1; },
      stepForward() { this.step += 1; },
      cancel() {
        this.step = 0;
        this.subscriber = new Subscriber();
       },
    },
  }
</script>

<style lang="scss">
  .subscribe {
    overflow: hidden;
  }
  .subscribe__form {
    display: flex;
    transition: transform 0.3s;
  }

  .subscribe__slide {
    overflow: hidden;
    flex: 1 0 25%;
  }
</style>
