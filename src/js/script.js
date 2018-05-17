$(function () {
  var game = new Game();
  var pool = new Pool(30);
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

  function Pool(size) {
    this.pool = [];
    this.init = function () {
      for (let i = 0; i < size; i++) {
        var bullet = new Bullet();
        this.pool[i] = bullet;
      }
      console.log('CHECK pool', this.pool)
    }
    this.get = function (x, y) {
      if(!this.pool[size - 1].alive) {
        this.pool[size - 1].spawn(x, y);
        this.pool.unshift(this.pool.pop());
      }
    }
    this.getTwo = function(x1, y1, x2, y2) {
      if(!this.pool[size - 1].alive &&
        !this.pool[size - 2].alive) {
        this.get(x1, y1);
        this.get(x2, y2);
      }
    };
    this.animate = function() {
      for(let i=0; i < size; i++) {
        console.log('WE ARE IN ANIMATE', this.pool[i].alive, this.pool[i].draw())
        if(this.pool[i].alive) {
          if(this.pool[i].draw()) {
            this.pool[i].draw();
            this.pool[i].clear();
            this.pool.push((this.pool.splice(i,1))[0])
          }
        }
      }
    }
  }

  function background (x, y, img) {
    this.x = x;
    this.y = y;
    this.draw = function () {
      game.bgCtx.drawImage(imageStore.img, x, y)
    }
  }
  function Bullet (x, y, width, height, img) {
    this.alive = false;
    this.spawn = function(x, y) {
      console.log('WE ARE IN SPAWN')
      this.x = x;
      this.y = y;
      this.alive = true;
    };
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function () {
      game.shipCtx.drawImage(imageStore.bulletImg, x, y);
      game.shipCtx.drawImage(imageStore.bulletImg, x+28, y);
      return true;
    }
    this.clear = function () {
      this.x = 0;
      this.y = 0;
      this.alive = false;
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
    game.shipCtx.clearRect(pool.pool[0].x, pool.pool[0].y, 2, 14)
    game.shipCtx.clearRect(pool.pool[0].x + 28, pool.pool[0].y, 2, 14)
    pool.pool[0].y -= 2;
    game.shipCtx.drawImage(imageStore.bulletImg, pool.pool[0].x, pool.pool[0].y)
    game.shipCtx.drawImage(imageStore.bulletImg, pool.pool[0].x + 28, pool.pool[0].y)
  }

  var timer = setInterval( function () {
    update();
    if(pool.pool.length !== 0) {
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
      //bul1 = new bullet(ship.x + 5, ship.y - 6, imageStore.bulletImg)
      //bul1.draw();
      pool.init();
      pool.getTwo(ship.x + 5, ship.y - 6, ship.x + 33, ship.y - 6);
      pool.animate();
    }
  })

});
