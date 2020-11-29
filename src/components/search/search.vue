<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
        <Scroll class="shortcut" ref="shortcutRef" :data="shortcut">
          <div>
              <div class="hot-key">
                <h1 class="title">热门搜索</h1>
                <ul>
                    <li @click="addQuery(item.first)" class="item" v-for="item in hotKey" :key="item.first">
                        <span>{{item.first}}</span>
                    </li>
                </ul>
            </div>
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="deletecAll">
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <SearchList v-show="searchHistory.length>0" :searches="searchHistory" @select="addQuery" @delete="deleteOne"></SearchList>
            </div>
          </div>
        </Scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <Suggest @select="saveSearch" @listscroll="blurInput" :query="query" ref="suggest"></Suggest>
    </div>
    <Confirm @confirm="clearSearchHistory" ref="confirmRef" text="是否清空所有搜索历史" confirmBtnText="清空"></Confirm>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import SearchBox from 'base/search-box/search-box.vue'
  import SearchList from 'base/search-list/search-list.vue'
  import Scroll from 'base/scroll/scroll.vue'
  import Confirm from 'base/confirm/confirm.vue'
  import Suggest from 'components/suggest/suggest.vue'
  import {getHotKey} from '../../api/search'
  import { onMounted, reactive, toRefs, ref, computed, watch, defineComponent } from 'vue'
  import { useStore } from 'vuex'
  import { ScrollType } from "../ScrollType"
  import {SuggestType} from "../SuggestType"
  import {ConfirmType} from "../../base/ConfirmType"
  import {SearchBoxType} from "../../base/SearchBoxType"

  export default defineComponent({
      setup(){
          const state = reactive({
              hotKey:[],
              query:""
          })
          const store = useStore()
          const searchResult = ref<null | HTMLElement>(null)
          const suggest = ref<null | HTMLElement | SuggestType>(null)
          const shortcutWrapper = ref<null | HTMLElement>(null)
          // const shortcut = ref(null)
          const confirmRef = ref<null | HTMLElement |ConfirmType>(null)
          const searchBox = ref<null | HTMLElement | SearchBoxType>(null)
          const shortcutRef = ref<null | HTMLElement | ScrollType>(null)
        //   const sorcuT = computed(()=>{

        //   })
          const searchHistory:any = computed(()=>{
            return  store.getters.searchHistory
            })
          const shortcut = computed(()=>{
              return state.hotKey.concat(searchHistory)
          })
          onMounted(()=>{
              _getHotKey()
              console.log(searchHistory.value.length)
          })
          
          const saveSearch = ()=>{
            store.dispatch('saveSearchHistory',state.query)
          }
          watch(()=>searchHistory.value.length,(newValue)=>{
            console.log(newValue)
          })

          const deleteOne = (item:any)=>{
           store.dispatch('deleteSearchHistory',item)
          }
          const deletecAll = ()=>{
            // console.log(confirmRef.value)
            (confirmRef.value as ConfirmType).show()
            store.dispatch('clearSearchHistory')
          }
         const  handlePlaylist = (playlist:any) =>{
           const bottom = playlist.length > 0 ? '60px' : '';

            (searchResult.value as HTMLElement).style.bottom = bottom;
            (suggest.value as SuggestType).refresh();

            (shortcutWrapper.value as HTMLElement).style.bottom = bottom;
             (shortcutRef.value as ScrollType).refresh()
         }
         const  showConfirm = () => {
           (confirmRef.value as ConfirmType).show()
         }
          
         const  _getHotKey = () => {
              getHotKey().then((res) => {
              state.hotKey = res.data.result.hots
           })
         }
         const addQuery = (query:string)=>{
             state.query = query;
             (searchBox.value as SearchBoxType).setQuery(query)
             onQueryChange(query)
             saveSearch()
         }
         const onQueryChange = (query:string)=>{
           state.query = query
         }
         const blurInput = ()=>{
           (searchBox.value as SearchBoxType).blur()
         }
         watch(()=>state.query,(newQuery)=>{
           if (!newQuery){
             setTimeout(()=>{
               (shortcutRef.value as ScrollType).refresh()
             },20)
           }
         })
         return {
             ...toRefs(state),
             confirmRef,
             searchBox,
             addQuery,
             onQueryChange,
             blurInput,
             saveSearch,
             searchHistory,
             SearchList,
             deleteOne,
             deletecAll,
             Confirm,
             shortcut,
             Scroll,
             shortcutRef
            //  searchResult,
            //  shortcutWrapper,
            //  suggest,
            //  searchResult,
            //  shortcut,
            //  sorcuT,
            
            //  handlePlaylist,
            //  searchResult,
            //  showConfirm

         }
      
    },
    components: {
      SearchBox,
      Suggest
    //   SearchList,
    //   Scroll,
    //   Confirm,
      
    }
  })
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>