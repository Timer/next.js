import * as React from 'react'
import * as Bus from '../bus'
import { RuntimeErrorObject, RuntimeErrors } from './RuntimeErrors'
import { ShadowPortal } from './ShadowPortal'
import { Theme } from './Theme'

type BusState = {
  runtimeErrors: RuntimeErrorObject[]
}
function reducer(state: BusState, ev: Bus.BusEvent): BusState {
  switch (ev.type) {
    case Bus.TYPE_UNHANDLED_ERROR:
    case Bus.TYPE_UNHANDLED_REJECTION: {
      return {
        ...state,
        runtimeErrors: [
          ...state.runtimeErrors,
          { eventId: ev.eventId, error: ev.reason, frames: ev.frames },
        ],
      }
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = ev
      return state
    }
  }
}

function ReactDevOverlay({ children }) {
  const [state, dispatch] = React.useReducer(reducer, { runtimeErrors: [] })
  React.useEffect(() => {
    Bus.on(dispatch)
    return function() {
      Bus.off(dispatch)
    }
  }, [dispatch])

  if (state.runtimeErrors.length) {
    return (
      <React.Fragment>
        {children}

        <ShadowPortal>
          <Theme />
          <RuntimeErrors errors={state.runtimeErrors} />
        </ShadowPortal>
      </React.Fragment>
    )
  }
  return children
}

export default ReactDevOverlay
