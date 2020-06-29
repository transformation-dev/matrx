import {writable} from 'svelte/store'

import {ViewstateStore} from '@matrx/svelte-viewstate-store'
import {getClient} from '@matrx/svelte-realtime-store'
const realtimeClient = getClient()
export const connected = realtimeClient.connected

import {Dragster} from '@matrx/dragster'

export const openPracticeID = new ViewstateStore({
  identifier: 'openPracticeID', 
  defaultValue: '',
  scope: '/plan',
  isGlobal: true
})

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

export const plan = realtimeClient.realtime({_entityID: 'plan'}, {
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

export function addDragster(node) {
  return new Dragster(node)
}
