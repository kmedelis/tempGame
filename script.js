const mainGridSize = 30;
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const rectangleSize = canvas.width / mainGridSize;

const battleGridSize = 15;
const canvasBattle = document.getElementById('canvasBattle');
const battleContext = canvasBattle.getContext("2d");
const rectangleSizeBattle = canvasBattle.width / battleGridSize;

var inBattle;

var player = new Player(0, 0, rectangleSize, context);
var map = new Map(player, mainGridSize, canvas, context);

var troop1 = new Unit(5, 5, rectangleSizeBattle, battleContext);
var troop2 = new Unit(7, 7, rectangleSizeBattle, battleContext);
player.addUnit(troop1);
player.addUnit(troop2);

var battleMap = new BattleMap(player, battleGridSize, canvasBattle, battleContext);

function showFirst() {
    map.setup();
    inBattle = false;
    canvas.classList.remove('hide'); 
    canvasBattle.classList.add('hide');
}

function showSecond() {
    battleMap.setup(); 
    inBattle = true;
    canvas.classList.add('hide');
    canvasBattle.classList.remove('hide');
}

var turn = 0;

showSecond();
battleMap.getPossiblePath(5,5,5)

canvasBattle.addEventListener("click", (event) => {
    if (turn === player.army.length) {
        turn = 0;
    }

    var currentTurn = player.army[turn];
    turn++;

    if (!inBattle) { 
        return;
    }

    path = [];
    battleMap.resetInformationAboutPrevious();
    battleMap.resetDrawnGridPaths();

    const x = event.clientX - canvasBattle.offsetLeft;
    const y = event.clientY - canvasBattle.offsetTop;
    const row = Math.floor(y / rectangleSizeBattle);
    const col = Math.floor(x / rectangleSizeBattle);

    start = battleMap.grid[currentTurn.i][currentTurn.j];

    var isWalkable = battleMap.checkIfWalkable(row, col);
    console.log(isWalkable)
    if (!isWalkable) {
        return;
    }
    else {
        battleMap.go(row, col);
    }

    currentTurn.walk(battleMap.grid);

    battleMap.reset(row, col);
});



canvas.addEventListener("click", (event) => {
    if (inBattle) { 
        return;
    }

    path = [];
    map.resetInformationAboutPrevious();
    map.resetDrawnGridPaths();

    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    const row = Math.floor(y / rectangleSize);
    const col = Math.floor(x / rectangleSize);


    var isWall = map.checkIfWall(row, col);
    if (!isWall) {
        return;
    }
    else {
        map.go(row, col);
    }

    // path[path.length - 1].color="green";
    player.walk(map.grid);

    map.reset(row, col);
});
