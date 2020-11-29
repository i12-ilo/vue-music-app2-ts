<template>
  <div class="recommend" ref="recomment">
    <scroll ref="scrollT" class="recommend-content" :data="discList">
    <div>
      <div v-show="recommends.length" class="slider-wrapper" ref="sliderWrapper">
        <div class="sliderContainer">
          <!-- <div className="before"></div> -->
          <div class="swiper-container">
             <div class="swiper-wrapper">
             <div class="swiper-slide" v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" /> 
              </a>
              <!-- <a href="" style="color:red">{{item.id}}</a> -->
              <!-- slider{{item.id}} -->
             </div>
             </div>
              <!-- 如果需要分页器 -->
              <div class="swiper-pagination"></div>
           </div>
          </div>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li
          @click='selectItem(item)'
           v-for="item in discList"
           :key="item.id"
            class="item"
          >
            <div class="icon">
               <img width="60" height="60" v-lazy="item.picUrl" src="../../assets/logo.png"/>
            </div>
            <div class="text">
              <h2 class="name" v-html="item.name"></h2>
              <p class="artistName" v-html="item.copywriter.substring(0,4)"></p>
            </div>
          </li>
        </ul>
       </div>
    </div> 
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
// import Slider from "base/slider/slider.vue";
import Swiper from 'swiper';
import { defineComponent } from 'vue'
import Scroll from "base/scroll/scroll.vue";
import Loading from '../../base/loading/loading.vue'
import { RecomMV, getRecommend } from "../../api/recommend";
import { reactive, toRefs, onMounted, ref, computed, watch } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as Types from "../../store/mutation-types"
import {ScrollType} from "../ScrollType"
export default defineComponent({
  setup () {
    const state = reactive({
      recommends: [],
      discList: [],
      checkloaded: false,
    });

    const recomment = ref<null|HTMLElement>(null);
    const scrollT = ref<null | HTMLElement | ScrollType>(null);
    const router = useRouter()
    const store = useStore()
     const playlist = computed(()=>{
        return store.getters.playlist
      })

      watch(()=>playlist.value.length,()=>{
        handlePlaylist(playlist)
      })
    const handlePlaylist = (playlist:any) => {
      const bottom = playlist.length > 0 ? "60px" : "";
      (recomment.value as HTMLElement).style.bottom = bottom;
      (scrollT.value as ScrollType).refresh();
    };
    const selectItem = (item:any)=>{
      router.push({
        path:`/recommend/${item.id}`
      })
      store.commit(Types.SET_DISC,item)
    }
    onMounted(() => {
  const mySwiper = new Swiper(".swiper-container", {
        loop:true, // 循环模式选项
        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination",
          bulletActiveClass: 'my-bullet-active'
        },
        autoplay:{
          delay:1000
        }
        
      });
      RecomMV("/personalized/mv").then((res) => {
        state.recommends = res.data.result;
        console.log(state.recommends)
      })
      getRecommend("/personalized", 10).then((res) => {
        state.discList = res.data.result;
      })
    });

    return {
      ...toRefs(state),
      handlePlaylist,
      scrollT,
      recomment,
      selectItem
    };
  },

  components: {
    // Slider,
    Scroll,
    Loading
  }
})
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
.sliderContainer {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  /* height: 100%; */
  margin: auto;
  // background: white;
  transform:translate3d(0,0,0);
  overflow:hidden;
  // .before {
  //   position: absolute;
  //   top: -300px;
  //   height: 400px;
  //   width: 100%;
  //   // background: $color-theme;
  //   z-index: 1;
  // }
  .swiper-container {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
    margin: auto; 
    // border-radius: 6px;
    .swiper-slide {
      // position: absolute;
      // display: block;
      width: 100%;
      height: 100%; 
      img {
        width: 100%;
        height: 100%;
      }
    }
    .my-bullet-active{
    background: #ffcd32;
    opacity: 1;
   }
  }
}
.swiper-pagination {
  bottom: 10px;
  left: 0;
  width: 100%;
  height:10px;
  z-index:3
}

.recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
