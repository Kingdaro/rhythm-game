export function Scene (objects) {
  function update (elapsed) {
    objects.forEach(obj => obj.update(elapsed))
  }

  function draw (ctx) {
    objects.forEach(obj => obj.draw(ctx))
  }

  return { update, draw }
}
