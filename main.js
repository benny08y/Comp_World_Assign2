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
var gameEngine;
function Water() {
    this.id = 0;
    this.radius = 10;
    this.position = 0;
    this.velocity = 0;
    this.colorsArr = ["Red", "Green", "Blue", "White"];
    this.color = 2;
    Entity.call(this, gameEngine, this.x, this.y);
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
        this.color = this.colorsArr[0];
        return this.color;
    } else if (this.position < 0) {     //green
        this.color = this.colorsArr[1];
        return this.color;
    } else {                            //blue
        this.color = this.colorsArr[2];
        return this.color;
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
var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    gameEngine = new GameEngine();

    let radius = 22;
    let start = 20;
    let end = 780;
    let pondIndex = 0;
    let id = 0;
    for (var i = start; i <= end; i += radius) {        //Inialize pondArray by adding in Water objects
        pondArray[pondIndex] = [];

        for (var j = start; j <= end; j += radius) {
            let circle = new Water();
            circle.x = i;
            circle.y = j;
            circle.id = id;
            id++;
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





    gameEngine.init(ctx);
    gameEngine.start();
});


// Professor Marriott's Database
window.onload = function () {
    var socket = io.connect("http://24.16.255.56:8888");

    socket.on("load", function (data) {
        // console.log(data.data);
        let loadPondArr = data.data;

        for (var i = 0; i < pondArray.length; i++) {    
            for (var j = 0; j < pondArray[i].length; j++) {
                let loadWaterDrop = loadPondArr[i][j];
                let curWaterDrop = pondArray[i][j];

                // console.log(loadWaterDrop);
                curWaterDrop.position = loadWaterDrop.position;
                curWaterDrop.velocity = loadWaterDrop.velocity;
                curWaterDrop.color = loadWaterDrop.color;               
                
            }
        }

    });

    var text = document.getElementById("text");
    var saveButton = document.getElementById("save");
    var loadButton = document.getElementById("load");


    // Save id, position, velocaity, color, x and y position
    saveButton.onclick = function () {
        console.log("save");
        text.innerHTML = "Saved."

        let savePondArr = [];
        for (var i = 0; i < pondArray.length; i++) {        
    
            savePondArr[i] = [];
            for (var j = 0; j < pondArray[i].length; j++) {
    
                var oldWaterDrop = pondArray[i][j];
    
                let saveWaterData = {
                    id: oldWaterDrop.id,
                    position: oldWaterDrop.position,
                    velocity: oldWaterDrop.velocity,
                    color: oldWaterDrop.color,
                    x: oldWaterDrop.x,
                    y: oldWaterDrop.y
                };
    
                savePondArr[i][j] = saveWaterData;
    
            }
        }
    
        // console.log(savePondArr);


        socket.emit("save", {
            studentname: "Ben Yuen",
            statename: "wave",
            data: savePondArr           

        });
    };

    loadButton.onclick = function () {
        console.log("load");
        text.innerHTML = "Loaded."
        socket.emit("load", { studentname: "Ben Yuen", statename: "wave" });
    };

};





