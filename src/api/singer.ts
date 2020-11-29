import Axios from './base'

// 获取热门歌手
export function hotSinger() {
    return Axios.get('/artist/list', {
        params: {
            initial: -1,
            limit: 5,
            area:16
        }
    })
}

// 根据不同开头字母返回不同的歌手信息
export function letterSinger(letter) {
    return Axios.get('/artist/list', {
        params: {
            initial: letter,
            limit: 4,
            area:16
        }
    })
}

// 根据歌手id返回歌曲的详细信息
export function getSingerDetail(singerId){
    return Axios.get('/artist/songs',{
        params:{
            order:'hot',
            limit:30,
            id:singerId
        }
    })
}

//  根据专辑id获取专辑信息

export function getAlbum(songId){
    return Axios.get('/album',{
        params:{
            id:songId
        }
    })
}
