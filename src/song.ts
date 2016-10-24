export class Song {
  time = -3
  update (elapsed: number) {
    this.time += elapsed
  }
}
