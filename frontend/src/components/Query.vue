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
          <p class="mb-4 has-text-weight-medium"> Form opens at {{ startDate.toUTCString() }}</p>
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
                <button :class="{ 'is-loading': isLoading }" class="button">Send</button>
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
        <p class="is-size-5 has-text-weight-semibold mt-5">Participants: {{ registered.length ? registered.length : '-'}} / {{ capacity }} </p>
        <ol type="1">
          <transition-group name="list" tag="router-link" appear>
            <li v-for="(item, index) in registered" v-bind:key="item" class="list-item">
              {{ item }}
              {{ index >= capacity ? ' - in reserve' : '' }}
            </li>
          </transition-group>
        </ol>
    </div>
  </section>
</template>

<script>
  import axios from 'axios';
  import { io } from 'socket.io-client';

  import Select from './Form/Select';
  import Text from './Form/Text';
  import TextArea from './Form/TextArea';
  import Email from './Form/Email';
  import CheckBox from './Form/CheckBox';
  import Radio from './Form/Radio';

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
    TextArea,
    Email,
    CheckBox,
    Radio
  },
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      apiPort: process.env.VUE_APP_API_PORT,
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
      isLoading: false
    }
  },
  mounted () {
    this.getRegistrations();
    const socket = io(`${this.apiUrl}:${this.apiPort}`);

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
      this.errors = [];
      this.isLoading = true;

      axios
        .post(`${this.apiUrl}:${this.apiPort}/api/registration${this.currentRoute}`, this.registration)
        .then(() => {
          this.registration = {};
          for (const item in this.form) {
            this.registration[item] = '';
          }
          this.isLoading = false;
        })
        .catch(error => {
          const response = JSON.parse(error.request.response)
          this.errors.push(response.error);
          this.isLoading = false;
        });
    },
    getRegistrations() {
      axios
        .get(`${this.apiUrl}:${this.apiPort}/api/registrations/names${this.currentRoute}`)
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

.list-enter-active,
.list-leave-active {
  transition: all 0.8s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
