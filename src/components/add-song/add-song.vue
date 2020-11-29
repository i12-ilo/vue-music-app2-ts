<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBoxRef" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <Scroll ref="songListRef" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <SongList :songs="playHistory" @select="selectSong">
              </SongList>
            </div>
          </Scroll>
          <Scroll :refreshDelay="refreshDelay" ref="searchListRef" v-if="currentIndex===1" class="list-scroll"
                  :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <Suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></Suggest>
      </div>
      <top-tip ref="topTipRef">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script lang="ts">
  import SearchBox from 'base/search-box/search-box.vue'
  import SongList from 'base/song-list/song-list.vue'
  import SearchList from 'base/search-list/search-list.vue'
  import Scroll from 'base/scroll/scroll.vue'
  import Switches from 'base/switches/switches.vue'
  import TopTip from 'base/top-tip/top-tip.vue'
  import Suggest from 'components/suggest/suggest.vue'
  import {songType} from "../songType"
  // import {searchMixin} from 'common/js/mixin'
  // import {mapGetters, mapActions} from 'vuex'
  // import Song from 'common/js/song'
import { reactive, toRefs, ref, computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import {SearchBoxType} from "../../base/SearchBoxType"
import {ScrollType} from "../ScrollType"
import {topTipType} from "../../base/TopTipType"

  export default defineComponent({
    setup(){
      const state = reactive({
        showFlag: false,
        query:'',
        showSinger: false,
        currentIndex: 0,
        songs: [],
        switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
       ]
      })
      const store = useStore()
      const songListRef = ref<null|HTMLElement | ScrollType>(null)
      const searchListRef = ref<null | HTMLElement | ScrollType>(null)
      const searchBoxRef = ref<null | HTMLElement | SearchBoxType>(null)
      const showListRef = ref<null | HTMLElement>(null)
      const topTipRef = ref<null | HTMLElement | topTipType>(null)
      const playHistory = computed(()=>{
        return store.getters.playHistory
      })
      const searchHistory = computed(()=>{
        return store.getters.searchHistory
      })
      const show = ()=>{
        state.showFlag = true
        setTimeout(() => {
          if (state.currentIndex === 0) {
            (songListRef.value as ScrollType).refresh()
          } else {
            (searchListRef.value as ScrollType).refresh()
          }
        }, 20)
      }

      const hide = ()=>{
        state.showFlag = false
      }
      const deleteSearchHistory = ()=>{
        store.dispatch('deleteSearchHistory')
        showTip()
      }
      const selectSong = (song:songType,index:number)=>{
        if (index!==0){
          store.dispatch('insertSong',song)
        }
      }
      const onQueryChange = (query:string) =>{
      state.query = query
      }
      const selectSuggest = ()=>{
        store.dispatch('saveSearchHistory',state.query)
        showTip()
      }

      const  blurInput = () => {
        (searchBoxRef.value as HTMLElement).blur()
      }
      const switchItem = (index:number)=>{
        state.currentIndex = index
      }

      const addQuery = (query:string)=>{
        (searchBoxRef.value as SearchBoxType).setQuery(query)
      }

      const showTip = ()=>{
        (topTipRef.value as topTipType).show()
      }
      return {
        ...toRefs(state),
        showListRef,
        searchListRef,
        searchBoxRef,
        show,
        hide,
        selectSong,
        songListRef,
        selectSuggest,
        switchItem,
        onQueryChange,
        blurInput,
        playHistory,
        searchHistory,
        deleteSearchHistory,
        addQuery
      }
    },
    components: {
      SearchBox,
      SongList,
      SearchList,
      Scroll,
      Switches,
      TopTip,
      Suggest
    }
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>