<template>
  <section class="section">
    <div class="columns is-mobile is-centered mt-5 content">
       <img src="@/assets/logo_transparent_invert.png">
    </div>
    <p class="is-size-4 has-text-centered has-text-weight-medium">Real-Time Registration Form Generator</p>
    <div v-if="publicForms.length !== 0" class="mt-6 has-text-centered">
      <p class="is-size-5 has-text-weight-semibold">Public Forms:</p>
      <transition-group name="list" tag="router-link" appear>
        <router-link v-for="item in publicForms" :to="item" class="is-size-5 has-text-weight-medium list-item" v-bind:key="item">
          {{ item }} <br />
        </router-link>
      </transition-group>
    </div>
  </section>
</template>

<script>
  import axios from 'axios';
  import { io } from 'socket.io-client';

  export default {
    name: 'Home',
    data() {
      return {
        apiUrl: process.env.VUE_APP_API_URL,
        apiPort: process.env.VUE_APP_API_PORT,
        publicForms: []
      }
    },
    mounted () {
      this.getForms();
      const socket = io(`${this.apiUrl}:${this.apiPort}`);

      socket.on('schemas', (msg) => {
        this.publicForms.push(msg)
      });
    },
    methods: {
      getForms() {
        axios
          .get(`${this.apiUrl}:${this.apiPort}/api/schemas`, { timeout:5000 })
          .then(response => {
            this.publicForms = response.data
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.8s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
