(function () {
'use strict';

function clear(ctx) {
  var _ctx$canvas = ctx.canvas;
  var width = _ctx$canvas.width;
  var height = _ctx$canvas.height;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
}

function triangle(ctx, x, y, radius) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(radius * Math.sqrt(2), radius);
  ctx.lineTo(-radius * Math.sqrt(2), radius);
  ctx.fill();
  ctx.restore();
}

var colors = ['rgb(231, 76, 60)', 'rgb(52, 152, 219)', 'rgb(46, 204, 113)', 'rgb(230, 126, 34)', 'rgb(155, 89, 182)', 'rgb(241, 196, 15)'];

function Background(ctx) {
  var shapes = [];
  var timer = 0;

  // private
  function addShape() {
    var x = Math.random() * ctx.canvas.width;
    var y = ctx.canvas.height + 100;
    var size = Math.random() * 2 + 2;
    var color = colors[Math.floor(Math.random() * colors.length)];
    shapes.push({ x: x, y: y, size: size, color: color });
  }

  function moveShape(shape, dx, dy) {
    shape.x += dx;
    shape.y += dy;
    return shape;
  }

  function drawShape(_ref) {
    var x = _ref.x;
    var y = _ref.y;
    var color = _ref.color;
    var size = _ref.size;

    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.scale(1, 1.1);
    ctx.translate(-x, -y);
    triangle(ctx, x, y, size * 20);
    ctx.restore();
  }

  function moveShapes(elapsed) {
    var move = function move(shape) {
      return moveShape(shape, 0, -shape.size * 40 * elapsed);
    };
    return shapes.map(move);
  }

  function cullShapes() {
    return shapes.filter(function (shape) {
      return shape.y >= -100;
    });
  }

  // public
  function update(elapsed) {
    if (elapsed > 1) return; // no bullshit updates

    timer += elapsed;

    if (timer >= 0.15) {
      timer = 0;
      addShape();
    }

    shapes = moveShapes(elapsed);
    shapes = cullShapes();
  }

  function draw() {
    shapes.forEach(drawShape);

    ctx.font = '14pt Roboto';
    ctx.fillStyle = 'black';
    ctx.fillText('Shapes: ' + shapes.length, 10, 30);
  }

  return { update: update, draw: draw };
}

var backgroundColor = 'rgba(0, 0, 0, 0.8)';
var borderColor = 'rgba(255, 255, 255, 0.8)';
var dividerColor = 'rgba(255, 255, 255, 0.1)';

var columnWidth = 48;
var columnCount = 6;
var position = 220;
var borderWidth = 4;
var dividerWidth = 1;

function Notefield(ctx) {
  var height = ctx.canvas.height;


  function update(elapsed) {}

  function drawShade() {
    ctx.fillRect(0, 0, columnWidth * columnCount, height);
  }

  function drawEdge() {
    ctx.fillRect(0, 0, borderWidth, height);
  }

  function drawColumnDivider() {
    ctx.fillRect(0, 0, dividerWidth, height);
  }

  function draw() {
    var width = columnWidth * columnCount;

    ctx.save();

    ctx.fillStyle = backgroundColor;
    ctx.translate(position, 0);
    drawShade();

    ctx.fillStyle = borderColor;

    ctx.save();
    ctx.translate(-borderWidth / 2, 0);
    drawEdge();
    ctx.translate(width, 0);
    drawEdge();
    ctx.restore();

    ctx.fillStyle = dividerColor;
    for (var i = 1; i < columnCount; i++) {
      ctx.translate(columnWidth, 0);
      drawColumnDivider();
    }

    ctx.restore();
  }

  return { update: update, draw: draw };
}

function Scene(objects) {
  function update(elapsed) {
    objects.forEach(function (obj) {
      return obj.update(elapsed);
    });
  }

  function draw(ctx) {
    objects.forEach(function (obj) {
      return obj.draw(ctx);
    });
  }

  return { update: update, draw: draw };
}

function Game(ctx) {
  var scene = Scene([Background(ctx), Notefield(ctx)]);

  var time = 0;

  function update(elapsed) {
    time += elapsed;
    scene.update(elapsed);
  }

  function draw() {
    clear(ctx);
    scene.draw();
  }

  return { update: update, draw: draw };
}

function Timer() {
  var time = Date.now();
  var lastDeltas = [];

  function step() {
    var elapsed = (Date.now() - time) / 1000;
    time = Date.now();
    lastDeltas = lastDeltas.concat([time]).slice(-50);
    return elapsed;
  }

  function fps() {
    var avg = lastDeltas.reduce(function (a, b) {
      return a + b;
    }) / lastDeltas.length;
    return 60 / (avg / 1000);
  }

  return { step: step, fps: fps };
}

var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');
var game = Game(ctx);
var timer = Timer();

window.requestAnimationFrame(function draw() {
  var elapsed = timer.step();
  game.update(elapsed);
  game.draw();
  window.requestAnimationFrame(draw);
});

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbInNyYy9kcmF3dXRpbHMuanMiLCJzcmMvYmFja2dyb3VuZC5qcyIsInNyYy9ub3RlZmllbGQuanMiLCJzcmMvc2NlbmUuanMiLCJzcmMvZ2FtZS5qcyIsInNyYy90aW1lci5qcyIsInNyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjbGVhciAoY3R4KSB7XG4gIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IGN0eC5jYW52YXNcbiAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmlhbmdsZSAoY3R4LCB4LCB5LCByYWRpdXMpIHtcbiAgY3R4LnNhdmUoKVxuICBjdHgudHJhbnNsYXRlKHgsIHkpXG4gIGN0eC5iZWdpblBhdGgoKVxuICBjdHgubW92ZVRvKDAsIC1yYWRpdXMpXG4gIGN0eC5saW5lVG8ocmFkaXVzICogTWF0aC5zcXJ0KDIpLCByYWRpdXMpXG4gIGN0eC5saW5lVG8oLXJhZGl1cyAqIE1hdGguc3FydCgyKSwgcmFkaXVzKVxuICBjdHguZmlsbCgpXG4gIGN0eC5yZXN0b3JlKClcbn1cbiIsImltcG9ydCB7dHJpYW5nbGV9IGZyb20gJy4vZHJhd3V0aWxzJ1xuXG5jb25zdCBjb2xvcnMgPSBbXG4gICdyZ2IoMjMxLCA3NiwgNjApJyxcbiAgJ3JnYig1MiwgMTUyLCAyMTkpJyxcbiAgJ3JnYig0NiwgMjA0LCAxMTMpJyxcbiAgJ3JnYigyMzAsIDEyNiwgMzQpJyxcbiAgJ3JnYigxNTUsIDg5LCAxODIpJyxcbiAgJ3JnYigyNDEsIDE5NiwgMTUpJyxcbl1cblxuZXhwb3J0IGZ1bmN0aW9uIEJhY2tncm91bmQgKGN0eCkge1xuICBsZXQgc2hhcGVzID0gW11cbiAgbGV0IHRpbWVyID0gMFxuXG4gIC8vIHByaXZhdGVcbiAgZnVuY3Rpb24gYWRkU2hhcGUgKCkge1xuICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpICogY3R4LmNhbnZhcy53aWR0aFxuICAgIGNvbnN0IHkgPSBjdHguY2FudmFzLmhlaWdodCArIDEwMFxuICAgIGNvbnN0IHNpemUgPSBNYXRoLnJhbmRvbSgpICogMiArIDJcbiAgICBjb25zdCBjb2xvciA9IGNvbG9yc1sgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29sb3JzLmxlbmd0aCkgXVxuICAgIHNoYXBlcy5wdXNoKHsgeCwgeSwgc2l6ZSwgY29sb3IgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdmVTaGFwZSAoc2hhcGUsIGR4LCBkeSkge1xuICAgIHNoYXBlLnggKz0gZHhcbiAgICBzaGFwZS55ICs9IGR5XG4gICAgcmV0dXJuIHNoYXBlXG4gIH1cblxuICBmdW5jdGlvbiBkcmF3U2hhcGUgKHsgeCwgeSwgY29sb3IsIHNpemUgfSkge1xuICAgIGN0eC5zYXZlKClcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBjdHgudHJhbnNsYXRlKHgsIHkpXG4gICAgY3R4LnNjYWxlKDEsIDEuMSlcbiAgICBjdHgudHJhbnNsYXRlKC14LCAteSlcbiAgICB0cmlhbmdsZShjdHgsIHgsIHksIHNpemUgKiAyMClcbiAgICBjdHgucmVzdG9yZSgpXG4gIH1cblxuICBmdW5jdGlvbiBtb3ZlU2hhcGVzIChlbGFwc2VkKSB7XG4gICAgY29uc3QgbW92ZSA9IHNoYXBlID0+IG1vdmVTaGFwZShzaGFwZSwgMCwgLXNoYXBlLnNpemUgKiA0MCAqIGVsYXBzZWQpXG4gICAgcmV0dXJuIHNoYXBlcy5tYXAobW92ZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGN1bGxTaGFwZXMgKCkge1xuICAgIHJldHVybiBzaGFwZXMuZmlsdGVyKHNoYXBlID0+IHNoYXBlLnkgPj0gLTEwMClcbiAgfVxuXG4gIC8vIHB1YmxpY1xuICBmdW5jdGlvbiB1cGRhdGUgKGVsYXBzZWQpIHtcbiAgICBpZiAoZWxhcHNlZCA+IDEpIHJldHVybiAvLyBubyBidWxsc2hpdCB1cGRhdGVzXG5cbiAgICB0aW1lciArPSBlbGFwc2VkXG5cbiAgICBpZiAodGltZXIgPj0gMC4xNSkge1xuICAgICAgdGltZXIgPSAwXG4gICAgICBhZGRTaGFwZSgpXG4gICAgfVxuXG4gICAgc2hhcGVzID0gbW92ZVNoYXBlcyhlbGFwc2VkKVxuICAgIHNoYXBlcyA9IGN1bGxTaGFwZXMoKVxuICB9XG5cbiAgZnVuY3Rpb24gZHJhdyAoKSB7XG4gICAgc2hhcGVzLmZvckVhY2goZHJhd1NoYXBlKVxuXG4gICAgY3R4LmZvbnQgPSAnMTRwdCBSb2JvdG8nXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjaydcbiAgICBjdHguZmlsbFRleHQoYFNoYXBlczogJHtzaGFwZXMubGVuZ3RofWAsIDEwLCAzMClcbiAgfVxuXG4gIHJldHVybiB7IHVwZGF0ZSwgZHJhdyB9XG59XG4iLCJjb25zdCBiYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjgpJ1xuY29uc3QgYm9yZGVyQ29sb3IgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgpJ1xuY29uc3QgZGl2aWRlckNvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSdcblxuY29uc3QgY29sdW1uV2lkdGggPSA0OFxuY29uc3QgY29sdW1uQ291bnQgPSA2XG5jb25zdCBwb3NpdGlvbiA9IDIyMFxuY29uc3QgYm9yZGVyV2lkdGggPSA0XG5jb25zdCBkaXZpZGVyV2lkdGggPSAxXG5cbmV4cG9ydCBmdW5jdGlvbiBOb3RlZmllbGQgKGN0eCkge1xuICBjb25zdCB7aGVpZ2h0fSA9IGN0eC5jYW52YXNcblxuICBmdW5jdGlvbiB1cGRhdGUgKGVsYXBzZWQpIHt9XG5cbiAgZnVuY3Rpb24gZHJhd1NoYWRlICgpIHtcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgY29sdW1uV2lkdGggKiBjb2x1bW5Db3VudCwgaGVpZ2h0KVxuICB9XG5cbiAgZnVuY3Rpb24gZHJhd0VkZ2UgKCkge1xuICAgIGN0eC5maWxsUmVjdCgwLCAwLCBib3JkZXJXaWR0aCwgaGVpZ2h0KVxuICB9XG5cbiAgZnVuY3Rpb24gZHJhd0NvbHVtbkRpdmlkZXIgKCkge1xuICAgIGN0eC5maWxsUmVjdCgwLCAwLCBkaXZpZGVyV2lkdGgsIGhlaWdodClcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYXcgKCkge1xuICAgIGNvbnN0IHdpZHRoID0gY29sdW1uV2lkdGggKiBjb2x1bW5Db3VudFxuXG4gICAgY3R4LnNhdmUoKVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxuICAgIGN0eC50cmFuc2xhdGUocG9zaXRpb24sIDApXG4gICAgZHJhd1NoYWRlKClcblxuICAgIGN0eC5maWxsU3R5bGUgPSBib3JkZXJDb2xvclxuXG4gICAgY3R4LnNhdmUoKVxuICAgIGN0eC50cmFuc2xhdGUoLWJvcmRlcldpZHRoIC8gMiwgMClcbiAgICBkcmF3RWRnZSgpXG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMClcbiAgICBkcmF3RWRnZSgpXG4gICAgY3R4LnJlc3RvcmUoKVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IGRpdmlkZXJDb2xvclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29sdW1uQ291bnQ7IGkrKykge1xuICAgICAgY3R4LnRyYW5zbGF0ZShjb2x1bW5XaWR0aCwgMClcbiAgICAgIGRyYXdDb2x1bW5EaXZpZGVyKClcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpXG4gIH1cblxuICByZXR1cm4geyB1cGRhdGUsIGRyYXcgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIFNjZW5lIChvYmplY3RzKSB7XG4gIGZ1bmN0aW9uIHVwZGF0ZSAoZWxhcHNlZCkge1xuICAgIG9iamVjdHMuZm9yRWFjaChvYmogPT4gb2JqLnVwZGF0ZShlbGFwc2VkKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYXcgKGN0eCkge1xuICAgIG9iamVjdHMuZm9yRWFjaChvYmogPT4gb2JqLmRyYXcoY3R4KSlcbiAgfVxuXG4gIHJldHVybiB7IHVwZGF0ZSwgZHJhdyB9XG59XG4iLCJpbXBvcnQge0JhY2tncm91bmR9IGZyb20gJy4vYmFja2dyb3VuZCdcbmltcG9ydCB7Tm90ZWZpZWxkfSBmcm9tICcuL25vdGVmaWVsZCdcbmltcG9ydCB7U2NlbmV9IGZyb20gJy4vc2NlbmUnXG5pbXBvcnQge2NsZWFyfSBmcm9tICcuL2RyYXd1dGlscydcblxuZXhwb3J0IGZ1bmN0aW9uIEdhbWUgKGN0eCkge1xuICBjb25zdCBzY2VuZSA9IFNjZW5lKFtcbiAgICBCYWNrZ3JvdW5kKGN0eCksXG4gICAgTm90ZWZpZWxkKGN0eCksXG4gIF0pXG5cbiAgbGV0IHRpbWUgPSAwXG5cbiAgZnVuY3Rpb24gdXBkYXRlIChlbGFwc2VkKSB7XG4gICAgdGltZSArPSBlbGFwc2VkXG4gICAgc2NlbmUudXBkYXRlKGVsYXBzZWQpXG4gIH1cblxuICBmdW5jdGlvbiBkcmF3ICgpIHtcbiAgICBjbGVhcihjdHgpXG4gICAgc2NlbmUuZHJhdygpXG4gIH1cblxuICByZXR1cm4geyB1cGRhdGUsIGRyYXcgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIFRpbWVyICgpIHtcbiAgbGV0IHRpbWUgPSBEYXRlLm5vdygpXG4gIGxldCBsYXN0RGVsdGFzID0gW11cblxuICBmdW5jdGlvbiBzdGVwICgpIHtcbiAgICBjb25zdCBlbGFwc2VkID0gKERhdGUubm93KCkgLSB0aW1lKSAvIDEwMDBcbiAgICB0aW1lID0gRGF0ZS5ub3coKVxuICAgIGxhc3REZWx0YXMgPSBsYXN0RGVsdGFzLmNvbmNhdChbIHRpbWUgXSkuc2xpY2UoLTUwKVxuICAgIHJldHVybiBlbGFwc2VkXG4gIH1cblxuICBmdW5jdGlvbiBmcHMgKCkge1xuICAgIGNvbnN0IGF2ZyA9IGxhc3REZWx0YXMucmVkdWNlKChhLCBiKSA9PiBhICsgYikgLyBsYXN0RGVsdGFzLmxlbmd0aFxuICAgIHJldHVybiA2MCAvIChhdmcgLyAxMDAwKVxuICB9XG5cbiAgcmV0dXJuIHsgc3RlcCwgZnBzIH1cbn1cbiIsImltcG9ydCB7R2FtZX0gZnJvbSAnLi9nYW1lJ1xuaW1wb3J0IHtUaW1lcn0gZnJvbSAnLi90aW1lcidcblxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWUnKVxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbmNvbnN0IGdhbWUgPSBHYW1lKGN0eClcbmNvbnN0IHRpbWVyID0gVGltZXIoKVxuXG53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIGRyYXcgKCkge1xuICBjb25zdCBlbGFwc2VkID0gdGltZXIuc3RlcCgpXG4gIGdhbWUudXBkYXRlKGVsYXBzZWQpXG4gIGdhbWUuZHJhdygpXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdylcbn0pXG4iXSwibmFtZXMiOlsiY2xlYXIiLCJjdHgiLCJjYW52YXMiLCJ3aWR0aCIsImhlaWdodCIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwidHJpYW5nbGUiLCJ4IiwieSIsInJhZGl1cyIsInNhdmUiLCJ0cmFuc2xhdGUiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJNYXRoIiwic3FydCIsImZpbGwiLCJyZXN0b3JlIiwiY29sb3JzIiwiQmFja2dyb3VuZCIsInNoYXBlcyIsInRpbWVyIiwiYWRkU2hhcGUiLCJyYW5kb20iLCJzaXplIiwiY29sb3IiLCJmbG9vciIsImxlbmd0aCIsInB1c2giLCJtb3ZlU2hhcGUiLCJzaGFwZSIsImR4IiwiZHkiLCJkcmF3U2hhcGUiLCJzY2FsZSIsIm1vdmVTaGFwZXMiLCJlbGFwc2VkIiwibW92ZSIsIm1hcCIsImN1bGxTaGFwZXMiLCJmaWx0ZXIiLCJ1cGRhdGUiLCJkcmF3IiwiZm9yRWFjaCIsImZvbnQiLCJmaWxsVGV4dCIsImJhY2tncm91bmRDb2xvciIsImJvcmRlckNvbG9yIiwiZGl2aWRlckNvbG9yIiwiY29sdW1uV2lkdGgiLCJjb2x1bW5Db3VudCIsInBvc2l0aW9uIiwiYm9yZGVyV2lkdGgiLCJkaXZpZGVyV2lkdGgiLCJOb3RlZmllbGQiLCJkcmF3U2hhZGUiLCJkcmF3RWRnZSIsImRyYXdDb2x1bW5EaXZpZGVyIiwiaSIsIlNjZW5lIiwib2JqZWN0cyIsIm9iaiIsIkdhbWUiLCJzY2VuZSIsInRpbWUiLCJUaW1lciIsIkRhdGUiLCJub3ciLCJsYXN0RGVsdGFzIiwic3RlcCIsImNvbmNhdCIsInNsaWNlIiwiZnBzIiwiYXZnIiwicmVkdWNlIiwiYSIsImIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRDb250ZXh0IiwiZ2FtZSIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSJdLCJtYXBwaW5ncyI6Ijs7O0FBQU8sU0FBU0EsS0FBVCxDQUFnQkMsR0FBaEIsRUFBcUI7b0JBQ0ZBLElBQUlDLE1BREY7TUFDbkJDLEtBRG1CLGVBQ25CQSxLQURtQjtNQUNaQyxNQURZLGVBQ1pBLE1BRFk7O01BRXRCQyxTQUFKLEdBQWdCLE9BQWhCO01BQ0lDLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CSCxLQUFuQixFQUEwQkMsTUFBMUI7OztBQUdGLEFBQU8sU0FBU0csUUFBVCxDQUFtQk4sR0FBbkIsRUFBd0JPLENBQXhCLEVBQTJCQyxDQUEzQixFQUE4QkMsTUFBOUIsRUFBc0M7TUFDdkNDLElBQUo7TUFDSUMsU0FBSixDQUFjSixDQUFkLEVBQWlCQyxDQUFqQjtNQUNJSSxTQUFKO01BQ0lDLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBQ0osTUFBZjtNQUNJSyxNQUFKLENBQVdMLFNBQVNNLEtBQUtDLElBQUwsQ0FBVSxDQUFWLENBQXBCLEVBQWtDUCxNQUFsQztNQUNJSyxNQUFKLENBQVcsQ0FBQ0wsTUFBRCxHQUFVTSxLQUFLQyxJQUFMLENBQVUsQ0FBVixDQUFyQixFQUFtQ1AsTUFBbkM7TUFDSVEsSUFBSjtNQUNJQyxPQUFKOzs7QUNaRixJQUFNQyxTQUFTLENBQ2Isa0JBRGEsRUFFYixtQkFGYSxFQUdiLG1CQUhhLEVBSWIsbUJBSmEsRUFLYixtQkFMYSxFQU1iLG1CQU5hLENBQWY7O0FBU0EsQUFBTyxTQUFTQyxVQUFULENBQXFCcEIsR0FBckIsRUFBMEI7TUFDM0JxQixT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
