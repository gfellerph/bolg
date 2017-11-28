<template>
  <div class="tipps">
    <input type="text" v-model="search" placeholder="Fiutere">
    <ul class="tipps__list">
      <li
        class="tipps__item"
        v-bind:key="tipp.id"
        v-for="tipp in filteredTipps"
      >
        <tipp-detail :tipp="new Tipp(tipp)"></tipp-detail>
      </li>
    </ul>
  </div>
</template>

<script>
  import Tipp from 'src/models/Tipp';
  import { database } from 'src/config/firebase';
  import TippDetail from 'src/components/TippDetail';

  export default {
    data() {
      return {
        Tipp,
        tipp: [],
        search: '',
      };
    },
    created() {
      this.$bindAsArray('tipps', database.ref('/tipps').orderByChild('created'));
    },
    computed: {
      filteredTipps() {
        const filterString = this.search.toLowerCase();
        return this.tipps.filter((tipp) => {
          const searchString = `${tipp.text}${tipp.user.displayName}`.toLowerCase();
          return searchString.includes(filterString)
        }).reverse();
      },
    },
    components: {
      TippDetail,
    },
  };
</script>

<style lang="scss" scoped>
  .tipps {
    width: 100%;
  }

  .tipps__list {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  .tipps__item {
    padding: 1em;
    border-bottom: 1px solid black;

    &:last-child {
      border-bottom: none;
    }
  }
</style>