<template>
  <section class="section">
    <div class="container content">
      <h1 class="title">halojata</h1>
        <form @submit.prevent="onSubmit">
          <component :is="item.type" v-for="(item, key) in form" v-model="result[key]" :settings="item" v-bind:key="item">
          </component>
        </form>
        <form @submit.prevent="addColumns">
          <label class="label">Add stuff</label>
          <div class="columns is-mobile is-multiline">
            <div class="column is-one-fourth is-narrow">
              <input class="input" type="text" placeholder="name" v-model="addResult.columnName">
            </div>
            <div class="column is-narrow">
              <div class="select">
                <select v-model="addResult.columnType">
                  <option>Text</option>
                  <option>TextArea</option>
                  <option>Select</option>
                  <option>Email</option>
                  <option>CheckBox</option>
                  <option>Radio</option>
                </select>
              </div>
            </div>
            <div class="column is-narrow">
            <label class="checkbox">
              <input type="checkbox">
              required
            </label>
            </div>
            <div class="column is-narrow">
              <button class="button is-primary">
                <span class="icon">
                  <i class="fab fa-add"></i>
                  <vue-fontawesome icon="plus" />
                </span>
                <span>Add</span>
              </button>
            </div>
          </div>
        </form>
          <!-- <div class="field">
            <div class="control">
              <button :class="{ 'is-loading': isLoading }" class="button">Create ilmo</button>
            </div>
          </div> -->
          {{ result }}
        <p v-if="errors.length">
          <ul>
            <li class="has-text-danger" v-for="error in errors" v-bind:key="error">{{ error }}</li>
          </ul>
        </p>
    </div>
  </section>
</template>

<script>
  import axios from 'axios';

  import Select from '../components/Form/Select';
  import Text from '../components/Form/Text';
  import Number from '../components/Form/Number';
  import TextArea from '../components/Form/TextArea';
  import Email from '../components/Form/Email';
  import CheckBox from '../components/Form/CheckBox';
  import Radio from '../components/Form/Radio';
  import DateTimePicker from '../components/Form/DateTimePicker';

  export default {
    name: 'Create',
    components: {
      Select,
      Text,
      Number,
      TextArea,
      Email,
      CheckBox,
      Radio,
      DateTimePicker,
    },
    data() {
      return {
        form: {
          slug: {
            type: "Text",
            label: "slug",
            required: true
          },
          header: {
            type: "Text",
            label: "header",
            required: true
          },
          description: {
            type: "TextArea",
            label: "description",
          },
          public: {
            type: "CheckBox",
            label: "public",
          },
          capacity: {
            type: "Number",
            label: "capacity",
            required: true
          },
          capacityMax: {
            type: "Number",
            label: "capacityMax",
            required: true
          },
          startDate: {
            type: "DateTimePicker",
            label: "startDate",
            required: true
          },
          endDate: {
            type: "DateTimePicker",
            label: "endDate",
            required: true
          },
        },
        result: {},
        addResult: {
          columnType: '',
          columnName: ''
        },
        errors: [],
        isLoading: false,
        apiUrl: process.env.VUE_APP_API_URL,
        apiPort: process.env.VUE_APP_API_PORT,
      }
    },
    mounted () {
    },
    methods: {
      onSubmit() {
        this.errors = [];
        this.isLoading = true;

        axios
          .post(`${this.apiUrl}:${this.apiPort}/api/registration${this.currentRoute}`, this.result)
          .then(() => {
            for (const item in this.form) {
              this.result[item] = '';
            }
            this.isLoading = false;
          })
          .catch(error => {
            const response = JSON.parse(error.request.response)
            this.errors.push(response.error);
            this.isLoading = false;
          });
      },
      addColumns() {
        console.log(this.addResult.columnType);
        console.log(this.addResult.columnName);
      }
    }
  }
</script>

<style scoped>
</style>
