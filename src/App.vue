<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    style: {
      background_color: [
        'linear-gradient(61.63deg, #FFDDC7 -15.05%, #D5E8FE 104.96%)',//light
        'linear-gradient(61.63deg, #0F1327 -15.05%, #5E6B89 104.96%)'//dark
      ]
    }
  }),
  computed: {
    now: function () {
      return this.$store.state.now
    },
    darkMode: function () {
      return this.$store.state.darkMode
    },
  },
  watch: {
    "darkMode": function () {
      document.getElementsByTagName('body')[0].style["background-image"] = this.style.background_color[this.darkMode ? 1 : 0]
    },
  },
  mounted: function () {
    this.updateNow()

    //get video type
    if (localStorage.getItem('video_type')) {
      this.$store.commit({
        type: 'updateVideoType',
        videoType: localStorage.getItem('video_type')
      })
    }

    let nowHour = (new Date(this.now)).getHours()
    if (((nowHour >= 18 || nowHour <= 6) && !this.darkMode) || (nowHour < 18 && nowHour > 6) && this.darkMode) {
      this.$store.commit("updateDarkInfo")
    }
  },
  methods: {
    updateNow: function () {
      this.$store.commit('updateNow')
      setTimeout(this.updateNow, 500);
    },
  }
}
</script>

<style>
  html {
    height: 100%;
  }
  body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    background-image: linear-gradient(61.63deg, #FFDDC7 -15.05%, #D5E8FE 104.96%);
    /* background-image: linear-gradient(61.63deg, #0F1327 -15.05%, #5E6B89 104.96%); */
    background-attachment: fixed;
    background-size: cover;
}
</style>
