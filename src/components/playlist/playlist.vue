<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear"  @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <Scroll ref="listContent" :refreshDelay="refreshDelay" :data="sequenceList" class="list-content">
          <transition-group name="list" tag="ul">
            <li  :key="item.id" ref="listItem" class="item" v-for="(item,index) in sequenceList"
                @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                 <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)" class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
     <Confirm  @confirm="confirmClear" ref="confirmRef" text="是否清空播放列表" confirmBtnText="清空"></Confirm>
     <AddSong ref='addSongRef'></AddSong>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, reactive, toRefs, ref, watch,defineComponent } from 'vue'
import { useStore } from 'vuex'
import Scroll from "base/scroll/scroll.vue"
import * as Types from "../../store/mutation-types"
import {playMode} from "../../common/js/config"
import Confirm from "base/confirm/confirm.vue"
import AddSong from "components/add-song/add-song.vue"
import {songType} from "../songType"
import {ScrollType} from "../ScrollType"
import {ConfirmType} from "../../base/ConfirmType"
import {addSongType} from "../addSongType"
export default defineComponent({
  setup(){
    const store = useStore()
    const state = reactive({
      showFlag:false,
      refreshDelay:100
    })
    const listContent = ref<null|HTMLElement | ScrollType>(null)
    const listItem = ref<null | HTMLCollection>(null)
    const confirmRef = ref<null | HTMLElement | ConfirmType>(null)
    const addSongRef = ref<null |HTMLElement | addSongType>(null)
    const show = ()=>{
      state.showFlag = true
      setTimeout(()=>{
        (listContent.value as ScrollType).refresh()
        scrollToCurrent(currentSong.value)
      },20)
    }
    const favoriteList = computed(()=>{
      return store.getters.favoriteList
    })
   const isFavorit = (song:songType)=>{
      const index = favoriteList.value.findIndex((item:songType)=>{
        return item.id === song.id
      })
      return index>-1
    }
      const toggleFavorite = (song:songType)=>{
      if (isFavorit(song)){
        store.dispatch('deleteFavoriteList',song)
      } else {
        store.dispatch('saveFavoriteList',song)
      }
    }

    const getFavoriteIcon = (song:songType)=>{
      if (isFavorit(song)){
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    } 

    const hide = ()=>{
      state.showFlag = false
    }
    const mode = computed(()=>{
      return store.getters.mode
    })
    const sequenceList = computed(()=>{
      return store.getters.sequenceList
    })
    const currentSong = computed(()=>{
      return store.getters.currentSong
    })
    const playList = computed(()=>{
      return store.getters.playList
    })
    const getCurrentIcon = (item:songType)=>{
      if (currentSong.value.id === item.id){
        return 'icon-play'
      } 
        return ''
    }
    const selectItem = (item:any,index:number)=>{
      if (playMode.random === mode.value){
         index = playList.value.findIndex((song:songType)=>{
           return song.id === item.id
         })
      }
      store.commit(Types.SET_CURRENT_INDEX,index)
      store.commit(Types.SET_PLAYING_STATE,true)
    }
    const showConfirm = ()=>{
      (confirmRef.value as ConfirmType).show()
    }
    const scrollToCurrent = (current:songType)=>{
      var index = sequenceList.value.findIndex((song:songType)=>{
        console.log('****',song)
        return current.id=== song.id;
      })
      (listContent.value as ScrollType).scrollToElement(((listItem.value as HTMLCollection)[index]),300)
    }
    const deleteOne = (item:songType)=>{
      store.dispatch('deleteSong',item)
    }
    const confirmClear = ()=>{
      store.dispatch('deleteSongList')
      hide()
    }
    const addSong = ()=>{
      (addSongRef.value as addSongType).show()
    }
    watch(()=>{
      return currentSong.value
    },(newSong,oldSong)=>{
      if (!state.showFlag || newSong.id === oldSong.id){
        return 
      }
      scrollToCurrent(newSong)
    })
    return {
      ...toRefs(state),
      show,
      hide,
      sequenceList,
      listContent,
      getCurrentIcon,
      selectItem,
      currentSong,
      playList,
      listItem,
      scrollToCurrent,
      deleteOne,
      showConfirm,
      confirmRef,
      confirmClear,
      addSongRef,
      addSong,
      toggleFavorite,
      getFavoriteIcon
    }
  },
  components:{
    Scroll,
    Confirm,
    AddSong
  }
})
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>