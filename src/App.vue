<template>
  <div id="app" class="app box">
    <header class="header">
      <nav>
        <router-link class="button" to="/">Overview</router-link>
        <router-link class="button" to="/create">Create post</router-link>
        <router-link class="button" to="/map">Map</router-link>
      </nav>
      <img class="logo" :src="logoURL" alt="">
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
  import { auth, database } from '@/config/firebase';

  export default {
    name: 'app',

    computed: {
      logoURL() {
        return `/img/bisnaer${parseInt(Math.random() * 31)}.png`;
      },
    },

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

      database
        .ref('.info/connected')
        .on('value', function (snapshot) {
          if (snapshot.val()) {
            store.commit('ONLINE');
          } else {
            store.commit('OFFLINE');
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
    border-bottom: 1px solid black;
    padding: $golden-em / 2;
  }
  
  .logo {
      height: 2.5rem;
  }
</style>
