const pressedKeys = {}

export function isDown (key: string): boolean {
  return pressedKeys[key] != null
}

window.addEventListener('keydown', event => pressedKeys[event.code] = true)
window.addEventListener('keyup', event => delete pressedKeys[event.code])
