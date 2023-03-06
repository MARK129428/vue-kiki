import { isArray } from "@vue/packages/shared/src"
import { Dep, createDep } from "./dep"

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export function effect<T = any> (fn: () => T) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

export let activeEffect: ReactiveEffect | undefined
export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run () {
    activeEffect = this

    return this.fn()
  }
}


/**
 * 收集依赖
 * @param target 
 * @param key 
 */
export function track(target: object, key: unknown) {
  console.log('track 收集依赖')
  if (!activeEffect) return 
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }

  trackEffects(dep)
}

/**
 * 利用Dep 一次跟踪指定key的所有Effect
 */
export function trackEffects (dep: Dep) {
  dep.add(activeEffect!)
}

export function trigger(
  target: object,
  key: unknown,
  newValue: unknown
) {
  const depsMap = targetMap.get(target)

  if (!depsMap) {
    return
  }

  const dep: Dep | undefined = depsMap.get(key)

  if (!dep) {
    return
  }

  triggerEffects(dep)
  
}

// 以此触发保存的依赖
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]

  for (const effect of effects) {
    triggerEffect(effect)
  }
}

// 触发指定依赖
export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}