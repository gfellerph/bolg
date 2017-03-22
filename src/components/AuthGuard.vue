<template>
  <div class="auth-guard">
    <slot name="auth" v-if="authenticated"></slot>
    <slot name="no-auth" v-else></slot>
  </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        computed: mapState({
            authenticated: state => state.auth.authenticated,
        }),
    };
</script>