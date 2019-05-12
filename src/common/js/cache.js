const SEARCH_KEY = '_search_'
const SEARCH_MAX_LENGTH = 15
const PLAY_KEY = '_play_'
const PLAY_MAX_LENGTH = 200
const FAVORITE_KEY = '_favorite_'
const FAVORITE_MAX_LENGTH = 200

const storage = window.localStorage
const getStorageItem = storage.getItem(SEARCH_KEY) ? JSON.parse((storage.getItem(SEARCH_KEY))) : []
const getStorageItemP = storage.getItem(PLAY_KEY) ? JSON.parse((storage.getItem(PLAY_KEY))) : []
const getStorageItemF = storage.getItem(FAVORITE_KEY) ? JSON.parse((storage.getItem(FAVORITE_KEY))) : []

// 查找存储里有没有搜索值并处理
function insertArray(arr, val, maxLen) {
  let index = arr.findIndex(item => {
    return item === val
  })
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch(query) {
  // 查找存储里有没有搜索值，首次搜索没有结果返回空数组
  // let searches = getStorageItem
  insertArray(getStorageItem, query, SEARCH_MAX_LENGTH)
  storage.setItem(SEARCH_KEY, JSON.stringify(getStorageItem))
  return getStorageItem
}

export function loadStorage() {
  return getStorageItem
}

export function deleteSearch(query) {
  // let searches = getStorageItem
  let index = getStorageItem.findIndex(item => {
    return query === item
  })
  if (index > -1) {
    getStorageItem.splice(index, 1)
  }
  storage.setItem(SEARCH_KEY, JSON.stringify(getStorageItem))
  return getStorageItem
}

export function clearSearch() {
  storage.clear()
  return []
}

export function savePlay(song) {
  let songs = getStorageItemP
  insertArray(songs, song, PLAY_MAX_LENGTH)
  storage.setItem(PLAY_KEY, JSON.stringify(songs))
  return songs
}
export function loadPlay() {
  return getStorageItemP
}
export function saveFavorite(song) {
  insertArray(getStorageItemF, song, FAVORITE_MAX_LENGTH)
  storage.setItem(FAVORITE_KEY, JSON.stringify(getStorageItemF))
  return getStorageItemF
}
export function deleteFavorite(song) {
  let index = getStorageItemF.findIndex(item => {
    return item.id === song.id
  })
  if (index > -1) {
    getStorageItemF.splice(index, 1)
  }
  storage.setItem(FAVORITE_KEY, JSON.stringify(getStorageItemF))
  return getStorageItemF
}
export function loadFavorite() {
  return getStorageItemF
}