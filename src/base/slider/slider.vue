<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script lang="ts">
  import {addClass} from '../../common/js/dom'
  import BScroll from "better-scroll";
  import {reactive, onMounted,PropType, onUnmounted, ref, toRefs,defineComponent, UnwrapRef } from 'vue'
  interface ArrayType{
    length:number
  }
 
  export default defineComponent({
    name: 'slider',
 
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    setup(props,context) {
      const state = reactive({
        dots:Array as PropType<ArrayType>,
        currentPageIndex: 0,
        children:[],
        timer:0
      });
      let sliderWrapper:any = null;
      const slider = ref<null|HTMLElement>(null)
      const sliderGroup = ref<null| HTMLElement>(null)
      onMounted(()=>{
        setTimeout(() => {
         setSliderWidth(false);
         initSlider()
         initDots()
         if (props.autoPlay) {
            play()
          }
        }, 20)
        window.addEventListener('resize', () => {
          if (!sliderWrapper) {
            return
          }
          setSliderWidth(true)
          sliderWrapper.refresh()
        })
      })

      onUnmounted(()=>{
         clearTimeout(state.timer)
      })
       const setSliderWidth = (isResize:boolean)=>{
         (state.children as any) = (sliderGroup.value as HTMLElement).children
         let width = 0
         let sliderWidth =slider.value?.clientWidth
         for (let i = 0; i < state.children.length; i++) {
           let child = (state.children[i] as HTMLElement)
           addClass(child,'slider-item')
           child.style.width = sliderWidth + 'px'
           child.style.float="left"
           width += (sliderWidth as number)
         }
         if (props.loop && !isResize) {
           width += 2 * (sliderWidth as number)
         }
         (sliderGroup.value as HTMLElement).style.width = width + 'px'
       }
     const  initSlider =()=> {
         sliderWrapper = new BScroll(slider.value as HTMLElement, {
           scrollX: true,
           scrollY: false,
           momentum: false,
           snap: true,
           snapLoop: props.loop,
           snapThreshold: 0.3,
           snapSpeed: 400
         });
         sliderWrapper.on('scrollEnd', () => {
           console.log(sliderWrapper,"slider里的")
           let pageIndex = sliderWrapper.getCurrentPage().pageX
           if (props.loop) {
             pageIndex -= 1
           }
           state.currentPageIndex = pageIndex
           if (props.autoPlay) {
             clearTimeout(state.timer)
             play()
           }
         })
       }
     const  initDots =()=> {
         state.dots = new Array((sliderGroup.value as HTMLElement).children.length)
       }
     const play= () =>{
         let pageIndex = state.currentPageIndex + 1
         if (props.loop) {
           pageIndex += 1
         }
         state.timer = setTimeout(() => {
           console.log(sliderWrapper)
          sliderWrapper.goToPage(pageIndex, 0, 400)
         }, props.interval)
       }
       return {
         ...toRefs(state),
         initSlider,
         play,
         initDots,
         setSliderWidth,
         slider,
         sliderGroup
       }
    }
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        background-color:red
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
