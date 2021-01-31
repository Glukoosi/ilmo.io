<template>
  <section class="section">
    <div class="container content mt-5">
      <h1 class="title">ILMOITTAUTUMINEN {{ currentRoute }}</h1>
      <p>Curabitur accumsan turpis pharetra <strong>augue tincidunt</strong> blandit. Quisque condimentum maximus mi, sit amet commodo arcu rutrum id. Proin pretium urna vel cursus venenatis. Suspendisse potenti. Etiam mattis sem rhoncus lacus dapibus facilisis. Donec at dignissim dui. Ut et neque nisl.</p>
      <ul>
        <li>In fermentum leo eu lectus mollis, quis dictum mi aliquet.</li>
        <li>Morbi eu nulla lobortis, lobortis est in, fringilla felis.</li>
        <li>Aliquam nec felis in sapien venenatis viverra fermentum nec lectus.</li>
        <li>Ut non enim metus.</li>
      </ul>

      <transition name="mode-fade" mode="out-in">
        <div v-if="isLoading" key="loading">
          <p class="mb-4 has-text-weight-medium">Ladataan...</p>
        </div>
        <div v-else-if="registered.length >= capacityMax" key="full">
          <p class="mb-4 has-text-weight-medium">Ilmoittautuminen on täynnä.</p>
        </div>
        <div v-else-if="nowDate <= startDate" key="starts">
          <p class="mb-4 has-text-weight-medium">Ilmoittautuminen alkaa xx.xx.2021</p>
        </div>
        <div v-else-if="nowDate >= endDate" key="ended">
          <p class="mb-4 has-text-weight-medium">Ilmoittautuminen on päättynyt.</p>
        </div>
        <template v-else-if="nowDate >= startDate && nowDate <= endDate">
          <form @submit.prevent="onSubmit">
            <component :is="item.type" v-for="(item, key) in form" v-model="registration[key]" :settings="item" v-bind:key="item">
            </component>
            <div class="field">
              <div class="control">
                <button class="button">Ilmoittaudu</button>
              </div>
            </div>
          </form>
        </template>
      </transition>
      <p v-if="errors.length">
        <b>Korjaa nämä:</b>
        <ul>
          <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
        </ul>
      </p>
      <div v-if="registered.length !== 0">
        <p>Ilmoittautuneet: {{ registered.length }} / {{ capacity }} </p>
        <ol type="1">
          <li v-for="(item, index) in registered" v-bind:key="item">
            {{ item.name }} - {{ item.group }} - {{ item.email }}
            {{ index >= capacity ? ' - varasijalla' : '' }}
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from 'axios';
  import { io } from 'socket.io-client';

  import Select from '../components/Form/Select';
  import Text from '../components/Form/Text';
  import Email from '../components/Form/Email';

  export default {
  name: 'Query',
  components: {
    Select,
    Text,
    Email
  },
  data() {
    return {
      currentRoute: window.location.pathname,
      form: {},
      nowDate: new Date().getTime(),
      startDate: 0,
      endDate: 0,
      capacity: 0,
      capacityMax: 0,
      registered: [],
      errors: [],
      registration: {},
      isLoading: true
    }
  },
  mounted () {
    this.getForm();
    this.getRegistrations();
    const socket = io('http://localhost:5000');

    socket.on(this.currentRoute.substring(1), (msg) => {
      this.registered.push({
        name: msg.name,
        group: msg.group,
        email: msg.email
      })
    });

    setInterval(() => {
      this.nowDate = new Date().getTime();
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
    getForm() {
      axios
        .get(`http://localhost:5000/api/schemas${this.currentRoute}`)
        .then(response => {
          this.form = response.data.form;
          this.startDate = response.data.startDate;
          this.endDate = response.data.endDate;
          this.capacity = response.data.capacity;
          this.capacityMax = response.data.capacityMax;
          this.isLoading = false;

          for (const item in this.form) {
            this.registration[item] = '';
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    getRegistrations() {
      axios
        .get(`http://localhost:5000/api/registration${this.currentRoute}`)
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
