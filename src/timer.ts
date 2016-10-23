
class Timer {
  time = Date.now()

  step () {
    const elapsed = Date.now() - this.time
    this.time = Date.now()
    return elapsed
  }
}

export default Timer
