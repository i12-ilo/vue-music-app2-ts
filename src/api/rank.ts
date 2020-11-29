import Axios from './base'
export function getTopList(){
    return Axios.get('/toplist/detail')
}

export function getMusicList(id){
    return Axios.get('/playlist/detail',{
        params:{
            id
        }
    })
}