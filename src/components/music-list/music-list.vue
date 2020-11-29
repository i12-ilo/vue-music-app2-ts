<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll :data="songs" @scroll="scroll"
            :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script lang="ts">
  import Scroll from 'base/scroll/scroll.vue'
  import Loading from 'base/loading/loading.vue'
  import SongList from 'base/song-list/song-list.vue'
  import {prefixStyle} from '../../common/js/dom'
//   import {playlistMixin} from 'common/js/mixin'
  import { onMounted, reactive, toRefs, watch, ref, computed, defineComponent } from 'vue'
 
  import {useRouter} from "vue-router"
  import {useStore} from "vuex"
  import {ScrollType} from "../ScrollType"

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  interface posType{
    y:number
  }

   export default defineComponent({
     props: {
       bgImages: {
        type: String,
        default: ''
       },
       songs: {
        type: Array
       },
       title: {
        type: String,
        default: ''
       },
       rank: {
        type: Boolean,
        default: false
       }
     },
     setup(props,context){
         const router = useRouter()
         const store = useStore();
         const state = reactive({
             scrollY:0,
             probeType:3,
             listenScroll: true,
             imageHeight:0,
             minTransalteY:0
         })
         let bgImage = ref<null|HTMLElement>(null)
         let list = ref<null | HTMLElement | ScrollType>(null)
         let playBtn = ref<null | HTMLElement>(null)
         let layer = ref<null | HTMLElement>(null)
         let filter = ref<null | HTMLElement>(null)
         onMounted(()=>{
             (list.value as ScrollType).$el.style.top = `${state.imageHeight}px`
             state.imageHeight = (bgImage.value as HTMLElement).clientHeight
             state.minTransalteY = -state.imageHeight + RESERVED_HEIGHT;
             (list.value as ScrollType).$el.style.top = `${state.imageHeight}px`
         })
        const bgStyle = computed(()=>{
           console.log(props)
           return `background-image:url(${props.bgImages})`
         })
        const handlePlaylist = (playlist:any) => {
          const bottom = playlist.value.length > 0 ? '60px' : '';
          (list.value as ScrollType).$el.style.bottom = bottom;
          (list.value as ScrollType).refresh()
        }
        const scroll = (pos:posType) => {
           state.scrollY = pos.y
        }
        const back = () => {
           router.back()
        }
        const selectItem = (item:any, index:number) => {
          console.log("selectPlay,sdfasf")
          store.dispatch('selectPlay',{
            list:props.songs,
            index:index
          })
        }
         const random = ()=>{   
           store.dispatch('randomPlay',{
             list:props.songs
            }) 
        }
      watch(()=>state.scrollY,(newVal) =>{
        let translateY = Math.max(state.minTransalteY, newVal)
        let scale = 1
        let zIndex = 0
        let blur = 0
        const percent = Math.abs(newVal / state.imageHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }
        (layer.value as HTMLElement).style[(transform as string)] = `translate3d(0,${translateY}px,0)`;
        (filter.value as HTMLElement).style[(backdrop as string)] = `blur(${blur}px)`
        if (newVal < state.minTransalteY) {
          zIndex = 10;
          (bgImage.value as HTMLElement).style.paddingTop = 0+"px";
            (bgImage.value as HTMLElement).style.height = `${RESERVED_HEIGHT}px`;
          (playBtn.value as HTMLElement).style.display = 'none'
        } else {
           (bgImage.value as HTMLElement).style.paddingTop = '70%';
           (bgImage.value as HTMLElement).style.height = '0px';
           (playBtn.value as HTMLElement).style.display = ''
        }
          (bgImage.value as HTMLElement).style[(transform as string)] = `scale(${scale})`;
          (bgImage.value as HTMLElement).style.zIndex = ""+zIndex;
      })
      const playlist = computed(()=>{
        return store.getters.playlist
      })

      watch(()=>playlist.value.length,()=>{
        handlePlaylist(playlist)
      })
        return {
             ...toRefs(state),
             bgImage,
             filter,
             layer,
             playBtn,
             handlePlaylist,
             scroll,
             back,
             list,
             selectItem,
             random,
             bgStyle,
             playlist
         }
     },
     components:{
         Scroll,
         Loading,
         SongList
     }
  
  
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>