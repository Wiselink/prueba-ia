import { EventEmitter } from 'events'

export const sseEmitter = new EventEmitter()

export function emitTurnoUpdate(data: any) {
  sseEmitter.emit('update', data)
}
