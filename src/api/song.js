import axios from 'axios'

export function getLyric(id) {
  const url = 'https://v1.itooi.cn/tencent/lrc'
  const data = Object.assign({}, {
    id
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res)
  })
}
