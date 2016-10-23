export default class Clock {
  private time: number = 0

  constructor (private limit: number) {}

  update (elapsed: number): boolean {
    this.time += elapsed
    if (this.time >= this.limit) {
      this.time -= this.limit
      return true
    }
    return false
  }
}
