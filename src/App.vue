<template>
  <div id="app" class="app box">
    <header class="header">
      <nav class="navigation">
        <input type="checkbox" id="nav">
        <label for="nav"><img src="/img/menu.svg" alt="Menu"></label>
        <label for="nav" class="navigation__closer"></label>
        <div class="offcanvas">
          <label for="nav" class="navigation__mini-closer">
            <img style="width: 24px;" src="/img/close.svg" alt="">
          </label>
          <router-link to="/">Overview</router-link>
          <router-link to="/createpost">Create post</router-link>
          <router-link to="/map">Map</router-link>
          <router-link to="/tipps">Tipps</router-link>
          <router-link to="/drawings">Drawings</router-link>
          <router-link to="/subscribers">Subscribers</router-link>
          <!-- <router-link to="/createstory">Create story</router-link>-->
        </div>
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
        return `/img/bisnaer${parseInt(Math.random() * 31)}.PNG`;
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
  @import 'src/styles/post-index';

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
    height: 80px;
    overflow: hidden;
  }
  
  .logo {
      height: 2.5rem;
  }

  .profile {
    flex: 2 1 50%;
    text-align: right;
  }

  .offcanvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    min-width: 250px;
    visibility: hidden;
    opacity: 0;
    padding: $golden-rem / 2 0;
    transition: opacity 0.3s, visibility 0s 0.3s;
    background: white;
    box-shadow: 0 4px 5px rgba(0,0,0,0.5);
    z-index: 1;

    a {
      display: block;
      padding: $golden-rem / 4 $golden-rem / 2;
      color: inherit;
      text-decoration: none;
      transition: color 0.1s;

      &:hover {
        color: seagreen;
      }
    }
  }

  .navigation__closer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    background: rgba(0,0,0,0.3);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0s 0.3s;
    z-index: 1;
  }

  #nav {
    &:checked {
      & ~ .offcanvas,
      & ~ .navigation__closer {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s, visibility 0s 0s;
      }
    }
  }

  .navigation {
    flex: 2 1 50%;

    input[type=checkbox] {
      position: absolute;
      opacity: 0;
      visibility: hidden;
    }
  }

  .navigation__mini-closer {
    position: absolute;
    margin: 0;
    top: $golden-rem / 4;
    right: $golden-rem / 4;

    img {
      display: block;
      width: $golden-rem / 1.5;
      height: $golden-rem / 1.5;
    }
  }
</style>
