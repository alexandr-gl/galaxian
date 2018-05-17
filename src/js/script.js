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
    this.main = document.getElementById("main");

    this.bg.width = 600;
    this.bg.height = 360;
    this.shipCanvas.width = 600;
    this.shipCanvas.height = 360;
    this.main.width = 600;
    this.main.height = 360;

    this.bgCtx = this.bg.getContext('2d')
    this.shipCtx = this.shipCanvas.getContext('2d')
    this.mainCtx = this.main.getContext('2d')
  }

  function Pool(size) {
    this.pool = [];
    this.init = function () {
      for (let i = 0; i < size; i++) {
        var bullet = new Bullet();
        this.pool[i] = bullet;
      }
    }
    this.get = function (x, y) {
      if(!this.pool[size - 1].alive) {
        console.log('CHECK pool', this.pool)
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
        if(this.pool[i].alive) {
          if(this.pool[i].draw()) {
            this.pool[i].clear();
            this.pool.push((this.pool.splice(i,1))[0])
          }
        }
        else break;
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
      this.x = x;
      this.y = y;
      this.alive = true;
    };
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 360;
    this.draw = function () {
      game.mainCtx.clearRect(this.x, this.y, 2, 14)
      this.y -= 2
      if (this.y <= 0) {
        return true;
      }
      else {
        //console.log('DRAW COOEDINATES', this.x, this.y)
        game.mainCtx.drawImage(imageStore.bulletImg, this.x, this.y);
      }
    }
    this.clear = function () {
      this.x = 0;
      this.y = 0;
      this.alive = false;
    }
  }
  function ship(x, y, width, height, img) {
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
  pool.init();


  function update () {
    image.y += 1;
    game.shipCtx.drawImage(imageStore.shipImg, ship.x, ship.y)
    game.bgCtx.drawImage(imageStore.img, 0, image.y)
    game.bgCtx.drawImage(imageStore.img, 0, image.y - game.bg.height)
    if (image.y >= game.bg.height) {
      image.y = 0;
    }
  }

  var timer = setInterval( function () {
    update();
    for(let i = 0; i < 30; i++)
    {
      if(pool.pool.length !== 0 && pool.pool[i].alive !== false && pool.pool[i].y > 0) {
          pool.pool[i].draw();
      }
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
      pool.getTwo(ship.x + 5, ship.y - 6, ship.x + 33, ship.y - 6);
      pool.animate();
    }
  })

});
