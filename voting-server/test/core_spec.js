import { List, Map } from 'immutable'
import { expect } from 'chai'

import { setEntries, next, vote } from '../src/core'

describe('application logic', () => {
  describe('set entries', () => {
    it('adds the entries to the state', () => {
      const state = Map()
      const entries = List.of('Trainspotting', '28 Days Later')
      const nextState = setEntries(state, entries)

      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }))
    })

    it('converts to immutable', () => {
      const state = Map()
      const entries = ['Trainspotting', '28 Days Later']
      const nextState = setEntries(state, entries)

      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }))

    })
  })
  describe('next', () => {
    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({pair: List.of('Trainspotting', '28 Days Later')}),
        entries: List.of('Sunshine'),
      }))
    })

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 1,
            '28 Days Later': 5,
          })
        }),
        entries: List.of('Sunshine', '127 Hours'),
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', '127 Hours'),
        }),
        entries: List.of('28 Days Later'),
      }))
    })

    it('puts both of current vote back to entries if they tie up', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 5,
            '28 Days Later': 5,
          })
        }),
        entries: List.of('Sunshine', '127 Hours'),
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', '127 Hours'),
        }),
        entries: List.of('Trainspotting', '28 Days Later'),
      }))
    })

    it('marks the winner if only one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 5,
          })
        }),
        entries: List(),
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        winner: '28 Days Later',
      }))
    })
  })

  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      })

      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1,
        })
      }))
    })

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2,
        })
      })

      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2,
        })
      }))
    })
  })
})
