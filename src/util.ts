const {random, floor, PI} = Math

export const clamp = (n, min, max) => n > max ? max : n < min ? min : n

export const lerp = (a, b, delta) => a + (b - a) * clamp(delta, 0, 1)

export const randomItem = list => list[floor(random() * list.length)]

export const tail = list => list[list.length - 1]

export const degrees = deg => deg / 180 * PI

export function range (start, end) {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
