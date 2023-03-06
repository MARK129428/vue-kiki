import { isObject } from "@vue/packages/shared/src"
import { mutableHandlers } from "./baseHandlers"

export const reactiveMap = new WeakMap<object, any>()

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}


function createReactiveObject (
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Object, any>
) {
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, baseHandlers)
  proxy[ReactiveFlags.IS_REACTIVE] = true
  proxyMap.set(target, proxy)
  return proxy
}

export function toReactive<T extends unknown>(value: T): T {
  return isObject(value) ? reactive(value as object) : value
}

export function isReactive (value): boolean {
  return !!(value && value[ReactiveFlags.IS_REACTIVE])
}