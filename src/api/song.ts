import Axios from './base'


// 根据歌曲id获取播放的url
export function getUrl(id) {
    return Axios.get('/song/url', {
        params: {
          id
        }
    })
}

export function getLyric(mid) {
  return Axios.get('/lyric',{
    params:{
      id: mid
    }
  })
}