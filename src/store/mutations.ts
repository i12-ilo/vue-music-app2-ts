import * as types from "./mutation-types"
import {SingerType} from "../components/SingerType"
// import {stateType} from "./state"
const mututaions = {
    [types.SET_SINGER](state:any,singer:SingerType){
        console.log('xxxx',singer)
        state.singer.singerId = singer.singerId
        state.singer.url = singer.url;
        state.singer.name = singer.name;
    },
      [types.SET_PLAYING_STATE](state:any, flag:boolean) {
        state.playing = flag
      },
      [types.SET_FULL_SCREEN](state:any, flag:boolean) {
        state.fullScreen = flag
      },
      [types.SET_PLAYLIST](state:any, list:any) {
        state.playlist = list
      },
      [types.SET_SEQUENCE_LIST](state:any, list:any) {
        state.sequenceList = list
      },
      [types.SET_PLAY_MODE](state:any, mode:string) {
        state.mode = mode
      },
      [types.SET_CURRENT_INDEX](state:any, index:number) {
        state.currentIndex = index
      },
      [types.SET_DISC](state:any, disc:any) {
        state.disc = disc
      },
      [types.SET_TOP_LIST](state:any, topList:any) {
        state.topList = topList
      },
      [types.SET_SEARCH_HISTORY](state:any, history:any) {
        state.searchHistory = history
      },
      [types.SET_PLAY_HISTORY](state:any, history:any) {
        state.playHistory = history
      },
      [types.SET_FAVORITE_LIST](state:any, list:any) {
        state.favoriteList = list
      }
}

export default mututaions