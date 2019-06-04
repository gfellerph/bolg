<template>
  <div class="countries">
    <h1>Countries</h1>
    <div class="new-country" @keydown.enter="postCountry">
      <input placeholder="Landesname" type="text" v-model="newCountry.name">
      <p class="flex">
        <span>Gschichte</span>
        <input placeholder="us dr Mongolei" type="text" v-model="newCountry.titleText">
      </p>
      <button @click="postCountry">Spichere</button>
    </div>
    <p v-if="error" class="error">{{error}}</p>
    <ul class="country-list">
      <li
        :key="country.id"
        v-for="country in countries"
      >
        <input
          placeholder="Landesname"
          type="text"
          v-model="country.name"
        >
        <input
          placeholder="us dr Mongolei"
          type="text"
          v-model="country.titleText"
        >
        <input
          type="date"
          :value="createdFormatted(country.created)"
          @blur="setCreated(country, $event)"
        >
        <button
          @click="putCountry(country)"
        >Spichere</button>
        <button
          class="cancel"
          @click="deleteCountry(country)"
        >Lösche</button>
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios';
  import dateformat from 'dateformat';

  export default {
    data() {
      return {
        loading: false,
        error: false,
        countries: [],
        newCountry: {
          name: '',
          titleText: '',
        },
      }
    },
    created() {
      this.getCountries();
    },
    methods: {
      createdFormatted(date) {
        return dateformat(date, 'yyyy-mm-dd');
      },
      setCreated(country, event) {
        country.created = event.target.value;
      },
      getCountries() {
        this.loading = true;
        this.error = false;
        axios.get('/api/countries')
          .then((res) => {
            this.loading = false;
            this.error = false;
            this.countries = res.data;
          })
          .catch((error) => {
            this.loading = false;
            this.error = error.message;
          });
      },
      putCountry(country) {
        const nc = Object.assign({}, country, { created: new Date(country.created) });
        axios.put(`/api/country/${country._id}`, nc)
          .then(() => {
            this.getCountries();
          })
          .catch((error) => {
            this.error = error.message;
          });
      },
      deleteCountry(country) {
        axios.delete(`/api/country/${country._id}`)
          .then(this.getCountries)
          .catch((error) => {
            this.error = error.message;
          });
      },
      postCountry() {
        axios.post('/api/country', this.newCountry)
          .then(() => {
            this.newCountry = {
              name: '',
              titleText: '',
            };
            this.getCountries();
          })
          .catch((error) => {
            this.error = error.message;
          });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    align-items: center;
  }
</style>
