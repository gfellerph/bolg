<template>
  <div class="subscribers">
    <h1>Subscriber ({{subscribers.length}})</h1>
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
  import { database } from '@/config/firebase';

  export default {
    data() {
      return {
        subscribers: [],
      }
    },

    created() {
      this.$bindAsArray('subscribers', database.ref('/subscribers'));
    },
  }
</script>
