/*
   Ben Yuen
   Computational Worlds
   Pond Simulator
   3/2/2019

   Cite:
   Marriott gameengine, assetmanager
   Inspiration for project: http://pages.cs.wisc.edu/~elloyd/cs540Project/eric/elloyd-waves.html#LINKS 
*/

var pondArray = [];

function Circle(game) {
    this.id = 0;
    this.radius = 10;
    this.position = 0;
    this.velocity = 0;
    this.game = game;
    this.colorsArr = ["Red", "Green", "Blue", "White"];
    this.color = 2;
    Entity.call(this, game, this.x, this.y);

    // this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    // var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    // if (speed > maxSpeed) {
    //     var ratio = maxSpeed / speed;
    //     this.velocity.x *= ratio;
    //     this.velocity.y *= ratio;
    // }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.update = function () {    

    this.position += this.velocity;

    //    get the position of my eight bordering neighbor "particles"
    //    calculate the average of these values, and set this value to goalPos
    let goalPosition = getNeighborsAvg(this.id);
    // console.log(goalPosition);

    //    set dPos (change in position) to the goalPos - pos
    let dPosition = goalPosition - this.position;

    //    set our velocity to velocity + dPos * c, where c is a "stiffness" constant
    let c = 0.25;
    this.velocity += dPosition * c;

    

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

Circle.prototype.getColor = function () {
    if (this.position === 0) {      //red
        return this.colorsArr[0];
    } else if (this.position < 0) {     //green
        return this.colorsArr[1];
    } else {                            //blue
        return this.colorsArr[2];
    }
}

Circle.prototype.draw = function (ctx) {
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

        for (var j = start; j <= end; j += radius) {            //Add pond Array into Circle object
            let circle = new Circle(gameEngine);
            circle.x = i;
            circle.y = j;
            circle.id = id;
            id ++;
            pondArray[pondIndex].push(circle);
            gameEngine.addEntity(circle);
        }
        pondIndex++;
    }

    for (var i = 1; i < pondArray.length - 1; i++) {
        for (var j = 1; j < pondArray.length - 1; j++) {
            // if (pondArray[i][j].id == 942){
                console.log(pondArray[i][j].id);
            // }
            
        }
    }

    let pebble = { x: Math.round(pondArray.length / 4), y: Math.round(pondArray.length / 4) };
    // pondArray[pebble.x][pebble.y].position = -1;
    pondArray[pebble.x*2][pebble.y*2].position = -1;

    gameEngine.pondArray = pondArray;
    // console.log(gameEngine.pondArray);
    gameEngine.init(ctx);
    gameEngine.start();
});
