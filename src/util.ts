const {random, floor, PI} = Math

export function clamp (n: number, min: number, max: number): number {
  return n > max ? max : n < min ? min : n
}

export function lerp (a: number, b: number, delta: number): number {
  return a + (b - a) * clamp(delta, 0, 1)
}

export function randomItem<T> (list: T[]): T {
  return list[floor(random() * list.length)]
}

export function tail<T> (list: T[]): T {
  return list[list.length - 1]
}

export function degrees (deg: number): number {
  return deg / 180 * PI
}
