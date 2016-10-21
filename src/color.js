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
