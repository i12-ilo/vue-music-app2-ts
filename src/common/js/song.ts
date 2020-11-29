
export default class Song {
  constructor({id, singer, name, album, duration, image}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    singer: musicData.singer,
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image:musicData.image
})
}