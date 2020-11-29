<template>
 <div class="player" v-show="playlist.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img  :src="currentSong.imgUrl">
        </div>
        <div class="top" @click="back">
          <div class="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.imgUrl">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
           <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
         <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
             <span class="tiem time-l">{{format(currentTime)}}</span>
             <div class="progress-bar-wrapper">
               <progress-bar @percentchange="onProgressBarChange" :percent="percent"></progress-bar>
             </div>
             <sapn class="time time-r">{{format(duration)}}</sapn>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
             <div class="icon i-right">
              <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
     <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open"> 
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.imgUrl">
        </div>  
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
          <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
     </transition>
     <PlayList ref="playlistRef"></PlayList>
     <audio @ended="end" @timeupdate="updateTime" ref="audioRef" :src="playUrl" @canplay="ready"></audio>
  </div>
</template>
<script>
import { computed,reactive,ref, toRefs, watch } from 'vue'
import {useStore} from "vuex"
import animations from 'create-keyframe-animation'
import * as Types from "../../store/mutation-types"
import {prefixStyle} from '../../common/js/dom'
import {shuffle} from "../../common/js/util"
import {getUrl, getLyric} from "../../api/song"
import  ProgressBar from "base/progress-bar/progress-bar"
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from '../../common/js/config'
import Lryic from 'lyric-parser'
import Scroll from "base/scroll/scroll"
import PlayList from "components/playlist/playlist.vue"

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {

  setup(){
    const state = reactive({
      playUrl:'',
      songReady:false,
      currentTime:0,
      duration:0,
      radius:32,
      currentLyric: null,
      currentLineNum:0,
      currentShow:'cd',
      touch:{},
      playingLyric: ''
    })
    const store = useStore()
    const lyricLine = ref(null)
    const playlistRef = ref(null)
    const playlist = computed(()=>{
      return store.getters.playlist
    })
    const fullScreen = computed(()=>{
      return store.getters.fullScreen
    })
    const currentSong = computed(()=>{
      return store.getters.currentSong
    })
    const cdWrapper = ref(null)
    const audioRef = ref(null)
    const lyricList = ref(null)
    const middleL = ref(null)
    const back = () => {
      store.commit(Types.SET_FULL_SCREEN,false)
    }
    const showPlayList = ()=>{
      console.log(playlistRef.value)
      playlistRef.value.show()
    }
    const getSongLyric = ()=>{
       getLyric(currentSong.value.id).then(res=>{
         state.currentLyric = new Lryic(res.data.lrc.lyric,handleLyric)
         if (playing.value){
           state.currentLyric.play()
         }
       })
       
    }
    const favoriteList = computed(()=>{
      return store.getters.favoriteList
    })

    const isFavorit = (song)=>{
      const index = favoriteList.value.findIndex((item)=>{
        return item.id === song.id
      })
      return index>-1
    }
    const getFavoriteIcon = (song)=>{
      if (isFavorit(song)){
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    }

    const toggleFavorite = (song)=>{
      if (isFavorit(song)){
        store.dispatch('deleteFavoriteList',song)
      } else {
        store.dispatch('saveFavoriteList',song)
      }
    }
    const handleLyric = (lineNum,txt)=>{
      state.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = lyricLine.value[lineNum-5]
        lyricList.value.scrollToElement(lineEl,1000)
      } else {
        lyricList.value.scrollToElement(0,1000)
      }
      state.playingLyric = txt

    }

    const middleTouchStart = (e)=>{
       state.touch.initiated = true
        const touch = e.touches[0]
        state.touch.startX = touch.pageX
        state.touch.startY = touch.pageY
    }

    const middleTouchMove = (e)=>{
     if (!state.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - state.touch.startX
        const deltaY = touch.pageY - state.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = state.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        state.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        lyricList.value.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        lyricList.value.$el.style[transitionDuration] = 0
        middleL.value.style.opacity = 1 - state.touch.percent
        middleL.value.style[transitionDuration] = 0
    }
    const middleTouchEnd = ()=>{
       let offsetWidth
        let opacity
        if (state.currentShow === 'cd') {
          if (state.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            state.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (state.touch.percent < 0.9) {
            offsetWidth = 0
            state.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        lyricList.value.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        lyricList.value.$el.style[transitionDuration] = `${time}ms`
        middleL.value.style.opacity = opacity
        middleL.value.style[transitionDuration] = `${time}ms`
        state.touch.initiated = false
    }
    const open = () => {
      store.commit(Types.SET_FULL_SCREEN,true)
    }
    const enter = (el, done) => {
        const {x, y, scale} = _getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(cdWrapper.value, 'move', done)
      }
      const afterEnter = ()=> {
        animations.unregisterAnimation('move')
        cdWrapper.value.style.animation = ''
      }
      const leave  = (el, done)=> {
        cdWrapper.value.style.transition = 'all 0.4s'
        const {x, y, scale} = _getPosAndScale()
        cdWrapper.value.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        cdWrapper.value.addEventListener('transitionend', done)
      }
      const afterLeave = () => {
        cdWrapper.value.style.transition = ''
        cdWrapper.value.style[transform] = ''
      }
      const getAudiourl = ()=>{
        if (currentSong.value.id) {
          getUrl(currentSong.value.id).then(res=>{
           state.playUrl = res.data.data[0].url
          })
        }
      }
      const    _getPosAndScale = () =>{
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      }
      const currentIndex = computed(()=>{
        return store.getters.currentIndex
      })
      const playing = computed(()=>{
        return store.getters.playing
      })
      const playIcon = computed(()=>{
        return playing.value?'icon-pause':'icon-play'
      })
      const miniIcon = computed(()=>{
        return playing.value?'icon-pause-mini':'icon-play-mini'
      })
      const cdCls = computed(()=>{
        return playing.value?'play':'play pause'
      })
      const mode = computed(()=>{
        return store.getters.mode
      })
      const iconMode = computed(()=>{
        return mode.value === playMode.sequence?'icon-sequence':mode.value===playMode.loop?"icon-loop":'icon-random'
      })
      const togglePlaying = ()=>{
        store.commit(Types.SET_PLAYING_STATE,!playing.value)
      }

      const percent = computed(()=>{
        return state.currentTime/state.duration
      })
      const sequenceList = computed(()=>{
        return store.getters.sequenceList
      })
      const changeMode = ()=>{
        const modeV = (mode.value + 1) % 3
        store.commit(Types.SET_PLAY_MODE,modeV)
        let list = null
        if (modeV === playMode.random){
          list = shuffle(sequenceList.value)
        } else {
          list = sequenceList.value
        }
        resetCurrentIndex(list)
        store.commit(Types.SET_PLAYLIST,list)

      }

     const resetCurrentIndex = (list)=>{
       let index  = list.findIndex((item)=>{
         return item.id === currentSong.value.id
       })
       console.log("=====",index)
       store.commit(Types.SET_CURRENT_INDEX,index)
      }
      const prev = ()=>{
        if (!state.songReady){
          return
        }
        if (playlist.value.length === 1) {
          loop()
        } else {
        let index = currentIndex.value - 1
        if (index === -1){
          index = playlist.value.length - 1
        }
        store.commit(Types.SET_CURRENT_INDEX,index)
         if (!playing.value){
          togglePlaying()
        }
        }
        state.songReady = false
      }

      const next = ()=>{
        if (!state.songReady){
          return
        }
        if (playlist.value.length === 1){
          loop()
        } else {
        let index = currentIndex.value + 1
        if (index === playlist.value.length){
          index = 0
        }
        store.commit(Types.SET_CURRENT_INDEX,index)
        if (!playing.value){
          togglePlaying()
        }
        }
        state.songReady = false
      }

      const ready = ()=>{
        state.songReady = true
        store.dispatch('savePlayHistory',currentSong.value)
      }

      const error = ()=>{
        state.songReady = true
      }

      const end = ()=>{
        if (mode.value === playMode.loop){
          loop()
        } else {
          next()
        }
      }
      const loop = ()=>{
        audioRef.value.currentTime = 0
        audioRef.value.play()
        if (state.currentLyric) {
          state.currentLyric.seek()
        }
      }
      const disableCls = computed(()=>{
        return state.songReady?"":"disable"
      })

      const updateTime = (e)=>{
        state.currentTime = e.target.currentTime
        state.duration = e.target.duration

      }
      const format = (interval)=>{
        interval = interval | 0
        const minute = _pad(interval/60 | 0)
        const second = _pad(interval%60)
        return `${minute}:${second}`
      }
      const _pad = (num, n = 2) => {
        let len = num.toString().length
        while (len<n){
          num = '0' + num
          len++
        }
        return num
      }

      const onProgressBarChange = (percent)=>{
        const time = percent*state.duration
        audioRef.value.currentTime = time
        if (!playing.value){
          togglePlaying()
        }
        if (state.currentLyric) {
          state.currentLyric.seek(time*1000)
        }
      }
    watch(()=>currentSong.value,(newSong,oldSong)=>{
      if (!newSong.id) {
          return
        }
      if (newSong.id === oldSong.id){
        return
      }
      if (state.currentLyric){
         state.currentLyric.stop()
         state.currentTime = 0;
         state.playingLyric = ''
         state.currentLineNum = 0
      }
        getSongLyric()
        getAudiourl();
      })
    
    watch(()=>playing.value,(newPlaying)=>{
      newPlaying?audioRef.value.play():audioRef.value.pause()
    })
    return {
      ...toRefs(state),
      playlist,
      audioRef,
      fullScreen,
      currentSong,
      back,
      open,
      cdWrapper,
      enter,
      afterEnter,
      leave,
      afterLeave,
      togglePlaying,
      playIcon,
      miniIcon,
      cdCls,
      prev,
      next,
      currentIndex,
      ready,
      error,
      disableCls,
      updateTime,
      format,
      percent,
      onProgressBarChange,
      mode,
      iconMode,
      changeMode,
      end,
      lyricLine,
      middleL,
      middleTouchStart,
      middleTouchMove,
      middleTouchEnd,
      lyricList,
      showPlayList,
      playlistRef,
      getFavoriteIcon,
      toggleFavorite
    }
  },
   components:{
     ProgressBar,
     ProgressCircle,
     Scroll,
     PlayList
   }
   }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>