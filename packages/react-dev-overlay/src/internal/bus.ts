import { StackFrame } from './overlay/StackFrame'

export const TYPE_UNHANDLED_ERROR = 'unhandled-error'
export const TYPE_UNHANDLED_REJECTION = 'unhandled-rejection'
export type UnhandledError = {
  type: typeof TYPE_UNHANDLED_ERROR
  reason: Error
  frames: StackFrame[]
}
export type UnhandledRejection = {
  type: typeof TYPE_UNHANDLED_REJECTION
  reason: Error
  frames: StackFrame[]
}
export type BusEvent = UnhandledError | UnhandledRejection
export type BusEventHandler = (ev: BusEvent) => void

let handlers: Set<BusEventHandler> = new Set()
let queue: BusEvent[] = []

function drain() {
  // Draining should never happen synchronously in case multiple handlers are
  // registered.
  setTimeout(function() {
    while (
      // Until we are out of events:
      Boolean(queue.length) &&
      // Or, if all handlers removed themselves as a result of handling the
      // event(s)
      Boolean(handlers.size)
    ) {
      const ev = queue.shift()
      handlers.forEach(handler => handler(ev))
    }
  }, 1)
}

export function emit(ev: BusEvent): void {
  queue.push(ev)
  drain()
}

export function on(fn: BusEventHandler): boolean {
  if (handlers.has(fn)) {
    return false
  }

  handlers.add(fn)
  drain()
  return true
}

export function off(fn: BusEventHandler): boolean {
  if (handlers.has(fn)) {
    handlers.delete(fn)
    return true
  }

  return false
}
