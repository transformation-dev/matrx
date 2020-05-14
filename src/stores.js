import {writable} from 'svelte/store'
import {getClient} from '@matrx/svelte-realtime-store'
const realtimeClient = getClient()
const connected = realtimeClient.connected

export const CSRFTokenAvailable = writable(false)

export const formulation = writable({
  label: 'Default formulation',
  disciplines: [
    {
      id: 'discipline1',
      label: 'Artisanship',
      description: 'blah',
      documentation: 'blah',
      practices: [
        {
          id: 'practice1',
          label: 'Yellow Belt',
          description: 'Something to say about **Yellow Belt** in Markdown',
          documentation: 'Some _Markdown_ documentation'
        },
        {
          id: 'practice2',
          label: 'Orange Belt',
          description: 'blah blah blah',
          documentation: 'blah'
        }
      ]
    },
    {
      id: 'discipline2',
      label: 'Tools',
      description: 'blah',
      documentation: 'blah',
      practices: [
        {
          id: 'practice3',
          label: 'SCA',
          description: 'in Markdown',
          documentation: 'Some _Markdown_ documentation'
        },        
        {
          id: 'practice4',
          label: 'SAST/IAST',
          description: 'Something to say in Markdown',
          documentation: 'Some _Markdown_ documentation'
        },
        {
          id: 'practice5',
          label: 'Network Originated Scans',
          description: 'blah blah blah',
          documentation: 'blah'
        },
        {
          id: 'practice6',
          label: 'Morgans Practice',
          description: 'blah blah blah',
          documentation: 'blah'
        }
      ]
    }
  ]
})

export const queueSwimlanes = writable({
  queue1: {
    id: 'queue1',
    label: 'Planned'
  },
  queue2: {
    id: 'queue2',
    label: 'Stretch'
  }
})

export const plan = realtimeClient.realtime({_entityID: 'A'}, {
  practice1: {
    practiceID: 'practice1',
    formulationID: 'formulation1',
    teamID: 'teamA',
    assessedLevel: 'Words',
    notes: 'Some note',
    goalLevel: 'level2',
    goalDate: '2020-07-12',
    status: 'Doing',
    queueSwimlaneID: 'queue1'
  },
  practice6: {
    practiceID: 'practice6',
    formulationID: 'formulation1',
    teamID: 'teamA',
    assessedLevel: 'Words',
    notes: 'Some note',
    goalLevel: 'level2',
    goalDate: '2020-07-12',
    status: 'Doing',
    queueSwimlaneID: 'queue1'
  },
  practice2: {
    practiceID: 'practice2',
    formulationID: 'formulation1',
    teamID: 'teamA',
    assessedLevel: 'Actions',
    notes: 'Some note 2',
    goalLevel: 'level4',
    goalDate: '2020-09-12',
    status: 'Doing',
    queueSwimlaneID: 'queue1'
  },
  practice4: {
    practiceID: 'practice4',
    formulationID: 'formulation1',
    teamID: 'teamA',
    assessedLevel: 'Culture',
    notes: 'Some note 2',
    goalLevel: 'level4',
    goalDate: '2020-09-12',
    status: 'Doing',
    queueSwimlaneID: 'queue2'
  },
  practice3: {
    practiceID: 'practice3',
    formulationID: 'formulation1',
    teamID: 'teamA',
    assessedLevel: 'Culture',
    notes: 'Some note 2',
    status: 'Done'
  },
  practice5: {
    practiceID: 'practice5',
    formulationID: 'formulation1',
    teamID: 'teamA',
    assessedLevel: 'Thoughts',
    notes: 'Some note again',
    status: 'Todo'
  }
})

function findDropZoneParent(target) {
  return target.classList.contains('drop-zone') ? target : findDropZoneParent(target.parentNode)
}

let practiceBeingDragged = null

export function dragStart(event) {
  practiceBeingDragged = event.target.id
  event.target.style.opacity = .5
}

export function dragEnd(event) {
  event.target.style.opacity = ""
}

export function dragEnter(event) {
  // event.preventDefault()
  event.target.style.background = 'grey'
}

export function dragOver(event) {
  event.preventDefault()
}

export function dragLeave(event) {
  event.target.style.background = '' 
}

export function drop(event) {
  const dropZoneParent = findDropZoneParent(event.target)
  dropZoneParent.style.background = ''
  const queueSwimlaneID = dropZoneParent.getAttribute('queueSwimlaneID')
  const assessedLevel = dropZoneParent.getAttribute('assessedLevel')
  if (queueSwimlaneID && assessedLevel) {
    plan.update((value) => {
      value[practiceBeingDragged].queueSwimlaneID = queueSwimlaneID
      value[practiceBeingDragged].assessedLevel = assessedLevel
      return value
    })
    dragsters[queueSwimlaneID][assessedLevel].reset()
  }
}

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
  */

  constructor(el) {
    this.dragenter = this.dragenter.bind(this);
    this.dragleave = this.dragleave.bind(this);
    this.el = el;
    this.first = false;
    this.second = false;
    this.el.addEventListener("dragenter", this.dragenter, false);
    this.el.addEventListener("dragleave", this.dragleave, false);
  }

  dragenter(event) {
    event.preventDefault()
    if (this.first) {
      return this.second = true;
    } else {
      this.first = true;
      this.customEvent = document.createEvent("CustomEvent");
      this.customEvent.initCustomEvent("dragster-enter", true, true, {
        dataTransfer: event.dataTransfer,
        sourceEvent: event
      });
      return this.el.dispatchEvent(this.customEvent);
    }
  }

  dragleave(event) {
    if (this.second) {
      this.second = false;
    } else if (this.first) {
      this.first = false;
    }
    if (!this.first && !this.second) {
      this.customEvent = document.createEvent("CustomEvent");
      this.customEvent.initCustomEvent("dragster-leave", true, true, {
        dataTransfer: event.dataTransfer,
        sourceEvent: event
      });
      return this.el.dispatchEvent(this.customEvent);
    }
  }

  removeListeners() {
    this.el.removeEventListener("dragenter", this.dragenter, false);
    return this.el.removeEventListener("dragleave", this.dragleave, false);
  }

  // Call after drop
  reset() {
    this.first = false;
    return this.second = false;
  }

};

const dragsters = {}  // {queueSwimlaneID: {assessedLevel: <Dragster>}}

export function addDragster(node) {
  const queueSwimlaneID = node.getAttribute('queueSwimlaneID')
  const assessedLevel = node.getAttribute('assessedLevel')
  dragsters[queueSwimlaneID] = dragsters[queueSwimlaneID] || {}
  dragsters[queueSwimlaneID][assessedLevel] = new Dragster(node)
}