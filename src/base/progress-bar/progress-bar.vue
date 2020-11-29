<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {prefixStyle} from '../../common/js/dom'
import { watch, ref, defineComponent, Events } from 'vue'

const progressBtnWidth = 16
const transform = prefixStyle('transform')
interface touchType{
    initiated:boolean;
    startX:number;
    left:number
}
  export default defineComponent({
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    setup(props:any,context:any){
      let touch = {
      left: 0,
      startX: 0,
      initiated: false
    }
        const progress = ref<null | HTMLElement>(null)
        const progressBar = ref<null| HTMLElement>(null)
        const progressBtn = ref<null | HTMLElement>(null)
        const progressTouchStart = (e:TouchEvent)=>{
        touch.initiated = true
        touch.startX = e.touches[0].pageX
        touch.left = (progress.value as HTMLElement).clientWidth
        }

        const progressTouchMove = (e:TouchEvent)=>{
       if (!touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - touch.startX
        const offsetWidth = Math.min((progressBar.value as HTMLElement).clientWidth - progressBtnWidth, Math.max(0, touch.left + deltaX))
        _offset(offsetWidth)
        }
        
        const progressTouchEnd = ()=>{
             touch.initiated = false
             _triggerPercent()
        }

        const progressClick = (e:MouseEvent)=>{
          const rect = (progressBar.value as HTMLElement).getBoundingClientRect()
          const offsetWidth = e.pageX - rect.left
          _offset(offsetWidth)
          // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
          // this._offset(e.offsetX)
          _triggerPercent()
        }
        const _triggerPercent = ()=>{
        const barWidth = (progressBar.value as HTMLElement).clientWidth - progressBtnWidth
        const percent = (progress.value as HTMLElement).clientWidth / barWidth
        context.emit('percentchange', percent)
        }
        const _offset = (offsetWidth:number)=>{
         (progress.value as HTMLElement).style.width = offsetWidth+'px';
         (progressBtn.value as HTMLElement).style[(transform as any)] = `translate3d(${offsetWidth}px,0,0)`
        }
        watch(()=>props.percent,(newPercent)=>{
         if (newPercent >= 0 && !touch.initiated) {
          const barWidth = (progressBar.value as HTMLElement).clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          _offset(offsetWidth)
        }
        })
        return {
            progress,
            progressBar,
            progressBtn,
            progressTouchStart,
            progressTouchMove,
            progressTouchEnd,
            progressClick
        }
    }
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>