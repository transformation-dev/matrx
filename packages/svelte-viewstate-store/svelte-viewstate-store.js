import {onDestroy} from 'svelte'
import {push} from 'svelte-spa-router'

const subscriberQueue = []
function noop() {}
function safeNotEqual(a, b) {
  return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function')
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
  return {location, querystring}
}

export class ViewstateStore {
  constructor(storeConfig, start = noop) {
    this.storeConfig = storeConfig
    this.start = start
    this.stop = noop
    this.subscribers = []

    // add onURLChange as eventListener for URL
    this.onURLChange()  // TODO: Test that this is not already triggered by registering the eventListner above

    onDestroy(() => {
      console.log('got onDestroy()')
      this.removeListeners()
    })
  }

  // static readAndParseQuerystring() {
  //   const querystringObject = new URLSearchParams($querystring).get('origin')
  //   read URL
  //   return parse URL 
  // }

  getQuerystringParam() {
    const location = getLocation()
    const urlSearchParams = new URLSearchParams(location.querystring)
    const valueString = urlSearchParams.get(this.storeConfig.identifier)
    if (valueString === null) {
      return null
    }
    let value = valueString
    if (this.storeConfig.type === 'Float') {
      value = Number.parseFloat(valueString)
    } else if (this.storeConfig.type === 'Int') {
      value = Number.parseInt(valueString)
    }
    // TODO: Need to make this is a Float, Int, or String
    return value
  }

  onURLChange() {
    let newValue = this.getQuerystringParam()
    console.log(this.storeConfig.identifier, 'in querystring is', newValue, typeof newValue)
    if (newValue != null) {
      if (this.storeConfig.updateLocalStorageOnURLChange) {
        window.localStorage[this.storeConfig.identifier] = newValue
      }
    } else {
      newValue = window.localStorage[this.storeConfig.identifier] || this.storeConfig.defaultValue
      // querystringObject[identifier] = newValue
      // push URL with querystringObject
    }
    this._set(newValue)
  }
  
  set(newValue) {
    this._set(newValue)
    window.localStorage[this.storeConfig.identifier] = newValue
    // querystringObject = readAndParseQuerystring()
    // if (querystringObject[identifier] != newValue) {
    //   querystringObject[identifier] = newValue
    //   push URL with querystringObject
    // }
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

  // TODO: Do we need an _update?
  update(fn) {
    this.set(fn(this.value))
  }

  subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate]
    this.subscribers.push(subscriber)
    if (this.subscribers.length === 1) {
      this.stop = this.start(this.set) || noop
    }
    run(this.value)
    return () => {
      const index = this.subscribers.indexOf(subscriber)
      if (index !== -1) {
        this.subscribers.splice(index, 1)
      }
      if (this.subscribers.length === 0) {
        stop()
        this.stop = null
      }
    }
  }

  removeListeners() {
    // this.el.removeEventListener("dragenter", this.dragenter, false)
    // return this.el.removeEventListener("dragleave", this.dragleave, false)
  }

}
