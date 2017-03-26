<template>
  <div id="app" class="app box">
    <header class="header">
      <nav>
        <router-link class="button" to="/">Overview</router-link>
        <router-link class="button" to="/create">Create post</router-link>
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

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
