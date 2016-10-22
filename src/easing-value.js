import {lerp} from './util'

export function EasingValue (initialValue) {
  return {
    value: initialValue,
    target: initialValue,

    update (delta) {
      this.value = lerp(this.value, this.target, delta)
    },

    set (value) {
      this.value = value
      this.target = value
    },
    ease (target) {
      this.target = target
    }
  }
}
