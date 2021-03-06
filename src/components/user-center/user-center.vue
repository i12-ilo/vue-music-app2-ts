<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <Switches @switch="switchItem" :switches="switchArr" :currentIndex = "currentIndex"></Switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script lang="ts"> 
  import Switches from 'base/switches/switches.vue'
  import Scroll from 'base/scroll/scroll.vue'
  import SongList from 'base/song-list/song-list.vue'
  import NoResult from 'base/no-result/no-result.vue'
  // import Song from 'common/js/song'
  import { useStore} from 'vuex'
  import { computed, reactive, toRefs, ref, defineComponent } from 'vue'
  import { useRouter } from 'vue-router'
  //   import {playlistMixin} from 'common/js/mixin'
  import {songType} from "../songType"
  import {ScrollType} from "../ScrollType"

  export default defineComponent({
    // mixins: [playlistMixin],
    setup(){
       const state = reactive({
           currentIndex:0,
           switchArr:[
               {
                   name:'我喜欢的'
               },
               {
                   name:"最近听的"
               }
           ]
       })

       const store = useStore()
       const router = useRouter()
       const listWrapper = ref<null | HTMLElement>(null)
       const favoriteListRef = ref<null | HTMLElement | ScrollType>(null)
       const playList = ref<null | HTMLElement | ScrollType>(null)
       const noResult = computed(()=>{
           if (state.currentIndex === 0){
              return !favoriteList.value.length
           } else {
             return !playHistory.value.length
           }
       })

       const favoriteList = computed(()=>{
           return store.getters.favoriteList
       })

       const playHistory = computed(()=>{
           return store.getters.playlist
       })

       const noResultDesc = ()=>{
         if (state.currentIndex === 0) {
           return '暂无收藏歌曲'
         } else {
           return '你还没有听过歌曲'
         }
       }
       
       const handlePlaylist = (playlist:any)=>{
        const bottom:string = playlist.length > 0 ? '60px' : "";
        (listWrapper.value as HTMLElement).style.bottom = bottom
        favoriteListRef.value && (favoriteListRef.value as ScrollType).refresh()
        playList.value && (playList.value as ScrollType).refresh()
       }

       const switchItem = (index:number)=>{
           state.currentIndex = index;
       }

       const selectSong = (song:songType)=>{
         store.dispatch('insertSong',song)
       }

        const back = ()=> {
            router.back()
        }
        const random=()=> {
          let list:any = state.currentIndex === 0? favoriteList:playHistory
          if (list.length === 0){
            return
          }
         store.dispatch('randomPlay',list)
        }
       return {
           ...toRefs(state),
           noResult,
           favoriteList,
           playHistory,
           noResultDesc,
           listWrapper,
           favoriteListRef,
           playList,
           switchItem,
           back,
           random,
           handlePlaylist,
           selectSong
       }
   
   },
    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
    }
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>