// TODO: Delete this file or just the hrefFromPath function if we continue to not use it

export function hrefFromPath(path) {  // TODO: Need to deal with when path includes params
  if (typeof(path) === 'string') path = JSON.parse(path)
  let href = 'http://' + path.host + path.path
  const queryLength = Object.keys(path.query).length
  if (queryLength > 0) {
    href += '?'
    let count = 0
    for (const [key, value] of Object.entries(path.query)) {
      href += key + '=' + value
      count++
      if (count < queryLength) {
        href += '&'
      }
    }
  }
  return href  // TODO: Maybe we need to url encode this?
}