import {Notefield} from './notefield'
// import {White} from './color'
// import * as canvas from './canvas'

export class Gameplay {
  field = new Notefield({}, {})

  update (elapsed: number) {
    this.field.update(elapsed)
  }

  draw () {
    this.field.draw()
  }
}
