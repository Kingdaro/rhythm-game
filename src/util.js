export function clamp (n, min, max) {
  return n > max ? max : n < min ? min : n
}

export function lerp (a, b, delta) {
  return a + (b - a) * clamp(delta, 0, 1)
}

export function range (start, end) {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
