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

var troop1 = new Unit(5, 5, rectangleSizeBattle, battleContext, 3);
var troop2 = new Unit(10, 10, rectangleSizeBattle, battleContext, 3);
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

function initializeFirstTurn() {
    var currentTurn = player.army[0];
    currentTurn.setMovement();
    battleMap.getPossiblePath(currentTurn.i , currentTurn.j , currentTurn.movement);
}

var turn = 0;
showSecond();
initializeFirstTurn();

canvasBattle.addEventListener("click", async (event) => {
    if (!inBattle) { 
        return;
    }

    if (walkingInBattle) {
        return;
    }

    var currentTurn = player.army[turn];

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

    await currentTurn.walk(battleMap.grid);
    battleMap.reset(row, col);
    battleMap.resetWalkablePath();
    battleMap.getPossiblePath(currentTurn.i , currentTurn.j , currentTurn.movement);
    currentTurn.show();

    if (currentTurn.movement <= 0) {
        if (turn === player.army.length - 1) {
            turn = 0;
            player.army[0].setMovement();
            battleMap.getPossiblePath(player.army[0].i, player.army[0].j, player.army[0].movement);
        } else {
            turn++;
            var currentTurn = player.army[turn];
            currentTurn.setMovement();
            battleMap.getPossiblePath(currentTurn.i , currentTurn.j , currentTurn.movement);
        }
    }
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
    if (isWall) {
        return;
    }
    else {
        map.go(row, col);
    }

    // path[path.length - 1].color="green";
    player.walk(map.grid);

    map.reset(row, col);
});
