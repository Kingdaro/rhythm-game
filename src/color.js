export function Color (r, g, b, a = 1) {
  function toString () {
    const colors = [r, g, b].map(n => n * 255).map(Math.round)
    return `rgba(${colors.join(',')}, ${a})`
  }

  function multiply (value) {
    return Color(r * value, g * value, b * value, a)
  }

  function opacity (amount) {
    return Color(r, g, b, a * amount)
  }

  function darken (amount) {
    return this.multiply(1 - amount)
  }

  function lighten (amount) {
    return this.multiply(1 + amount)
  }

  return { r, g, b, a, toString, multiply, opacity, darken, lighten }
}

export function rgb (r, g, b) {
  return Color(r / 255, g / 255, b / 255)
}

export function rgba (r, g, b, a) {
  return Color(r / 255, g / 255, b / 255, a)
}

export const Black = Color(0, 0, 0)
export const White = Color(1, 1, 1)

// http://flatuicolors.com/
export const Blue = rgb(52, 152, 219)
export const Green = rgb(46, 204, 113)
export const Violet = rgb(155, 89, 182)
export const Gold = rgb(241, 196, 15)
export const Orange = rgb(230, 126, 34)
export const Red = rgb(231, 76, 60)
export const Gray = rgb(149, 165, 166)
export const Cloudy = rgb(236, 240, 241)
