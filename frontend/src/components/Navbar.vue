<template>
<nav class="navbar is-black is-fixed-top" role="navigation" aria-label="main navigation" id="top">
  <div class="navbar-brand">
    <router-link class="navbar-item" to="/" v-scroll-to="'#top'">
      <img src="@/assets/logo_transparent.png">
    </router-link>
  </div>
</nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      showNav: false
    }
  },
  props: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
