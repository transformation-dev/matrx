import {Dragster} from '@matrx/dragster'
import {plan, queueSwimlanes} from '../../stores'

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
      value[practiceBeingDragged].status = 'Doing'
      return value
    })
    Dragster.reset(dropZoneParent)
  }
}

export function dropPan(event, newStatus) {
  const dropZoneParent = findDropZoneParent(event.target)
  let queueSwimlanesCached
  queueSwimlanes.update((value) => {
    queueSwimlanesCached = value
    return value
  })
  dropZoneParent.style.background = ''
  plan.update((value) => {
    if (newStatus === "Doing") {
      value[practiceBeingDragged].queueSwimlaneID = Object.keys(queueSwimlanesCached)[0]
      value[practiceBeingDragged].assessedLevel = "Words"
    } else {
      value[practiceBeingDragged].queueSwimlaneID = null
      value[practiceBeingDragged].assessedLevel = null
    }
    value[practiceBeingDragged].status = newStatus
    return value
  })
  Dragster.reset(dropZoneParent)
}
