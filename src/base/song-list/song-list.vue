<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" :key="song.id" class="item" v-for="(song, index) in songs">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import {songType} from "../../components/songType";
  export default defineComponent({
    props: {
      songs: {
        type: Array
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    setup(props,context){
      const selectItem = (item:any, index:number) => {
        context.emit('select', item, index)
      }
      
      const getDesc = (song:songType) => {
        // console.log(song)
        return `${song.singer}·${song.albumName}`
      }
     
      const getRankCls = (index:number) => {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      }
     const  getRankText = (index:number) =>{
        if (index > 2) {
          return index + 1
        }
      }
      return {
        selectItem,
        getDesc,
        getRankCls,
        getRankText
      }
    }
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>