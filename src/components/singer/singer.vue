<template>
  <div class="singer" ref="singerRef">
    <list-view v-if='singers&&singers.length>0' @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, watch, toRefs, ref,computed, defineComponent,PropType } from "vue";
import { hotSinger, letterSinger } from "../../api/singer";
import {useRouter} from "vue-router";
import ListView from 'base/listview/listView.vue'
import {useStore} from "vuex"
import * as types from "../../store/mutation-types"
import {ListViewType} from "../../base/listViewType"
interface getSongerType{
  name:string
  img1v1Url:string,
  id:number
}

interface tempType{
  name:string;
  avatar:string;
  id:number
}

interface letterArrType{
  title:string;
  item:Array<tempType>;
}
export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const tempTypeTest:tempType ={
      name:"",
      avatar:"",
      id:0
    } 
    const t = {
    title:"",
    item:[tempTypeTest]
    }
    const state = reactive({
      singers:[],
      letterArr:[t],
      singel:false
    });
    let hot = [t];
    const singerRef = ref<null | HTMLElement>(null)
    const list = ref<null | HTMLElement | ListViewType>(null)
    onMounted(() => {
      console.log("*****singer")
      hot = []
      getHotSingerArr().then(res=>{
        console.log(res,"======")
        let temp:tempType[]=[] 
        res.map((item:getSongerType,index:number)=>{
          temp.push({
            name:item.name,
            avatar:item.img1v1Url,
            id:item.id
          })
        })
        hot.push({
          title:"热门",
          item:temp
        })
      })
      getSingerByLetter()
    });
    // 按照字母分类的歌手列表
    const getSingerByLetter = ()=>{
      state.letterArr = []
      console.log('====')
        const letterItems = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        for (let i = 0;i<26;i++){
          letterSinger(letterItems[i]).then(res=>{
            let temp:tempType[]= [];
            if (res&&res.data&&res.data.artists){
              res.data.artists.map((item:getSongerType,index:number)=>{
                temp.push({
                  name:item.name,
                  avatar:item.img1v1Url,
                  id:item.id
                })
              })
            }
            state.letterArr.push({
              title:letterItems[i],
              item:temp
            })
          if(state.letterArr.length==26&&hot.length==1){
              normalizaSinger(hot,state.letterArr)
          }
          })
        }
    }
    // 热门歌手列表
    const getHotSingerArr = async()=>{
      const result = await hotSinger()
      return result.data.artists
    }
    // 拿到热门歌手和按照字母分类的歌手列表
    const normalizaSinger = (hotList:any,allLetterSinger:any) => {
      console.log("begin")
      //  想拿到的allLetterSinger数组的结构是 [{title:'a',items:[]}]
      // 但这个结构不一定是个有序的，在操作它之前可以先排序
      allLetterSinger.sort((a:any,b:any)=>{
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // console.log(allLetterSinger)
       state.singers = hotList.concat(allLetterSinger)
       console.log(state.singers,"state.singer")
    }
    // 跳转到歌手详情页
    const selectSinger = (id:string,url:string,name:string)=>{
      router.push(`/singer/${id}`)
      console.log('=====',id,url,name)
      store.commit(types.SET_SINGER,{singerId:id,url,name});
    }

    watch(()=>state.letterArr.length,(cur,pre)=>{
    //  监视数据的变化，一旦获取到了数据，即可更改state.singers
    console.log(state.letterArr)
     if (cur===26&&hot.length===1){
       normalizaSinger(hot,state.letterArr)
     }
   })
   const handlePlaylist = (playlist:any)=>{
     const bottom = playlist.value.length>0?'60':"";
     (singerRef.value as HTMLElement).style.bottom = bottom+"px";
     (list.value as ListViewType).refresh()
   }
    const playlist = computed(()=>{
        return store.getters.playlist
      })

      watch(()=>playlist.value.length,()=>{
        handlePlaylist(playlist)
      })
   
   return {
     ...toRefs(state),
     getSingerByLetter,
     getHotSingerArr,
     normalizaSinger,
     selectSinger,
     singerRef,
     list,
     handlePlaylist
   }
},
  components:{
   ListView:ListView
 }
});
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>