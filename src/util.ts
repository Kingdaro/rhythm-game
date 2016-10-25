const {random, floor, PI} = Math

// clamp a number between a minimum and maximum
export function clamp (n: number, min: number, max: number): number {
  return n > max ? max : n < min ? min : n
}

// interpolate between a and b given a delta 0 to 1
export function lerp (a: number, b: number, delta: number): number {
  return a + (b - a) * clamp(delta, 0, 1)
}

// get the delta of a number between a and b
export function delta (value: number, a: number, b: number): number {
  return (value - a) / (b - a)
}

// return a random item from a list
export function randomItem<T> (list: T[]): T {
  return list[floor(random() * list.length)]
}

// convert a number from degrees to radians
export function degrees (deg: number): number {
  return deg / 180 * PI
}
