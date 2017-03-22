<template>
  <div id="app" class="app box">
    <h1>some title <br> with two lines</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus explicabo officia, unde laborum blanditiis maxime hic earum dignissimos, ipsam repellat excepturi, neque, quas reiciendis soluta officiis atque dolorem. Iste, ducimus!</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus explicabo officia, unde laborum blanditiis maxime hic earum dignissimos, ipsam repellat excepturi, neque, quas reiciendis soluta officiis atque dolorem. Iste, ducimus!</p>
    <header class="header">
      <nav>
        <router-link to="/">Overview</router-link>
        <router-link to="/edit">Create post</router-link>
      </nav>
      <profile></profile>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  import Profile from '@/components/Profile';
  import store from '@/config/store';
  import {auth} from '@/config/firebase';

  export default {
    name: 'app',

    created() {
      // Listen to auth changes at firebase
      auth
        .onAuthStateChanged((user) => {

          // Dispatch according to auth state
          if (user) {
            store.commit('LOGIN', { user });
          } else {
            store.commit('LOGOUT');
          }
        });
    },

    components: {
      Profile,
    }
  }
</script>

<style lang="scss">
  @import 'src/styles/_index';

  .app {
    flex-grow: 1;
  }

  main {
    display: flex;
  }
</style>
