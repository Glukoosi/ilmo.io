<template>
<nav class="navbar is-black is-fixed-top" role="navigation" aria-label="main navigation" id="top">
  <div class="navbar-brand">
    <router-link class="navbar-item" to="/" v-scroll-to="'#top'">
      <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
    </router-link>

    <div class="navbar-burger burger" aria-label="menu" @click="showNav = !showNav" :class="{ 'is-active': showNav }">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </div>
  </div>

  <div class="navbar-end">
  <div class="navbar-item">
    <div class="buttons">
      <router-link class="navbar-item" to="/about">About</router-link>
    </div>
  </div>
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
