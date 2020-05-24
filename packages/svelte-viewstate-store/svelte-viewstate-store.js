import {onDestroy} from 'svelte'

const subscriberQueue = []
function noop() {}
function safeNotEqual(a, b) {
  return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function')
}

export class ViewstateStore {
  constructor(storeConfig, start = noop) {
    this.storeConfig = storeConfig
    this.value = storeConfig.defaultValue  // TODO: Get this from URL, then LocalStorage, and finally from storeConfig.defaultValue
    this.start = start
    this.stop = noop
    this.subscribers = []

    onDestroy(() => {
      console.log('got onDestroy()')
      this.removeListeners()
    })
  }

  set(newValue) {
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

  static someStaticMethod(id) {
    return id
  }

  removeListeners() {
    // this.el.removeEventListener("dragenter", this.dragenter, false)
    // return this.el.removeEventListener("dragleave", this.dragleave, false)
  }

}
