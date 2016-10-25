import * as util from './util'

type EasingFunction = (delta: number) => number

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
  value: number

  constructor (
    public start = 0,
    public end = 0,
    public duration = 0,
    public delay = 0,
    public easing: EasingFunction = QuadOut,
  ) {
    this.value = start
  }

  setTime (time: number) {
    this.time = time
    if (time > this.delay) {
      const delta = (this.time - this.delay) / this.duration
      this.value = util.lerp(this.start, this.end, this.easing(delta))
    } else {
      this.value = this.start
    }
  }

  update (dt: number): boolean {
    this.setTime(this.time + dt)
    return this.time > this.delay + this.duration
  }

  reset () {
    this.setTime(0)
  }
}

export class TweenGroup {
  tweens = {}

  add (
    name: string,
    start = 0,
    end = 0,
    duration = 0,
    delay = 0,
    easing: EasingFunction = QuadOut,
  ) {
    this.tweens[name] = new TweenValue(start, end, duration, delay, easing)
  }

  get (name: string): number {
    if (name in this.tweens) {
      return this.tweens[name].value
    } else {
      return 0
    }
  }

  update (dt: number) {
    for (const name in this.tweens) {
      this.tweens[name].update(dt)
    }
  }

  reset () {
    for (const name in this.tweens) {
      this.tweens[name].reset()
    }
  }
}
