/*
   Ben Yuen
   Computational Worlds: Pond Simulator
   3/2/2019

   Cite:
   Marriott gameengine, assetmanager
   Inspiration for project: http://pages.cs.wisc.edu/~elloyd/cs540Project/eric/elloyd-waves.html#LINKS 
        - did not use code, just read article to get an idea of how the simulation works.
*/

var pondArray = [];

function Water(game) {
    this.id = 0;
    this.radius = 10;
    this.position = 0;
    this.velocity = 0;
    this.game = game;
    this.colorsArr = ["Red", "Green", "Blue", "White"];
    this.color = 2;
    Entity.call(this, game, this.x, this.y);
};

Water.prototype = new Entity();
Water.prototype.constructor = Water;

Water.prototype.update = function () {    

    this.position += this.velocity;
    let neighborAvg = getNeighborsAvg(this.id);
    let changePosition = neighborAvg - this.position;
    let c = 0.003;
    this.velocity += changePosition * c;    

    Entity.prototype.update.call(this);
};

function getNeighborsAvg(id) {
    let sum = 0;

    for (var i = 1; i < pondArray.length - 1; i++) {
        for (var j = 1; j < pondArray.length - 1; j++) {
            if (!isEdge(i, j) && id == pondArray[i][j].id) {
                sum = pondArray[i - 1][j - 1].position + pondArray[i][j - 1].position + pondArray[i + 1][j - 1].position
                    + pondArray[i - 1][j].position + pondArray[i + 1][j].position
                    + pondArray[i - 1][j + 1].position + pondArray[i][j + 1].position + pondArray[i + 1][j + 1].position;
                
            }
        }
    }

    return sum / 8;
}

function isEdge(i, j) {
    return i == 0 || j == 0 || i == pondArray.length - 1 || j == pondArray.length - 1;
}

Water.prototype.getColor = function () {
    if (this.position === 0) {      //red
        return this.colorsArr[0];
    } else if (this.position < 0) {     //green
        return this.colorsArr[1];
    } else {                            //blue
        return this.colorsArr[2];
    }
}

Water.prototype.draw = function (ctx) {
    ctx.beginPath();

    ctx.fillStyle = this.getColor();
    // ctx.fillStyle = this.colorsArr[3];

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};


// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;


var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();


    let radius = 22;
    let start = 20;
    let end = 780;
    let pondIndex = 0;
    let id = 0;
    for (var i = start; i <= end; i += radius) {
        pondArray[pondIndex] = [];

        for (var j = start; j <= end; j += radius) {           
            let circle = new Water(gameEngine);
            circle.x = i;
            circle.y = j;
            circle.id = id;
            id ++;
            pondArray[pondIndex].push(circle);
            gameEngine.addEntity(circle);
        }
        pondIndex++;
    }

    // Start the wave by picking a spot in pondArray and setting it to 1 or -1. 
    // Maybe have user set values. Also have slider that controls speed.     

    let xPos = Math.ceil(Math.random() * pondArray.length - 2) + 1;
    let yPos = Math.round(Math.random() * pondArray.length - 2) + 1;
    pondArray[xPos][yPos].position = -1;

    // let pebble = { x: Math.round(pondArray.length / 4), y: Math.round(pondArray.length / 4) };
    // pondArray[pebble.x][pebble.y].position = 1;
    // pondArray[pebble.x*2][pebble.y*2].position = -1;
    // pondArray[1][1].position = -1;
    // pondArray[pondArray.length-2][pondArray.length-2].position = -1;

    gameEngine.pondArray = pondArray;
    // console.log(gameEngine.pondArray);
    gameEngine.init(ctx);
    gameEngine.start();
});
