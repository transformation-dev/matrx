export class ViewState {
  constructor(stateSpec, onDestroy = null) {
    this.stateSpec = stateSpec
    if (onDestroy) {
      onDestroy(() => {
        console.log('got onDestroy()')
        this.removeListeners()
      })
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