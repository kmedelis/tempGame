const mainGridSize = 30;
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const rectangleSize = canvas.width / mainGridSize;

const battleGridSize = 15;
const canvasBattle = document.getElementById('canvasBattle');
const battleContext = canvasBattle.getContext("2d");
const rectangleSizeBattle = canvasBattle.width / battleGridSize;

var inBattle;
var armyQue;

var player1 = new Player(0, 0, rectangleSize, context);
var player2 = new Player(0, 0, rectangleSize, context);
var map = new Map(player1, player2, mainGridSize, canvas, context);

var troop1 = new Unit(5, 5, rectangleSizeBattle, battleContext, 3, "player");
var troop2 = new Unit(10, 10, rectangleSizeBattle, battleContext, 3, "player");
player1.addUnit(troop1);
player2.addUnit(troop2);

var battleMap = new BattleMap(player1, player2, battleGridSize, canvasBattle, battleContext);

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
    armyQue = player1.army.concat(player2.army);
    currentTurn = armyQue[0]
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

    var currentTurn = armyQue[turn];

    path = [];
    battleMap.resetInformationAboutPrevious();
    battleMap.resetDrawnGridPaths();

    const x = event.clientX - canvasBattle.offsetLeft;
    const y = event.clientY - canvasBattle.offsetTop;
    const row = Math.floor(y / rectangleSizeBattle);
    const col = Math.floor(x / rectangleSizeBattle);

    start = battleMap.grid[currentTurn.i][currentTurn.j];

    var isWalkable = battleMap.checkIfWalkable(row, col);
    var isEnemy = battleMap.checkIfEnemy(row, col);
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
        if (turn === armyQue.length - 1) {
            turn = 0;
            armyQue[0].setMovement();
            battleMap.getPossiblePath(armyQue[0].i, armyQue[0].j, armyQue[0].movement);
        } else {
            turn++;
            var currentTurn = armyQue[turn];
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
