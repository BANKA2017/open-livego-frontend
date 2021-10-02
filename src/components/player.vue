<template>
  <div id="player_template">
    <video id="player"></video>
  </div>
</template>

<script>
import Hls from 'hls.js'
import flvjs from 'flv.js'
import Plyr from 'plyr';
import 'plyr/dist/plyr.css'

export default {
  props: {
    uid: {
      type: [Number, String],
      default: () => 0
    },
  },
  name: "player",
  data: () => ({
    container: null,
    flvPlayer: null,
    hls: null,
    player: null,
  }),
  computed: {
    videoType: function () {
      return this.$store.state.videoType
    }
  },
  watch: {
    "uid": function () {
      this.plyr()
    },
    "videoType": function () {
      this.plyr()
    }
  },
  mounted: function () {
    this.container = document.getElementById('player')
    this.player = new Plyr(this.container, {
      autoplay: true,
      volume: 0.7,
      iconUrl: '/static/img/plyr.svg',
      blankVideo: '/static/video/blank.mp4',
      controls: [
        'play-large', // The large play button in the center
        'play', // Play/pause playback
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'captions', // Toggle captions
        'settings', // Settings menu
        'pip', // Picture-in-picture (currently Safari only)
        'airplay', // Airplay (currently Safari only)
        'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
        'fullscreen', // Toggle fullscreen
      ]
    })
    this.plyr()
  },
  methods: {
    plyr: function () {
      switch (this.videoType) {
        case '0':
          if (this.hls) {
            this.hls.destroy()
          }
          this.customFlv()
          break
        case '1':
          if (this.flvPlayer) {
            this.flvPlayer.destroy()
          }
          this.customHls()
          break
      }
    },
    customFlv: function() {
      this.flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: process.env.VUE_APP_FLV_PATH + "/live/" + this.uid +".flv",
      });
      this.flvPlayer.attachMediaElement(this.container);
      this.flvPlayer.load();
    },
    customHls: function () {
      this.hls = new Hls();
      this.hls.loadSource(process.env.VUE_APP_HLS_PATH + "/live/" + this.uid +".m3u8");
      this.hls.attachMedia(this.container);
    },
  }
}
</script>

<style scoped>

</style>
