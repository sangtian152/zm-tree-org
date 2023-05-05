export function isFunction (func) {
  return (typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]')
}

// 生成随机字符串, e表示长度
export function randomString(e) {  
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
  a = t.length,
  n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}

export function snapToGrid (grid, pendingX, pendingY, scale = 1) {
  const x = Math.round((pendingX / scale) / grid[0]) * grid[0]
  const y = Math.round((pendingY / scale) / grid[1]) * grid[1]

  return [x, y]
}

export function getSize (el) {
  const rect = el.getBoundingClientRect()

  return [
    parseInt(rect.width),
    parseInt(rect.height)
  ]
}

export function restrictToBounds (value, min, max) {
  if (min !== null && value < min) {
    return min
  }

  if (max !== null && max < value) {
    return max
  }

  return value
}
