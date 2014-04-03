function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "restart");
  }

  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var text=new Array(18);
  text[0] = " ";
  text[1] = "毛芷晴";
  text[2] = "Wing";
  text[3] = "洪丝丝";
  text[4] = "程若晖";
  text[5] = "张美真";
  text[6] = "李青云";
  text[7] = "张雪凝";
  text[8] = "邵芳芳";
  text[9] = "马馥芳";
  text[10] = "华清瑜";
  text[11] = "燕红叶";
  text[12] = "高希敏";
  text[13] = "江玉麟";
  text[14] = "乌廷芳";
  text[15] = "华忆莲";
  text[16] = "程天蓝";
  text[17] = "武俏君";
  
  var self = this;
  var text2 = function (n) { var r = 0; while (n > 1) r++, n >>= 1; return r; }

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 131072) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.innerHTML = text[text2(tile.value)];

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var mytxt=new Array(18);
  
  mytxt[0]="连毛芷晴都不想见到你T.T";
  mytxt[1]="只爱阳光sunshine的硕仔( ^_^ )/~~拜拜！";
  mytxt[2]="洪丝丝不给你巧克力不帮你牵红线！";
  mytxt[3]="程若晖在帮别人叠心心哦！~\(≧▽≦)/~";
  mytxt[4]="张美真爱钱钱不爱你！~~~~(>_<)~~~~ ";
  mytxt[5]="烂赌婆独自去赌坊不带你玩！";
  mytxt[6]="no zuo no die";
  mytxt[7]="邵芳芳的美腿儿离你越来越远╭(╯^╰)╮";
  mytxt[8]="乖乖的过来让大少奶奶扇耳光吧";
  mytxt[9]="快来救华清瑜呀~又被危永标欺负了";
  mytxt[10]="永远只有一个燕红叶~";
  mytxt[11]="老婆大人判你重新开始";
  mytxt[12]="你忍心看着江玉麟女儿身被发现而不去救她？";
  mytxt[13]="我和琴清一起掉河里你竟然不救我~game over~";
  mytxt[14]="~~~告诉忆莲远离爷爷~~~";
  mytxt[15]="程天蓝说：漂亮就行，不漂亮的都重新开始~";
  mytxt[16]="帮俏君淹shi芊芊吧，徐飞永远只爱俏君 = =！";
  mytxt[17]="看不见宣萱的太阳花了 = =";
 
  
  var text3 = function (m) { var r = 0; while (m > 1) r++, m >>= 1; return r; }
  var type    = won ? "game-won" : "game-over";
  var message = won ? "宣萱对你说：你是最棒的！" : mytxt[text3(maxscore)-1];

  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "end", type, this.score);
  }

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  this.clearContainer(this.sharingContainer);
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

