import {playMode} from 'common/js/config'
import {loadStorage, loadPlay, loadFavorite} from 'common/js/cache'
// state管理的数据
const state = {
  singer: {},

  playing: false, // 播放状态
  fullScreen: false,
  playlist: [], // 当前播放歌曲列表
  sequenceList: [], // 不同模式歌曲列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲序号
  disc: {},
  topList: {}, // 推荐榜单
  searchHistory: loadStorage(), // 搜索历史
  playHistory: loadPlay(), // 播放历史
  favoriteList: loadFavorite()
}
export default state
