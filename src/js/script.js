$(function () {
  var game = new Game();
  var imageStore = new function () {
    this.img = new Image();
    this.shipImg = new Image();
    this.bulletImg = new Image();

    this.img.src = 'img/bg.png';
    this.bulletImg.src = 'img/bullet.png'
    this.shipImg.src = 'img/ship.png';
  }

  function Game() {
    this.bg = document.getElementById("background");
    this.shipCanvas = document.getElementById("ship");

    this.bg.width = 600;
    this.bg.height = 360;
    this.shipCanvas.width = 600;
    this.shipCanvas.height = 360;

    this.bgCtx = this.bg.getContext('2d')
    this.shipCtx = this.shipCanvas.getContext('2d')
  }

  function background (x, y, img) {
    // this.alive = false;
    // function spawn(x, y,) {
    //   this.x = x;
    //   this.y = y;
    //   this.alive = true;
    // }
    this.x = x;
    this.y = y;
    this.draw = function () {
      game.bgCtx.drawImage(imageStore.img, x, y)
    }
  }
  function bullet (x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function () {
      game.bgCtx.drawImage(imageStore.bulletImg, x, y)
      game.bgCtx.drawImage(imageStore.bulletImg, x+20, y)
    }
  }
  function ship(x, y, width, height, img) {
    console.log('>>>>', x, y)
    this.x = x;
    this.y = y;
    this.drawShip = function () {
      game.shipCtx.drawImage(imageStore.shipImg, x, y)
    }
  }

  var image = new background(0, 0, 600, 360, imageStore.img);
  var ship = new ship(270, 320, 40, 26, imageStore.shipImg)
  var bul1 = null
  var bul2 = null
  image.draw();
  ship.drawShip();


  function update () {
    image.y += 1;
    game.shipCtx.drawImage(imageStore.shipImg, ship.x, ship.y)
    game.bgCtx.drawImage(imageStore.img, 0, image.y)
    game.bgCtx.drawImage(imageStore.img, 0, image.y - game.bg.height)
    if (image.y >= game.bg.height) {
      image.y = 0;
    }
  }

  function updateBullet () {
    game.shipCtx.clearRect(bul1.x, bul1.y, 2, 14)
    game.shipCtx.clearRect(bul2.x, bul2.y, 2, 14)
    bul1.y = bul1.y - 2;
    bul2.y = bul2.y - 2;
    game.shipCtx.drawImage(imageStore.bulletImg, bul1.x, bul1.y)
    game.shipCtx.drawImage(imageStore.bulletImg, bul2.x, bul2.y)
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
      game.shipCtx.clearRect(ship.x, ship.y, 40, 26)
      ship.x = ship.x - 5;
      game.shipCtx.drawImage(imageStore.shipImg, ship.x, ship.y);
    }
    else if(eventObject.which === 39 && ship.x < 560) {
      game.shipCtx.clearRect(ship.x, ship.y, 40, 26)
      ship.x = ship.x + 5;
      game.shipCtx.drawImage(imageStore.shipImg, ship.x, ship.y);
    }
    else if(eventObject.which === 32)
    {
      bul1 = new bullet(ship.x + 5, ship.y - 6, imageStore.bulletImg)
      bul2 = new bullet(ship.x + 33, ship.y - 6, imageStore.bulletImg)
      bul1.draw();
      bul2.draw();
    }null
  })

});
