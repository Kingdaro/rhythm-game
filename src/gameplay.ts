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

  update (elapsed: number) {
    this.song.update(elapsed)
    this.field.update(elapsed)
  }

  draw () {
    this.field.draw()
  }
}
