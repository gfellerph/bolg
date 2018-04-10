<template>
  <div class="tipps">
    <input type="text" v-model="search" placeholder="Fiutere">
    <ul class="tipps__list">
      <li
        class="tipps__item"
        v-bind:key="tipp._id"
        v-for="tipp in filteredTipps"
      >
        <tipp-detail
          :tipp="tipp"
          @deletetipp="deleteTipp"

        ></tipp-detail>
      </li>
    </ul>
  </div>
</template>

<script>
  import Tipp from 'src/models/Tipp';
  import TippDetail from 'src/components/TippDetail';
  import axios from 'axios';

  export default {
    data() {
      return {
        Tipp,
        tipps: [],
        search: '',
      };
    },
    created() {
      axios.get('/api/tipps')
        .then((res) => { this.tipps = res.data; })
        .catch((err) => { throw err; });
    },
    computed: {
      filteredTipps() {
        const filterString = this.search.toLowerCase();
        return this.tipps.filter((tipp) => {
          const searchString = `${tipp.text}${tipp.name}`.toLowerCase();
          return searchString.includes(filterString)
        });
      },
    },
    methods: {
      updateTipp(newTipp) {
        this.tipps = this.tipps.map(tipp => tipp._id === newTipp._id ? newTipp : tipp);
      },
      deleteTipp(id) {
        this.tipps = this.tipps.filter(tipp => tipp._id !== id);
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
