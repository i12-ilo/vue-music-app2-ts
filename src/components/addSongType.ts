export interface addSongType{
    show:()=>void,
    hide:()=>void,
    selectSong:([],index:number)=>void,
    selectSuggest:()=>void,
    switchItem:(index:number)=>void,
    onQueryChange:(query:string)=>void,
    blurInput:()=>void,
    deleteSearchHistory:()=>void,
    addQuery:(query:string)=>void
}