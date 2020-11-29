import Axios from './base'
export function getHotKey(){
    return Axios.get('/search/hot')
}

export function search(keywords){
    return Axios.get('/search',{
        params:{
            keywords
        }
    })
}