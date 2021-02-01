<template>
  <div id="body" class="mt-5">
    <div id="wrapper">
      <Navbar />
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';

  import Navbar from './components/Navbar.vue'
  import Footer from './components/Footer.vue'

  @Options({
    components: {
      Navbar,
      Footer,
    },
  })
  export default class App extends Vue {}
</script>

<style>
  #body {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  #wrapper {
    flex: 1;
  }
</style>
