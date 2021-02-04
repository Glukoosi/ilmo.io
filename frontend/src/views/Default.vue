<template>
  <transition name="mode-fade" mode="out-in">
    <div v-if="state === 'loading'" key="loading" class="columns is-mobile is-centered mt-5">
      <div class="loadingio-spinner-bean-eater-v07ctwokcxj"><div class="ldio-ahc5moy8ymc">
      <div><div></div><div></div><div></div></div><div><div></div><div></div><div></div></div>
      </div></div>
    </div>
    <div v-else-if="state === 'found'" key="found">
        <Query :formData="formData" />
    </div>
    <div v-else-if="state === 'notFound'" key="notFound">
        <NotFound />
    </div>
    <div v-else-if="state === 'error'" key="error">
        <Error />
    </div>
  </transition>
</template>

<script>
  import axios from 'axios';

  import Query from '../components/Query';
  import NotFound from '../components/NotFound';
  import Error from '../components/Error';

  export default {
    name: 'Default',
    components: {
      Query,
      NotFound,
      Error
    },
    data() {
      return {
        currentRoute: window.location.pathname,
        formData: {},
        state: 'loading'
      }
    },
    mounted () {
      this.getForm();
    },
    methods: {
      getForm() {
        axios
          .get(`http://localhost:5000/api/schema${this.currentRoute}`, { timeout:5000 })
          .then(response => {
            this.formData = response.data
            this.state = 'found'
          })
          .catch((error) => {
            if ( error.response && error.response.status === 404) {
              this.state = 'notFound'
            } else {
              this.state = 'error'
            }
          });
      }
    }
  }
</script>

<style scoped>
.mode-fade-enter-active, .mode-fade-leave-active {
  transition: opacity 0.6s ease
}

.mode-fade-enter-from, .mode-fade-leave-to {
  opacity: 0
}
@keyframes ldio-ahc5moy8ymc-1 {
    0% { transform: rotate(0deg) }
   50% { transform: rotate(-45deg) }
  100% { transform: rotate(0deg) }
}
@keyframes ldio-ahc5moy8ymc-2 {
    0% { transform: rotate(180deg) }
   50% { transform: rotate(225deg) }
  100% { transform: rotate(180deg) }
}
.ldio-ahc5moy8ymc > div:nth-child(2) {
  transform: translate(-15px,0);
}
.ldio-ahc5moy8ymc > div:nth-child(2) div {
  position: absolute;
  top: 40px;
  left: 40px;
  width: 120px;
  height: 60px;
  border-radius: 120px 120px 0 0;
  background: #afafaf;
  animation: ldio-ahc5moy8ymc-1 1s linear infinite;
  transform-origin: 60px 60px
}
.ldio-ahc5moy8ymc > div:nth-child(2) div:nth-child(2) {
  animation: ldio-ahc5moy8ymc-2 1s linear infinite
}
.ldio-ahc5moy8ymc > div:nth-child(2) div:nth-child(3) {
  transform: rotate(-90deg);
  animation: none;
}@keyframes ldio-ahc5moy8ymc-3 {
    0% { transform: translate(190px,0); opacity: 0 }
   20% { opacity: 1 }
  100% { transform: translate(70px,0); opacity: 1 }
}
.ldio-ahc5moy8ymc > div:nth-child(1) {
  display: block;
}
.ldio-ahc5moy8ymc > div:nth-child(1) div {
  position: absolute;
  top: 92px;
  left: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #afafaf;
  animation: ldio-ahc5moy8ymc-3 1s linear infinite
}
.ldio-ahc5moy8ymc > div:nth-child(1) div:nth-child(1) { animation-delay: -0.67s }
.ldio-ahc5moy8ymc > div:nth-child(1) div:nth-child(2) { animation-delay: -0.33s }
.ldio-ahc5moy8ymc > div:nth-child(1) div:nth-child(3) { animation-delay: 0s }
.loadingio-spinner-bean-eater-v07ctwokcxj {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: rgba(NaN, NaN, NaN, 0);
}
.ldio-ahc5moy8ymc {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-ahc5moy8ymc div { box-sizing: content-box; }
</style>
