import {Notefield} from './notefield'
import {Song} from './song'
// import {White} from './color'
// import * as canvas from './canvas'

export class Gameplay {
  song: Song
  field: Notefield

  constructor () {
    this.song = new Song()
    this.field = new Notefield(this.song)
  }

  update (dt: number) {
    this.song.update(dt)
    this.field.update(dt)
  }

  draw () {
    this.field.draw()
  }
}
