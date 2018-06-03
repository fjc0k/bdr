<template>
  <div v-show="visible">
    app
    <App2 />
  </div>
</template>

<script>
import styles from './app.styl'
import App2 from './app2.vue'
export default {
  name: 'app',
  styles,
  data: () => ({
    visible: true
  }),
  components: { App2 }
}
</script>