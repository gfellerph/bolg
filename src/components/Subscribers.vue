<template>
  <div class="subscribers">
    <h1>Subscriber ({{subscribers.length}})</h1>
    <add-subscriber
      @subscriber-added="getSubscribers"
    ></add-subscriber>
    <ul>
      <li
        :key="subscriber.id"
        v-for="subscriber in subscribers"
      >
        <span>{{subscriber.displayName}}</span>
        (<a :href="'mailto:' + subscriber.email">{{subscriber.email}}</a>)
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios';
  import AddSubscriber from 'src/components/AddSubscriber';

  export default {
    components: { AddSubscriber },
    data() {
      return {
        loading: false,
        error: false,
        subscribers: [],
      }
    },

    created() {
      this.getSubscribers();
    },

    methods: {
      getSubscribers() {
        this.loading = true;
        this.error = false;
        axios.get('/api/subscribers')
          .then((res) => {
            this.loading = false;
            this.error = false;
            this.subscribers = res.data;
          })
          .catch((error) => {
            this.loading = false;
            this.error = error.message;
          });
      },
    },
  }
</script>
