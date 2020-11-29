<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-images="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script lang="ts">
import MusicList from 'components/music-list/music-list.vue'
import {getMusicList} from '../../api/rank'
import { computed, onMounted, reactive, toRefs,defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

  export default defineComponent({
      setup(){

          const store = useStore()
          const router = useRouter()
          const state = reactive({
              songs:[{
                 id:0,
                 name:"",
                 singer:"",
                 albumName:"",
                 imgUrl:""
              }],
              rank:true
          })
         const topList = computed(()=>{
              return store.getters.topList
          })
          const title = computed(()=>{
              return topList.value.name
          })
          const bgImage = computed(()=>{
              return topList.value.picUrl  
          })
          onMounted(()=>{
              console.log(topList.value,"90f9ads0f")
              _getMusicList()
          })
          const _getMusicList = ()=>{
              if (!topList.value.id) {
                  router.push('/rank')
                  return
              }
              getMusicList(topList.value.id).then(res=>{
                  console.log(res.data.playlist.tracks)
                  res.data.playlist.tracks.forEach((item:any)=>{
                    //   console.log(item.ar[0].name)
                      state.songs.push({
                          id:item.id,
                          name:item.name,
                          singer:item.ar[0].name,
                          albumName:item.al.name,
                          imgUrl:item.al.picUrl
                      })
                  })
              })
          }

          return {
              ...toRefs(state),
              title,
              bgImage
          }

      },
    components: {
      MusicList
    }
  })
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>