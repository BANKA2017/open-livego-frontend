<template>
  <div id="frame">
    <!-- As the heading -->

    <router-view />
  </div>
</template>

<script>
export default {
  name: "frame",
  data: () => ({
    links: [{
        type: 'a',
        tooltip: 'links',
        to: '/'
    }],
  }),
}
</script>

<style scoped>

</style>
