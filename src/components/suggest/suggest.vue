<template>
  <scroll
    class="suggest"
    ref="suggest"
    :data="result"
    :pullup="pullup"
    @scrolltoend="searchMore"
    :beforeScroll="beforeScroll"
    @beforescroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result" :key="item.id">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text" v-html="item.name"></p>
        </div>
      </li>
      <Loading v-show="hasMore"></Loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script lang="ts">
import { reactive, watch, toRefs, defineComponent,ref} from "vue";
import { search } from "../../api/search";
import Scroll from "base/scroll/scroll.vue";
import Loading from "base/loading/loading.vue";
import {useStore} from "vuex"
import NoResult from "base/no-result/no-result.vue"
import {ScrollType} from "../ScrollType"

export default defineComponent({
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  setup(props,context) {
    var store =  useStore()
    const state = reactive({
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll:true,

    });
    let moreResult:any[] = [];
    const suggest  = ref<null | HTMLElement | ScrollType>(null);
    const searchByKeywords = (keywords:string) => {
      if (keywords) {
        search(keywords).then((res) => {
          // console.log('**&&',res)
          moreResult = res.data.result.songs;
          (state.result as any) = moreResult&&moreResult.slice(0, 10);
          console.log(state.result);
        });
      }
    };
    const searchMore = () => {
      if (!state.hasMore) {
        return "";
       }
      (state.result as any) = moreResult;
      console.log(state.result);
     }

     const  selectItem  = (item:{name:"",artists:[{img1v1Url:"",name:""}],id:number})=>{
      let song = {
        name:item.name,
        singer:item.artists[0].name,
        imgUrl:item.artists[0].img1v1Url,
        id:item.id
      }
      store.dispatch('insertSong',song)
      context.emit('select')
    }
    const listScroll = ()=>{
      context.emit('listscroll')
    }
     const refresh = ()=> {
       (suggest.value as ScrollType).refresh()
      }
    watch(
      () => props.query,
      (newValue) => {
        console.log("变化了");
        searchByKeywords(newValue);
      }
    );

    return {
      ...toRefs(state),
      searchByKeywords,
      searchMore,
      selectItem,
      listScroll,
      refresh
    };
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
});
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;
  opacity: 1;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>