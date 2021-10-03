<template>
  <div id="main_page">
    <div style="flex: 1;" class="position-relative">
      <div class="container mt-2 mt-lg-5">
        <div class="row">
          <div class="col-12 mt-2 mb-4">
            <Nav path-name="main"/>
          </div>
          <template v-if="activeLive === ''">
            <div class="col-md-6 col-lg-4" v-if="!Object.values(liveList).length">
              <div :class="{'card': true, 'border-0': true, 'shadow-lg': true, 'mb-3': true, 'text-decoration-none': true, 'text-black': !darkMode, 'bg-dark': darkMode, 'text-white': darkMode}" >
                <div class="card-body">
                  <div class="text-end mt-0"><i :class="{'bi': true, 'bi-circle-fill':true, 'text-danger': true}"></i></div>
                  <span class="display-6">
                    无直播间
                  </span>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4" v-for="(liveInfo, order) in Object.values(liveList)" :key="order">
              <router-link :class="{'card': true, 'border-0': true, 'shadow-lg': true, 'mb-3': true, 'text-decoration-none': true, 'text-black': !darkMode, 'bg-dark': darkMode, 'text-white': darkMode}" :to="{path: '/'+liveInfo.uid + '/'}">
                <div class="card-body">
                  <div class="text-end mt-0"><i :class="{'bi': true, 'bi-circle-fill':true, 'text-success': true}"></i></div>
                  <span class="display-6">
                    {{ liveInfo.uid }}
                  </span>
                  <br>
                  <span >观众数量: {{ liveInfo.audience_count }}</span>
                </div>
              </router-link>
            </div>
          </template>
          <template v-else>
            <div class="col-md-8">
              <div :class="{'card': true, 'shadow-lg': true, 'border-0': true, 'mb-3': true, 'bg-dark': darkMode, 'text-white': darkMode}" v-if="!liveList[activeLive]">
                <div class="card-body">
                  主播摸鱼中~
                </div>
              </div>
              <player class="mb-3" :uid="liveList[activeLive].uid" v-else/>
            </div>
            <div class="col-md-4">
              <div :class="{'card': true, 'shadow-lg': true, 'border-0': true, 'mb-3': true, 'bg-dark': darkMode, 'text-white': darkMode}">
                <div class="card-body">
                  <div class="text-end">
                    <span :class="{'badge': true, 'bg-danger': videoType === '0', 'bg-dark': (videoType === '1' && !darkMode), 'bg-light': (videoType === '1' && darkMode), 'text-black': (videoType === '1' && darkMode), 'me-2': true,}" role="button" style="font-size: 0.8em" @click="swapVideoType()">{{ videoTypeList[videoType] }}</span>
                    <i :class="{'bi': true, 'bi-circle-fill':true, 'text-success': liveList[activeLive], 'text-danger': !liveList[activeLive]}"></i>
                  </div>
                  <span class="display-6">
                    {{ (!liveList[activeLive] ? '未开播' : liveList[activeLive].uid) }}
                  </span>
                  <br>
                  <span >观众数量: {{ !liveList[activeLive] ? 0 : liveList[activeLive].audience_count }}</span>
                </div>
              </div>
              <div :class="{'card': true, 'border-0': true, 'shadow-lg': true, 'mb-3': true, 'bg-dark': darkMode, 'text-white': darkMode}">
                <div class="card-body">
                  <ul>
                    <li>如遇卡顿或无法播放，请点刷新或点击带<span :class="{'badge': true, 'bg-danger': videoType === '0', 'bg-dark': (videoType === '1' && !darkMode), 'bg-light': (videoType === '1' && darkMode), 'text-black': (videoType === '1' && darkMode), 'mx-1': true,}" role="button" style="font-size: 0.55em" @click="swapVideoType()">{{ videoTypeList[videoType] }}</span>字样的标签切换播放模式</li>
                    <li><code>flv</code> 延迟较低，<code>hls</code> 延迟较高</li>
                  </ul>
                </div>
              </div>
              <a class="btn btn-primary shadow-lg mb-3 text-decoration-none d-flex" :href="$route.params.room ? '/' + $route.params.room + '/' : '/'">
                <i class="bi bi-arrow-repeat"></i> 刷新
              </a>
              <div :class="{'card': true, 'border-0': true, 'shadow-lg': true, 'mb-3': true, 'bg-dark': darkMode, 'text-white': darkMode}" v-if="Object.values(liveList).length">
                <div class="card-body">
                  <div class="lead mb-2">
                    直播间
                  </div>
                  <div style="background-color: white" class="rounded mb-1" v-for="(liveInfo, order) in Object.values(liveList)" :key="order">
                    <router-link :to="{path: '/'+liveInfo.uid+'/'}" style="width: 100%" :class="{'btn': true, 'btn-outline-primary': true, 'rounded': true, 'active': (activeLive === liveInfo.uid+''), 'bg-dark': (darkMode && (activeLive !== liveInfo.uid+''))}">
                      房间 {{ liveInfo.uid }} <span class="badge bg-secondary text-end">{{ liveInfo.audience_count }}</span>
                    </router-link>
                  </div>
                </div>
              </div>
              <div :class="{'text-center': true, 'my-2': true}">
                <a href="https://github.com/BANKA2017/open-livego-frontend" target="_blank" :class="{'text-decoration-none': true, 'text-white': darkMode, 'text-black': !darkMode}"><i class="bi bi-github"></i> BANKA2017/open-livego-frontend </a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Player from '@/components/player'
import Nav from "@/components/nav";

export default {
  name: "main_page",
  components: {Nav, Player},
  data: () => ({
    activeLive: "",
    liveList: {},
    liveNameList: [],
    cancelStatus: {
      activeStreamFetch: false,
      activeRoomInfo: false,
    },
    videoTypeList: ['FLV', 'HLS'],
  }),
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'main') {
      this.activeLive = ""
    } else if(to.name === 'room') {
      this.activeLive = to.params.room
    }
    this.updateLiveData()
    next()
  },
  beforeRouteEnter(to, from, next) {
    //none
    next(vm => {
      if (to.name === 'main') {
        vm.activeLive = ""
      } else if(to.name === 'room') {
        vm.activeLive = to.params.room
      }
      vm.updateLiveData()
    })
  },
  computed: {
    now: function () {
      return this.$store.state.now
    },
    darkMode: function () {
      return this.$store.state.darkMode
    },
    videoType: function () {
      return this.$store.state.videoType
    }
  },
  mounted: function (){
    this.updateLiveData()
  },
  methods: {
    updateLiveData:  async function (){
      if (this.cancelStatus.activeStreamFetch) {
        return
      }
      if (this.$route.name !== 'room' && this.$route.name !== 'main') {
        return
      }
      this.cancelStatus.activeStreamFetch = true
      let tmpLiveList = {}
      let tmpLiveNameList = []
      let tmpData = await(await fetch(process.env.VUE_APP_FLV_PATH + "/streams")).json()
      if (tmpData.publishers) {
        tmpData.publishers.map(publisher => {
          tmpLiveList[publisher.key.split('/')[1]] = {
            uid: publisher.key.split('/')[1],
            audience_count: 0
          }
          tmpLiveNameList.push(publisher.key.split('/')[1])
        })
        if (tmpData.players) {
          tmpData.players.map(player => tmpLiveList[player.key.split('/')[1]].audience_count++)
        }
      }
      this.liveNameList = tmpLiveNameList
      this.liveList = tmpLiveList
      this.cancelStatus.activeStreamFetch = false
      setTimeout(this.updateLiveData, 10000);
    },
    swapVideoType: function () {
      this.$store.commit({
        type: 'updateVideoType',
        videoType: this.videoType === '0' ? '1' : '0'
      })
    }
  }
}
</script>

<style scoped>

</style>
