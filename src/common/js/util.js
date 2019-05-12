export function shuffle(_arr) {
  let arr = _arr.slice()
  let b = []
  while (arr.length > 0) {
    let index = parseInt(Math.random() * (arr.length - 1))
    b.push(arr[index])
    arr.splice(index, 1)
  }
  return b
}
// 节流函数
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}