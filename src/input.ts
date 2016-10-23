interface KeyMap { [key: string]: boolean, }
interface BindingMap { [name: string]: () => boolean, }

const pressedKeys: KeyMap = {}

const bindings: BindingMap = {
  key0: () => pressedKeys['KeyA'] != null,
  key1: () => pressedKeys['KeyS'] != null,
  key2: () => pressedKeys['KeyD'] != null,
  key3: () => pressedKeys['KeyK'] != null,
  key4: () => pressedKeys['KeyL'] != null,
  key5: () => pressedKeys['Semicolon'] != null,
}

export function isDown (name: string): boolean {
  return bindings[name] != null && bindings[name]()
}

window.addEventListener('keydown', event => pressedKeys[event.code] = true)
window.addEventListener('keyup', event => delete pressedKeys[event.code])
