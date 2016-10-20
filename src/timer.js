export function Timer () {
  let time = Date.now()
  let lastDeltas = []

  function step () {
    const elapsed = (Date.now() - time) / 1000
    time = Date.now()
    lastDeltas = lastDeltas.concat([ time ]).slice(-50)
    return elapsed
  }

  function fps () {
    const avg = lastDeltas.reduce((a, b) => a + b) / lastDeltas.length
    return 60 / (avg / 1000)
  }

  return { step, fps }
}
