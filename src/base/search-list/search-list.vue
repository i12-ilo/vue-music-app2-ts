<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent} from 'vue'
  export default defineComponent({
    props: {
      searches: {
        type: Array
      }
    },
    setup(props:any,context:any){
      onMounted(()=>{
        console.log('fasdf')
      })
        const selectItem = (item:any)=>{
            context.emit('select',item)
        }
        const deleteOne = (item:any) =>{
          
            context.emit('delete',item)
        }
        return {
            selectItem,
            deleteOne
        }
    }
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>