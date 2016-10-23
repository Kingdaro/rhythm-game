export class Color {
  constructor (public r: number, public g: number, public b: number, public a: number = 1) {}

  toString (): string {
    const r = Math.round(this.r * 255)
    const g = Math.round(this.g * 255)
    const b = Math.round(this.b * 255)
    return `rgba(${r}, ${g}, ${b}, ${this.a})`
  }

  multiply (value: number): Color {
    return new Color(this.r * value, this.g * value, this.b * value, this.a)
  }

  opacity (amount: number): Color {
    return new Color(this.r, this.g, this.b, this.a * amount)
  }

  darken (amount: number): Color {
    return this.multiply(1 - amount)
  }

  lighten (amount: number): Color {
    return this.multiply(1 + amount)
  }
}

export function rgb (r, g, b): Color {
  return new Color(r / 255, g / 255, b / 255)
}

export function rgba (r, g, b, a): Color {
  return new Color(r / 255, g / 255, b / 255, a)
}

export const Black = new Color(0, 0, 0)
export const White = new Color(1, 1, 1)

// http://flatuicolors.com/
export const Blue = rgb(52, 152, 219)
export const Green = rgb(46, 204, 113)
export const Violet = rgb(155, 89, 182)
export const Gold = rgb(241, 196, 15)
export const Orange = rgb(230, 126, 34)
export const Red = rgb(231, 76, 60)
export const Gray = rgb(149, 165, 166)
export const Cloudy = rgb(236, 240, 241)
