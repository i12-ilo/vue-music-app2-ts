<template>
<transition name="slider">
  <music-list v-if="songs.length>0" :title="title" :bg-images="bgImage" :songs="songs"></music-list>
</transition>
</template>

<script lang="ts">
import { computed, onMounted, reactive, toRefs, watch, defineComponent } from 'vue'
import {useStore} from "vuex"
import {getSingerDetail, getAlbum} from "../../api/singer"
import MusicList from 'components/music-list/music-list.vue'
export default defineComponent({
  setup(){
    const store = useStore()
    const state = reactive({
      songs:[],
      temp:[]
    })

     const title =  computed(()=>{
      return store.state.singer.name
    })
   const bgImage  =  computed(()=>{
      return store.state.singer.url
    })
   
    onMounted(()=>{
      initSongs()
    })
  
   
    const initSongs = ()=>{
      getSingerDetail(store.state.singer.singerId).then(res=>{
        if (res.data.code===200) {
          console.log(res.data)
          res.data.songs.forEach((item:{name:"",id:0,al:{id:0},dt:"",title:""},index:number)=>{
            (state.temp as any).push(
              {
                name:item.name,
                id:item.id,
                albumId:item.al.id,
                duration:item.dt,
                singer:title
            })
          })
        }
      })
    }

    const getAlubmInfo=()=>{
      state.temp.forEach((item:{albumId:number,imgUrl:"",albumName:""},index) => {
        getAlbum(item.albumId).then(res=>{
          item.imgUrl = res.data.album.blurPicUrl
          item.albumName = res.data.album.name
           if (index === state.temp.length-1) {
              state.songs = state.temp;
          }
        })
      })
      
    }

    watch(()=>state.temp.length,(newValue,oldValue)=>{
      if (newValue > 0) {
        getAlubmInfo()
      }
    })

   return {
      ...toRefs(state),
      initSongs,
      getAlubmInfo,
      title,
      bgImage
    }
  },
  components:{
    MusicList 
  }

})
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>