export class Dragster {
  /*
  Copyright 2019 Ben Smithett

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  The above notice applies to the original code written by Ben Smithett but note that
  the code below has been modified from Ben's code.
  */

  constructor(el) {
    this.dragenter = this.dragenter.bind(this)
    this.dragleave = this.dragleave.bind(this)
    this.el = el
    this.first = false
    this.second = false
    this.el.addEventListener("dragenter", this.dragenter, false)
    this.el.addEventListener("dragleave", this.dragleave, false)
    this.destroy = this._destroy.bind(this)
    if (!Dragster.dragsters) {
      Dragster.dragsters = {}
    }
    Dragster.dragsters[this.el.id] = this
  }

  dragenter(event) {
    event.preventDefault()
    if (this.first) {
      this.second = true
    } else {
      this.first = true
      this.customEvent = document.createEvent("CustomEvent")
      this.customEvent.initCustomEvent("dragster-enter", true, true, {
        dataTransfer: event.dataTransfer,
        sourceEvent: event
      })
      this.el.dispatchEvent(this.customEvent)
    }
  }

  dragleave(event) {
    if (this.second) {
      this.second = false
    } else if (this.first) {
      this.first = false
    }
    if (!this.first && !this.second) {
      this.customEvent = document.createEvent("CustomEvent")
      this.customEvent.initCustomEvent("dragster-leave", true, true, {
        dataTransfer: event.dataTransfer,
        sourceEvent: event
      })
      this.el.dispatchEvent(this.customEvent)
    }
  }

  removeListeners() {
    this.el.removeEventListener("dragenter", this.dragenter, false)
    return this.el.removeEventListener("dragleave", this.dragleave, false)
  }

  // Must call after drop or a second drop to the same target sometimes gets missed
  reset() {
    this.first = false
    return this.second = false
  }

  _destroy() {
    if (Dragster.dragsters[this.el.id]) {
      Dragster.dragsters[this.el.id].removeListeners()
      delete Dragster.dragsters[this.el.id]
    }
  }
}