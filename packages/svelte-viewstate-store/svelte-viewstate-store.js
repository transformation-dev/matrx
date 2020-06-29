import {onDestroy} from 'svelte'
import {push, loc} from 'svelte-spa-router'

const subscriberQueue = []
function noop() {}
function safeNotEqual(a, b) {
  return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function')
}

export class ViewstateStore {
  constructor(storeConfig, start = noop) {
    this.storeConfig = storeConfig
    this.start = start
    this.stop = null
    this.subscribers = []
    this.scope = storeConfig.scope

    // this._set(storeConfig.defaultValue)  // This is just so value is not undefined. It gets updated by the querystring or LocalStorage 

    this.onURLChange = this.onURLChange.bind(this)
    const unsubscribe = loc.subscribe(this.onURLChange)

    if (!this.storeConfig.isGlobal) {
      onDestroy(unsubscribe)
    }
  }

  getQuerystringParam() {
    const urlSearchParams = new URLSearchParams(this.querystring)
    const valueString = urlSearchParams.get(this.storeConfig.identifier)
    if (valueString === null) {
      return {newValue: null, urlSearchParams}
    }
    let newValue = valueString
    if (this.storeConfig.type === 'Float') {
      newValue = Number.parseFloat(valueString)
    } else if (this.storeConfig.type === 'Int') {
      newValue = +valueString  // Prefer over Number.parseInt(valueString, 10) because it returns NaN for "1 abc"
    } else if (this.storeConfig.type === 'Boolean') {
      newValue = (valueString == 'true')
    }
    return {newValue, urlSearchParams}
  }

  onURLChange(newLoc) {
    this.scope = this.scope || newLoc.location
    this.location = newLoc.location
    this.querystring = newLoc.querystring

    if (!this.location.startsWith(this.scope)) {  // TODO: This needs to work for parent/child routes
      return
    }

    let {newValue} = this.getQuerystringParam()
    if (newValue != null) {
      if (this.storeConfig.updateLocalStorageOnURLChange) {
        window.localStorage[this.scope + '.' + this.storeConfig.identifier] = newValue
      }
    } else {
      newValue = window.localStorage[this.scope + '.' + this.storeConfig.identifier] || this.storeConfig.defaultValue
      ViewstateStore.queueURLUpdate(this.storeConfig.identifier, newValue)
    }
    this._set(newValue)
  }
  
  set(newValue) {
    this._set(newValue)
    window.localStorage[this.scope + '.' + this.storeConfig.identifier] = newValue
    ViewstateStore.queueURLUpdate(this.storeConfig.identifier, newValue)
  }
  
  _set(newValue) {  // Call this to update subscribers when the URL changes w/o saving to LocalStorage
    if (safeNotEqual(this.value, newValue)) {
      this.value = newValue
      if (this.stop) { // store is ready
        const runQueue = !subscriberQueue.length
        for (let i = 0; i < this.subscribers.length; i += 1) {
          const s = this.subscribers[i]
          s[1]()
          subscriberQueue.push(s, this.value)
        }
        if (runQueue) {
          for (let i = 0; i < subscriberQueue.length; i += 2) {
            subscriberQueue[i][0](subscriberQueue[i + 1])
          }
          subscriberQueue.length = 0
        }
      }
    }
  }

  update(fn) {
    this.set(fn(this.value))
  }

  subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate]
    this.subscribers.push(subscriber)
    if (this.subscribers.length === 1) {
      this.stop = this.start(this._set) || noop  // TODO: Should this be this._set
    }
    run(this.value)

    function unsubscribe () {
      const index = this.subscribers.indexOf(subscriber)
      if (index !== -1) {
        this.subscribers.splice(index, 1)
      }
      if (this.subscribers.length === 0) {
        this.stop()
        this.stop = null
      }
    }
    this.unsubscribe = unsubscribe.bind(this)
    return this.unsubscribe
  }

}

function getLocation() {
  const hashPosition = window.location.href.indexOf('#/')
  let location = (hashPosition > -1) ? window.location.href.substr(hashPosition + 1) : '/'
  // Check if there's a querystring
  const qsPosition = location.indexOf('?')
  let querystring = ''
  if (qsPosition > -1) {
    querystring = location.substr(qsPosition + 1)
    location = location.substr(0, qsPosition)
  }
  const urlSearchParams = new URLSearchParams(querystring)
  return {urlSearchParams, location, querystring}
}

ViewstateStore.pendingURLUpdates = {}
ViewstateStore.timer = null

ViewstateStore.queueURLUpdate = (key, value) => {
  if (ViewstateStore.timer) {
    clearTimeout(ViewstateStore.timer)
    ViewstateStore.timer = null
  }
  ViewstateStore.pendingURLUpdates[key] = value
  ViewstateStore.timer = setTimeout(ViewstateStore.processPendingURLUpdates, 0)
}

ViewstateStore.processPendingURLUpdates = function() {
  const {urlSearchParams, location} = getLocation()
  const currentURLSearchString = urlSearchParams.toString()
  for (const [key, value] of Object.entries(ViewstateStore.pendingURLUpdates)) {
    urlSearchParams.set(key, value)
  }
  const newURLSearchString = urlSearchParams.toString()
  if (newURLSearchString !== currentURLSearchString) {
    push(location + '?' + newURLSearchString)
  }
  ViewstateStore.pendingURLUpdates = {}
  ViewstateStore.timer = null
}
