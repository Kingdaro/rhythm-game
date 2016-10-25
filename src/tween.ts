import * as util from './util'

type EasingFunction = (delta: number) => number

interface TweenPoint {
  time: number
  value: number
  easing: EasingFunction
}

export const Linear = delta => delta

export const QuadIn = delta => delta ** 2
export const CubicIn = delta => delta ** 3
export const QuartIn = delta => delta ** 4
export const QuintIn = delta => delta ** 5

export const QuadOut = delta => delta ** (1 / 2)
export const CubicOut = delta => delta ** (1 / 3)
export const QuartOut = delta => delta ** (1 / 4)
export const QuintOut = delta => delta ** (1 / 5)

export class TweenValue {
  time = 0
  points: TweenPoint[] = []

  at (time: number, value: number, easing: EasingFunction = QuadOut) {
    this.points.push({ time, value, easing })
    this.points.sort((a, b) => a.time - b.time)
  }

  getRange (time: number): [TweenPoint, TweenPoint] {
    const index = this.points.findIndex(point => time >= point.time)
    if (index > -1) {
      const current = this.points[index]
      const next = this.points[index + 1] || current
      return [current, next]
    } else {
      const first = this.points[0]
      return [first, first]
    }
  }

  valueAtTime (time: number): number {
    const [current, next] = this.getRange(time)
    const delta = util.delta(time, current.time, next.time)
    return util.lerp(current.value, next.value, current.easing(delta))
  }

  update (dt: number) {
    this.time += dt
  }

  set (time: number) {
    this.time = time
  }

  reset () {
    this.time = 0
  }

  value (): number {
    return this.valueAtTime(this.time)
  }
}
