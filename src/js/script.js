$(function () {
  var img = new Image();
  img.src = 'img/bg.png';
  var example = document.getElementById("background"),
    ctx = example.getContext('2d');
  example.width  = 600;
  example.height = 360;
  function background (x, y, width, height, img) {
    console.log(img)
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function () {
      ctx.drawImage(img, x, y)
    }
  }
  function ship(x, y) {
    this.x = x;
    this.y = y;
    this.drawShip = function () {
      ctx.drawImage()
    }
  }
  var image = new background(0, 0, 600, 360, img);
  // console.log('image', image);
  image.draw();
  function update () {
    image.y += 1;
    ctx.drawImage(img, 0, image.y)
    ctx.drawImage(img, 0, image.y - example.height)
    if (image.y >= example.height) {
      image.y = 0;
    }
    console.log(image.y)
  }
  var timer = setInterval( function () {
    update();
  }, 1000/24)
});
