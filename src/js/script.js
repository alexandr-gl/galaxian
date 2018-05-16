$(function () {
  var img = new Image();
  img.src = 'img/bg.png';
  var shipImg = new Image();
  shipImg.src = 'img/ship.png';
  var example = document.getElementById("background"),
    ctx = example.getContext('2d');
  var qqz = document.getElementById("ship"),
    ctx1 = qqz.getContext('2d');
  example.width  = 600;
  example.height = 360;
  qqz.width = 600;
  qqz.height = 360;
  function background (x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function () {
      ctx.drawImage(img, x, y)
    }
  }
  function ship(x, y, width, height, img) {
    console.log('>>>>', x, y)
    this.x = x;
    this.y = y;
    this.drawShip = function () {
      ctx1.drawImage(img, x, y)
    }
  }

  var image = new background(0, 0, 600, 360, img);
  var ship = new ship(270, 320, 40, 26, shipImg)
  image.draw();
  ship.drawShip();

  var prev = performance.now();
  var times = 0;

  function update () {
    image.y += 1;
    ctx1.drawImage(shipImg, ship.x, ship.y)
    ctx.drawImage(img, 0, image.y)
    ctx.drawImage(img, 0, image.y - example.height)
    if (image.y >= example.height) {
      image.y = 0;
    }
  }
  var timer = setInterval( function () {
    update();
  }, 1000/60)

  $(document).keydown(function (eventObject) {
    if(eventObject.which === 37) {
      ctx1.clearRect(ship.x, ship.y, 40, 26)
      ship.x = ship.x - 5;
      ctx1.drawImage(shipImg, ship.x, ship.y);
    }
    else if(eventObject.which === 39) {
      ctx1.clearRect(ship.x, ship.y, 40, 26)
      ship.x = ship.x + 5;
      ctx1.drawImage(shipImg, ship.x, ship.y);
    }
  })
});
