import {playMode} from '../common/js/config'
import {loadSearch, loadPlay, loadFavorite} from "../common/js/cache"
import {songType} from "../components/songType"
export interface topListItemType{
  id:number,
  picUrl:string,
  songList:Array<songType>,
  name:string
}
const state = {
  singer:{},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}
 
export default state;