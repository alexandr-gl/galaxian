$(function () {
  var game = new Game();
  var pool = new Pool(30);
  var enemies = new InitEnemies(134, 0);
  var imageStore = new function () {
    this.img = new Image();
    this.shipImg = new Image();
    this.bulletImg = new Image();
    this.enemyImg = new Image();

    this.img.src = 'img/bg.png';
    this.bulletImg.src = 'img/bullet.png';
    this.shipImg.src = 'img/ship.png';
    this.enemyImg.src = 'img/enemy.png';
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
    this.init = function (type) {
      if(type === 'bullets') {
        for (let i = 0; i < 30; i++) {
          var bullet = new Bullet();
          this.pool[i] = bullet;
        }
      }
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

  function background (x, y) {
    this.x = x;
    this.y = y;
    this.draw = function () {
      game.bgCtx.drawImage(imageStore.img, x, y)
    }
  }
  function Bullet (x, y, width) {
    this.alive = false;
    this.spawn = function(x, y) {
      this.x = x;
      this.y = y;
      this.alive = true;
    };
    this.x = x;
    this.y = y;
    this.draw = function () {
      game.shipCtx.clearRect(this.x, this.y, 2, 14)
      this.y -= 2
      if (this.y <= 0) {
        return true;
      }
      else {
        game.shipCtx.drawImage(imageStore.bulletImg, this.x, this.y);
      }
    }
    this.clear = function () {
      this.x = 0;
      this.y = 0;
      this.alive = false;
    }
  }

  function Enemies (x, y, index) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.alive = true;
    this.draw = function(alive) {
      if(alive === true) {
        game.mainCtx.drawImage(imageStore.enemyImg, this.x, this.y)
      }
      else {
        game.mainCtx.clearRect(this.x, this.y, 38, 28)
      }
    }
  }

  function InitEnemies(x, y) {
    this.poolEn = [];
    this.x = x;
    this.y = y;
    this.init = function () {
      for (let i = 0; i < 18; i++) {
        var enemy = new Enemies(this.x, this.y, i)
        this.x += 58;
        if ((i + 1) % 6 === 0 && i !== 0) {
          this.x = 136;
          this.y += 38;
        }
        this.poolEn.push(enemy);
      }
    }
  }

  function ship(x, y) {
    this.x = x;
    this.y = y;
    this.drawShip = function () {
      game.shipCtx.drawImage(imageStore.shipImg, x, y)
    }
  }

  var image = new background(0, 0, 600, 360, imageStore.img);
  var ship = new ship(270, 320, 40, 26, imageStore.shipImg)
  pool.init('bullets');
  enemies.init();
  var arr;


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
        arr = enemies.poolEn.filter(function (item) {
          return pool.pool[i].x >= item.x && pool.pool[i].x <= item.x + 38 && item.y + 28 === pool.pool[i].y && item.alive !== false;
        })
        pool.pool[i].draw();
        if(arr.length !== 0) {
          arr[arr.length - 1].alive = false;
          game.shipCtx.clearRect(pool.pool[i].x, pool.pool[i].y, 2, 14)
          game.shipCtx.clearRect(pool.pool[i+1].x, pool.pool[i+1].y, 2, 14)
          pool.pool[i].y = 0;
          pool.pool[i+1].y = 0;
          enemies.poolEn.splice(arr[arr.length - 1].index, 1, arr[arr.length - 1]);
        }
      }

      if(i < 18 && enemies.poolEn.length !== 0) {
        enemies.poolEn[i].draw(enemies.poolEn[i].alive);
      }
    }
  }, 1000/60)

  $(document).keydown(function (eventObject) {
    if(eventObject.which === 37 && ship.x > 0) {
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
