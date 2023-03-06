import { ReactiveEffect } from "@vue/packages/reactivity/src/effect"
import { isReactive } from "@vue/packages/reactivity/src/reactive"
import { queuePreFlushCb } from "@vue/packages/runtime-core/src"
import { EMPTY_OBJ, hasChanged, isObject } from "@vue/packages/shared/src"

export  interface WathcOptions<immediate = boolean> {
  immediate?: immediate,
  deep?: boolean
}
export function watch(
  source,
  cb: Function,
  options: WathcOptions
) {
  return doWatch(source, cb, options)
}

export function doWatch(
  source,
  cb: Function,
  { immediate, deep }: WathcOptions = EMPTY_OBJ
) {
  let getter: () => any

  if (isReactive(source)) {
    getter = () => source
    deep = true
  } else {
    getter = () => {}
  }

  // 主动依赖收集
  if (cb && deep) {
    //TODO
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  // 
  let oldValue = {}

  // 本质是为了拿到新的值
  const job = () => {
    if (cb) {
      const newValue = effect.run()
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue)
      }
    }
  }

  let scheduler = () => queuePreFlushCb(job)

  const effect = new ReactiveEffect(getter, scheduler)

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}


export function traverse (value: unknown) {
  if (!isObject(value)) {
    return value
  }

  for (const key in value as object) {
    traverse((value as object)[key])
  }

  return value
}