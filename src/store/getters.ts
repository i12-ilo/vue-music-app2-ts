export const singer = (state:any) => state.singer

export const playing = (state:any) => state.playing

export const fullScreen = (state:any) => state.fullScreen

export const playlist = (state:any) => state.playlist

export const sequenceList = (state:any) => state.sequenceList

export const mode = (state:any) => state.mode

export const currentIndex = (state:any) => state.currentIndex

export const currentSong = (state:any) => {
  return state.playlist[state.currentIndex] || {}
}

export const disc = (state:any) => state.disc

export const topList = (state:any) => state.topList

export const searchHistory = (state:any) => state.searchHistory

export const playHistory = (state:any)=> state.playHistory

export const favoriteList = (state:any) => state.favoriteList
