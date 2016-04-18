import {Map, List, fromJS} from 'immutable'
import {expect} from 'chai'
import reducer from '../src/reducer'

describe('reducer', () => {
  it('handles SET_ENTITIES', () => {
    const state = Map()
    const action = {type: 'SET_ENTITIES', entries: ['28 Days Later']}
    const nextState = reducer(state, action)

    expect(nextState).to.equal(Map({
      entries: List.of('28 Days Later')
    }))
  })

  it('handles NEXT', () => {
    const state = Map({
      entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
    })

    const action = {type: "NEXT"}

    const nextState = reducer(state, action)

    expect(nextState).to.equal(Map({
      vote: Map({pair: List.of('Trainspotting', '28 Days Later')}),
      entries: List.of('Sunshine'),
    }))
  })

  it('handles VOTE', () => {
    const state = Map({
      vote: Map({pair: List.of('Trainspotting', '28 Days Later')}),
      entries: List.of('Sunshine'),
    })

    const nextState = reducer(state, {type: 'VOTE', entry: 'Trainspotting'})

    expect(nextState).to.equal(Map({
      vote: Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1,
        })
      }),
      entries: List.of('Sunshine'),
    }))
  })

  it('has an initial state', () => {
    const action = {type: 'SET_ENTITIES', entries: ['28 Days Later']}
    const nextState = reducer(undefined, action)

    expect(nextState).to.equal(Map({
      entries: List.of('28 Days Later')
    }))
  })
})
