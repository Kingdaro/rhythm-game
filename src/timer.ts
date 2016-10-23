// return the date in seconds
function now () {
  return Date.now() / 1000
}

class Timer {
  time = now()

  step (): number {
    const elapsed = now() - this.time
    this.time = now()
    return elapsed
  }
}

export default Timer
