<template>
  <div class="subscribe" @keydown.esc="cancel">
    <h2 class="h4">Wosch es Mail becho we mir e nöii Gschicht gschribe hei?</h2>
    <p>De gib üs doch churz di Name und dini Mail Adrässe ah, mir verspräche o dassmer di nid zuespame und dini Adrässe nid de Chinese verchoufe (vilech).</p>
    <div v-if="step===0" class="text-align-center">
      <button @click="stepForward">Ou ja, bitte!</button>
    </div>
    <div  
      v-if="step===1"
      @blur="errors.has('name') || !subscriber.displayName ? null : stepForward()"
    >
      <p>
        <label for="name">Wie heissisch du?</label>
        <input
          id="name"
          name="name"
          type="text"
          v-validate="'required'"
          v-model="subscriber.displayName"
        >
      </p>
      <p class="error" v-bind:key="error.id" v-for="error in errors.collect('name')">{{error}}</p>
      <p>
        <label for="mail">Email</label>
        <input
          id="mail"
          name="mail"
          type="email"
          v-model="subscriber.email"
          v-validate="'required|email'"
        >
      </p>
      <p class="error" v-bind:key="error.id" v-for="error in errors.collect('mail')">{{error}}</p>
      <p class="text-align-right">
        <button @click="cancel">Doch nid</button>
        <button :disabled="loading || errors.any()" @click="addSubscriber">
          <img src="/img/arrow-forward.svg" alt="">
        </button>
      </p>
    </div>
    <div v-if="step===2" class="subscribe__slide">
      <h3>He merci {{subscriber.displayName}}!</h3>
      <p>Mir schicke dir itz immer es Mail wemer e nöii Gschicht schribe</p>
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
          return this.subscriber.set();
        })
        .then(() => {
          this.loading = false;
          this.stepForward();
        })
        .catch(error => {
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
