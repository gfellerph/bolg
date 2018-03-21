<template>
  <div id="app" class="app box">
    <header class="header">
      <nav class="navigation">
        <input type="checkbox" id="nav">
        <label for="nav"><img src="/img/menu.png" alt="Menu"></label>
        <label for="nav" class="navigation__closer"></label>
        <router-link to="/"><img src="/img/chachle.png" alt="Schribe"></router-link>
        <router-link to="/createpost"><img src="/img/plus.png" alt="Schribe"></router-link>
        <div class="offcanvas">
          <label for="nav" class="navigation__mini-closer">
            <img style="width: 32px;" src="/img/chrüz.png" alt="">
          </label>
          <profile></profile>
          <hr>
          <router-link to="/">Overview</router-link>
          <router-link to="/createpost">Create post</router-link>
          <router-link to="/map">Map</router-link>
          <router-link to="/tipps">Tipps</router-link>
          <router-link to="/drawings">Drawings</router-link>
          <router-link to="/subscribers">Subscribers</router-link>
          <router-link to="/createdrawing">Zeichne</router-link>
          <router-link to="/journey">Reiseroute</router-link>
          <!-- <router-link to="/createstory">Create story</router-link>-->
        </div>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  import Profile from 'src/components/Profile';
  import store from 'src/config/store';
  import { database } from 'src/config/firebase';

  export default {
    name: 'app',

    watch: {
      $route() {
        document.getElementById('nav').checked = false;
      },
    },

    created() {
      database
        .ref('.info/connected')
        .on('value', (snapshot) => {
          if (snapshot.val()) {
            store.commit('ONLINE');
          } else {
            store.commit('OFFLINE');
          }
        });
    },

    components: {
      Profile,
    },
  }
</script>

<style lang="scss">
  @import 'src/styles/_index';

  .app {
    display: grid;
    grid-template-columns: 3rem 1fr;
    height: 100vh;
  }

  main {
    display: flex;
  }

  .header {
    padding: $golden-rem / 4;
    border-right: 1px solid black;
    overflow: hidden;
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

    label {
      margin: 0;
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
