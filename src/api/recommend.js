import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    format: 'json'
  })
  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = 'https://v1.itooi.cn/tencent/songList/hot'
  const data = Object.assign({}, {
    cat: '全部',
    pageSize: 30,
    page: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(id) {
  const url = 'https://v1.itooi.cn/tencent/songList'

  const data = Object.assign({}, {
    id
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
