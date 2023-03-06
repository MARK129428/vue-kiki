let isFlushPending = false

const resolvedPromise = Promise.resolve() as Promise<any>

let currentFlushPromise: Promise<void> | null = null

const pendingPreFlushCbs: Function[] = []

export function queuePreFlushCb (cb: Function) {
  queueCb(cb, pendingPreFlushCbs)
}

export function queueCb (cb: Function, pendingQueue: Function[]) {
  pendingQueue.push(cb)
  queueFlush()
}

function queueFlush () {
  if (!isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

function flushJobs () {
  isFlushPending = false
  flushPreFlushCbs()
}

export function flushPreFlushCbs () {
  if (pendingPreFlushCbs.length) {
    let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    pendingPreFlushCbs.length = 0

    for (let index = 0; index < activePreFlushCbs.length; index++) {
      activePreFlushCbs[index]()
    }
  }
}