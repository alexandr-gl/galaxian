$(function () {
  var img = new Image();
  img.src = 'img/bg.png';
  var shipImg = new Image();
  shipImg.src = 'img/ship.png';
  var bulletImg = new Image ();
  bulletImg.src = 'img/bullet.png'
  var example = document.getElementById("background"),
    ctx = example.getContext('2d');
  var shipCanvas = document.getElementById("ship"),
    ctx1 = shipCanvas.getContext('2d');
  var bulletCanvas = document.getElementById("bullet"),
    ctx2 = bulletCanvas.getContext('2d');
  var bulletsArr = [];
  example.width  = 600;
  example.height = 360;
  shipCanvas.width = 600;
  shipCanvas.height = 360;
  bulletCanvas.width = 600;
  bulletCanvas.height = 360;

  function bullet (x, y, img) {
    // this.alive = false;
    // function spawn(x, y,) {
    //   this.x = x;
    //   this.y = y;
    //   this.alive = true;
    // }
    this.x = x;
    this.y = y;
    this.draw = function () {
      ctx2.drawImage(img, x, y)
    }
  }
  function background (x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function () {
      ctx.drawImage(img, x, y)
      ctx.drawImage(img, x+20, y)
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
  var bul1 = null
  var bul2 = null
  image.draw();
  ship.drawShip();


  function update () {
    image.y += 1;
    ctx1.drawImage(shipImg, ship.x, ship.y)
    ctx.drawImage(img, 0, image.y)
    ctx.drawImage(img, 0, image.y - example.height)
    if (image.y >= example.height) {
      image.y = 0;
    }
  }

  function updateBullet () {
    ctx2.clearRect(bul1.x, bul1.y, 2, 14)
    ctx2.clearRect(bul2.x, bul2.y, 2, 14)
    bul1.y = bul1.y - 2;
    bul2.y = bul2.y - 2;
    ctx2.drawImage(bulletImg, bul1.x, bul1.y)
    ctx2.drawImage(bulletImg, bul2.x, bul2.y)
  }

  var timer = setInterval( function () {
    update();
    if(bul1 !== null) {
      updateBullet()
    }
  }, 1000/60)

  $(document).keydown(function (eventObject) {
    if(eventObject.which === 37 && ship.x > 0) {
      console.log('X', ship.x);
      ctx1.clearRect(ship.x, ship.y, 40, 26)
      ship.x = ship.x - 5;
      ctx1.drawImage(shipImg, ship.x, ship.y);
    }
    else if(eventObject.which === 39 && ship.x < 560) {
      ctx1.clearRect(ship.x, ship.y, 40, 26)
      ship.x = ship.x + 5;
      ctx1.drawImage(shipImg, ship.x, ship.y);
    }
    else if(eventObject.which === 32)
    {
      bul1 = new bullet(ship.x + 5, ship.y - 6, bulletImg)
      bul2 = new bullet(ship.x + 33, ship.y - 6, bulletImg)
      bulletsArr.push(bul1, bul2);
      console.log('bulletsArr', bulletsArr);
      bul1.draw();
      bul2.draw();
    }null
  })

});
