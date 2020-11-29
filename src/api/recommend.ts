import Axios from './base'
// 推荐歌单
export function getRecommend(url:string, limit:number) {
  return Axios.get(url, {
    params: {
      limit
    }
  })
}

// 推荐mv
export function RecomMV(url:string) {
  return Axios.get(url)
}

// 推荐新音乐
export function RecomNewSong(url:string) {
  return Axios.get(url)
}

// 获取歌曲列表
export function getSongList (id:number){
  return Axios.get('/playlist/detail',{
    params:{
      id
    }
  })
}