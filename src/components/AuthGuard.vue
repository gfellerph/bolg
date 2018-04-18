<template>
  <div class="auth-guard">
    <slot name="auth" v-if="authenticated"></slot>
    <slot name="no-auth" v-if="!authenticated"></slot>
  </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
      computed: {
        ...mapGetters(['authenticated']),
      },
    };
</script>
