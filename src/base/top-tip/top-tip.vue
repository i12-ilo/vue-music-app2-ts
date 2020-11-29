<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from 'vue'

  export default defineComponent({
    props: {
      delay: {
        type: Number,
        default: 2000
      }
    },
    setup(props,context){
        const state = reactive({
            showFlag:false
        })
        const timer:any = undefined;
        const show = ()=>{
            state.showFlag = true
            clearTimeout(timer);
            (timer as any)= setTimeout(()=>{
                hide()
            },props.delay)
        }
        const hide = ()=>{
            state.showFlag = false
        }

        return {
            ...toRefs(state),
            show,
            hide
        }
    }
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 500
    background: $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.3s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>