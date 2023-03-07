import { isArray, isObject, isString } from "@vue/packages/shared/src"

export function normalizeClass(value: unknown): string {
  let res: string = ''

  if (isString(value)) {
    res = value 
  } else if (isArray(value)) {
    for (let index = 0; index < value.length; index++) {
      const normalized = normalizeClass(value[index])
      if (normalized) {
        res += normalized + ' '
      }
    }
  } else if (isObject(value)) {
    for (const key in value) {
      if (value[name]) {
        res += name + ' '
      }
    }
  }

  return res.trim()
}