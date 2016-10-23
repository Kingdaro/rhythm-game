// return the current time in seconds
function now () {
  return Date.now() / 1000
}

export class Timer {
  time = now()

  step (): number {
    const elapsed = now() - this.time
    this.time = now()
    return elapsed
  }
}
