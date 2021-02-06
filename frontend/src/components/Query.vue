<template>
  <section class="section">
    <div class="container content">
      <h1 class="title">{{ heading }}</h1>
      <span style="white-space: pre-wrap;">{{ description }}</span>
      <transition name="mode-fade" mode="out-in" class="mt-5">
        <div v-if="registered.length >= capacityMax" key="full">
          <p class="mb-4 has-text-weight-medium">Form is full</p>
        </div>
        <div v-else-if="nowDate <= startDate" key="starts">
          <p class="mb-4 has-text-weight-medium"> Form opens at {{ startDate }}</p>
        </div>
        <div v-else-if="nowDate >= endDate" key="ended">
          <p class="mb-4 has-text-weight-medium">Form is closed</p>
        </div>
        <template v-else-if="nowDate >= startDate && nowDate <= endDate">
          <form @submit.prevent="onSubmit">
            <component :is="item.type" v-for="(item, key) in form" v-model="registration[key]" :settings="item" v-bind:key="item">
            </component>
            <div class="field">
              <div class="control">
                <button class="button">Send</button>
              </div>
            </div>
          </form>
        </template>
      </transition>
      <p v-if="errors.length">
        <ul>
          <li class="has-text-danger" v-for="error in errors" v-bind:key="error">{{ error }}</li>
        </ul>
      </p>
      <div v-if="registered.length !== 0" class="mt-5">
        <p class="is-size-5 has-text-weight-semibold">Participants: {{ registered.length }} / {{ capacity }} </p>
        <ol type="1">
          <li v-for="(item, index) in registered" v-bind:key="item">
            {{ item }}
            {{ index >= capacity ? ' - in reserve' : '' }}
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from 'axios';
  import { io } from 'socket.io-client';

  import Select from './Form/Select';
  import Text from './Form/Text';
  import Email from './Form/Email';

  export default {
  name: 'Query',
  props: {
    formData: {
      type: Object,
      required: true
    } 
  },
  components: {
    Select,
    Text,
    Email
  },
  data() {
    return {
      currentRoute: window.location.pathname,
      form: this.formData.form,
      heading: this.formData.heading,
      description: this.formData.description,
      nowDate: new Date(),
      startDate: new Date(this.formData.startDate),
      endDate: new Date(this.formData.endDate),
      capacity: this.formData.capacity,
      capacityMax: this.formData.capacityMax,
      registered: [],
      errors: [],
      registration: {},
      isLoading: true
    }
  },
  mounted () {
    this.getRegistrations();
    const socket = io('http://localhost:5000');

    socket.on(this.currentRoute.substring(1), (msg) => {
      this.registered.push(msg)
    });

    for (const item in this.form) {
      this.registration[item] = '';
    }

    setInterval(() => {
      this.nowDate = new Date();
    }, 1000);
  },
  methods: {
    onSubmit() {
      this.errors = []

      axios
        .post(`http://localhost:5000/api/registration${this.currentRoute}`, this.registration)
        .then(() => {
          for (const item in this.form) {
            this.registration[item] = '';
          }
        })
        .catch(error => {
          const response = JSON.parse(error.request.response)
          this.errors.push(response.error);
        });
    },
    getRegistrations() {
      axios
        .get(`http://localhost:5000/api/registrations/names${this.currentRoute}`)
        .then(response => {
          this.registered = response.data
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mode-fade-enter-active, .mode-fade-leave-active {
  transition: opacity 0.8s ease
}

.mode-fade-enter-from, .mode-fade-leave-to {
  opacity: 0
}
</style>
