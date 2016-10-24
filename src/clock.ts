export class Clock {
  time: number = 0

  constructor (private limit: number) {}

  update (dt: number): boolean {
    this.time += dt
    if (this.time >= this.limit) {
      this.time -= this.limit
      return true
    }
    return false
  }
}
