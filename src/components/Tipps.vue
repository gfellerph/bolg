<template>
  <div class="tipps">
    <input type="text" v-model="search" placeholder="Fiutere">
    <ul class="tipps__list">
      <li class="tipps__item" v-for="tipp in filteredTipps">
        <tipp-detail :tipp="new Tipp(tipp)"></tipp-detail>
      </li>
    </ul>
  </div>
</template>

<script>
  import Tipp from '@/models/Tipp';
  import { database } from '@/config/firebase';
  import TippDetail from '@/components/TippDetail';

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
        return this.tipps.filter(tipp => tipp.text.toLowerCase().includes(this.search.toLowerCase()) || tipp.user.displayName.toLowerCase().includes(this.search.toLowerCase()));
      }
    },
    components: {
      TippDetail,
    }
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