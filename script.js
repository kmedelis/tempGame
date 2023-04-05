const mainGridSize = 30;
const canvas = document.getElementById("myCanvas");
const playerInfoDiv = document.getElementById('playerInfo');
const context = canvas.getContext("2d");
const rectangleSize = canvas.width / mainGridSize;

const battleGridSize = 15;
const canvasBattle = document.getElementById('canvasBattle');
const battleInfoDiv = document.getElementById('battleInfo');
const battleContext = canvasBattle.getContext("2d");
const rectangleSizeBattle = canvasBattle.width / battleGridSize;

var htmlHelper = new HtmlHelper();

var inBattle;
var armyQue;

var player1 = new Player(0, 0, rectangleSize, context);
var player2 = new Player(0, 0, rectangleSize, context);
var map = new Map(player1, player2, mainGridSize, canvas, context);

var troop1 = new Unit(5, 5, rectangleSizeBattle, battleContext, 3, "player1");
var troop2 = new Unit(6, 5, rectangleSizeBattle, battleContext, 4, "player1");

var troop3 = new Unit(5, 10, rectangleSizeBattle, battleContext, 3, "player2");
var troop4 = new Unit(6, 10, rectangleSizeBattle, battleContext, 3, "player2");


player1.addUnit(troop1);
player1.addUnit(troop2);

player2.addUnit(troop3);
player2.addUnit(troop4);

var battleMap = new BattleMap(player1, player2, battleGridSize, canvasBattle, battleContext);

function showFirst() {
    map.setup();
    playerInfoDiv.hidden = false;
    battleInfoDiv.hidden = true;
    inBattle = false;
    canvas.classList.remove('hide'); 
    canvasBattle.classList.add('hide');
}

function showSecond() {
    battleMap.setup(); 
    playerInfoDiv.hidden = true;
    battleInfoDiv.hidden = false;
    inBattle = true;
    canvas.classList.add('hide');
    canvasBattle.classList.remove('hide');
}

function initializeFirstTurn() {
    armyQue = player1.army.concat(player2.army);
    currentTurn = armyQue[0]
    for (var i = 0; i < armyQue.length; i++) {
        battleMap.grid[armyQue[i].i][armyQue[i].j].unit = armyQue[i];
        armyQue[i].id = i;

        htmlHelper.createInfoElements(i, armyQue[i].image.src, armyQue[i].color, armyQue[i].health)
    }
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
    var enemy = battleMap.grid[row][col].unit;

    var isWalkable = battleMap.checkIfWalkable(row, col);
    var isEnemy = battleMap.checkIfEnemy(currentTurn, enemy);
    console.log(isEnemy)

    if (isEnemy) {
        var dead = currentTurn.tryToKill(enemy);
        htmlHelper.updateHealth(enemy)
        if (dead)
        {
            const index = armyQue.findIndex((i) => {
                return i.id === enemy.id;
              })
            armyQue.splice(index, 1);
            console.log(armyQue)
        }
        return;
    }
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

    htmlHelper.moveFirstElementToEnd(turn);

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
