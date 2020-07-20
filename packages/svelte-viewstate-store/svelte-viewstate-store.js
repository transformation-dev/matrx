const debug = require('debug')('matrx:svelte-viewstate-store')

import {onDestroy} from 'svelte'
import {writable} from 'svelte/store'
import {push, loc} from 'svelte-spa-router'

export class ViewstateStore {
  constructor(storeConfig) {
    this.storeConfig = storeConfig
    this.scope = storeConfig.scope

    this.wrappedStore = writable(storeConfig.defaultValue)
    this.subscribe = this.wrappedStore.subscribe

    // this.wrappedStore.set(storeConfig.defaultValue)  // This is just so value is not undefined. It gets updated by the querystring or LocalStorage 

    this.onURLChange = this.onURLChange.bind(this)
    const unsubscribe = loc.subscribe(this.onURLChange)

    if (!this.storeConfig.isGlobal) {
      onDestroy(unsubscribe)
    }
  }

  getQuerystringParam(querystring) {
    const urlSearchParams = new URLSearchParams(querystring)
    const valueString = urlSearchParams.get(this.storeConfig.identifier)
    if (valueString === null) {
      return {newValue: null, urlSearchParams}
    }
    let newValue = valueString
    if (this.storeConfig.type === 'Float') {  // TODO: Support arrays of values
      newValue = Number.parseFloat(valueString)
    } else if (this.storeConfig.type === 'Int') {
      newValue = +valueString  // Prefer over Number.parseInt(valueString, 10) because it returns NaN for "1 abc"
      // newValue = Number.parseInt(valueString, 10)
    } else if (this.storeConfig.type === 'Boolean') {
      newValue = (valueString == 'true')
    }
    return {newValue, urlSearchParams}
  }

  onURLChange(newLoc) {
    this.scope = this.scope || newLoc.location
    this.location = newLoc.location

    if (!this.location.startsWith(this.scope)) {  // TODO: This needs to work for parent/child routes
      return
    }

    let {newValue} = this.getQuerystringParam(newLoc.querystring)
    if (newValue != null) {
      if (this.storeConfig.updateLocalStorageOnURLChange) {
        window.localStorage[this.scope + '.' + this.storeConfig.identifier] = newValue
      }
    } else {
      newValue = window.localStorage[this.scope + '.' + this.storeConfig.identifier] || this.storeConfig.defaultValue
      ViewstateStore.queueURLUpdate(this.storeConfig.identifier, newValue)
    }
    this.wrappedStore.set(newValue)
  }

  set(newValue) {
    this.wrappedStore.set(newValue)
    window.localStorage[this.scope + '.' + this.storeConfig.identifier] = newValue
    ViewstateStore.queueURLUpdate(this.storeConfig.identifier, newValue)
  }

  update(fn) {
    let newValue
    this.wrappedStore.update((currentValue) => {
      newValue = fn(currentValue)
      return newValue
    })
    window.localStorage[this.scope + '.' + this.storeConfig.identifier] = newValue
    ViewstateStore.queueURLUpdate(this.storeConfig.identifier, newValue)
  }
  // update(fn) {
  //   let newValue
  //   this.wrappedStore.update((currentValue) => {
  //     newValue = fn(currentValue)
  //   })
  //   this.set(newValue)
  // }

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
  debug('in ViewstateStore.queueURLUpdate. key: value %O: %O', key, value)
  if (ViewstateStore.timer !== null) {
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
