
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: '1 event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: '2 event',
    start: todayStr
  }
]

export function createEventId() {
  return String(eventGuid++)
}
