<template>
<transition name="slide">
    <music-list :title="title" :bg-images="bgImage" :songs="song"></music-list>
  </transition>
</template>

<script lang="ts">
import { computed, onMounted, reactive, toRefs, defineComponent } from 'vue';
import { useStore } from 'vuex';
import {getSongList} from "../../api/recommend"
import MusicList from 'components/music-list/music-list.vue'
import { useRouter } from 'vue-router';
import {songType} from "../songType"
export default defineComponent({

  setup() {
      let objT:songType={
          id:0,
          name:"",
          albumName:"",
          singer:"",
          imgUrl:""
      }
      const state = reactive({
          song:[objT]
      })

      const store = useStore()
      const router = useRouter()
      const title = computed(()=>{
          return store.getters.disc.name
      })
      const bgImage = computed(()=>{
          return store.getters.disc.picUrl
      })
      onMounted(()=>{
          console.log(store.getters.disc.id)
          if (!store.getters.disc.id){
              router.push('/recommend')
          }
          getSongList(store.getters.disc.id).then(res=>{
              console.log(res.data.playlist.tracks)
              normalizeSongs(res.data.playlist.tracks)
          })
      })
      const normalizeSongs=(list:any)=>{
          list.forEach((item:any)=>{
              state.song.push({
                  id:item.id,
                  name:item.name,
                  albumName:item.name,
                  singer:item.ar[0].name,
                  imgUrl:item.al.picUrl
              })
          })
      }
      return {
          title,
          bgImage,
          ...toRefs(state)
      }
  },
  components:{
      MusicList
  }
});
</script>

<style>
</style>