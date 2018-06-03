<template>
  <div v-show="visible">
    app2
  </div>
</template>

<script>
export default {
  name: 'app2',
  data: () => ({
    visible: true
  })
}
</script>