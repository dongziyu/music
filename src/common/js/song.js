import {
  getLyric
} from 'api/song'

// 创建一个类，赋值歌曲相关参数
export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.status === 200) {
          this.lyric = res.data
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

// 传入歌曲信息参数，创建歌曲
export function createSong(musicData) {
  const isFnote = isNaN(musicData.fnote)
  return new Song({
    id: isFnote ? musicData.songid : musicData.id,
    mid: isFnote ? musicData.songmid : musicData.mid,
    singer: filterSinger(musicData.singer),
    name: isFnote ? musicData.songname : musicData.name,
    album: isFnote ? musicData.albumname : musicData.album.name, // 专辑名称
    duration: musicData.interval, // 歌曲时长
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${isFnote ? musicData.albummid : musicData.album.mid}.jpg?max_age=2592000`,
    url: `https://v1.itooi.cn/tencent/url?id=${isFnote ? musicData.songmid : musicData.mid}&quality=192`
  })
}
// 筛选出歌手姓名
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
