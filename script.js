var htmlHelper = new HtmlHelper();
var client = new GameClient();

// var player1 = new Player(0, 0, rectangleSize, context);
// var player2 = new Player(1, 1, rectangleSize, context);

// var troop1 = new Unit(5, 5, rectangleSizeBattle, battleContext, 3, "player1");
// var troop2 = new Unit(6, 5, rectangleSizeBattle, battleContext, 4, "player1");

// var troop3 = new Unit(5, 10, rectangleSizeBattle, battleContext, 3, "player2");
// var troop4 = new Unit(6, 10, rectangleSizeBattle, battleContext, 3, "player2");


// player1.addUnit(troop1);
// player1.addUnit(troop2);

// player2.addUnit(troop3);
// player2.addUnit(troop4);

// var battleMap = new BattleMap(player1, player2, battleGridSize, canvasBattle, battleContext);
client.createGame();

function hideBoth() {
    playerInfoDiv.hidden = true;
    battleInfoDiv.hidden = true;
    canvas.classList.add('hide');
    canvasBattle.classList.add('hide');
    userinfo.hidden = true;
}

function hideMenu() {
    gameMenu.hidden = true;
}

async function showFirst(grid) {
    hideMenu();
    await client.map.setup();
    client.map.setGrid(grid);
    client.map.draw();
    playerInfoDiv.hidden = false;
    battleInfoDiv.hidden = true;
    userinfo.hidden = false;
    canvas.classList.remove('hide'); 
    canvasBattle.classList.add('hide');

    inBattle = false;
}

function showSecond() {
    battleMap.setup(); 
    playerInfoDiv.hidden = true;
    battleInfoDiv.hidden = false;
    inBattle = true;
    canvas.classList.add('hide');
    canvasBattle.classList.remove('hide');
    initializeFirstTurn();
}

function initializeFirstTurn() {
    armyQue = player1.army.concat(player2.army);
    armyQue.sort((a, b) => a.speed - b.speed);
    currentTurn = armyQue[0]
    for (var i = 0; i < armyQue.length; i++) {
        battleMap.grid[armyQue[i].i][armyQue[i].j].unit = armyQue[i];
        armyQue[i].id = i;

        htmlHelper.createInfoElements(i, armyQue[i].image.src, armyQue[i].color, armyQue[i].health)
    }
    currentTurn.setMovement();
    battleMap.getPossiblePath(currentTurn.i , currentTurn.j , currentTurn.movement);

}

hideBoth();

canvas.addEventListener("click", (event) => {
    if (inBattle) { 
        return;
    }

    path = [];
    client.map.resetInformationAboutPrevious();
    client.map.resetDrawnGridPaths();

    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    const row = Math.floor(y / rectangleSize);
    const col = Math.floor(x / rectangleSize);


    var isWall = client.map.checkIfWall(row, col);
    if (isWall) {
        return;
    }
    else {
        client.map.go(row, col);
    }

    // path[path.length - 1].color="green";
    client.player.walk(client.map.grid, client);

    client.map.reset(row, col);
});


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
    var isNear = battleMap.arePointsNextToEachOther(currentTurn, row, col)

    if (isEnemy && isNear) {
        var dead = currentTurn.tryToKill(enemy);
        htmlHelper.updateHealth(enemy)
        
        battleMap.reset(row, col);
        battleMap.resetWalkablePath();
        battleMap.getPossiblePath(currentTurn.i , currentTurn.j , currentTurn.movement);
        currentTurn.show();

        moveTurn(currentTurn);
        if (dead)
        {
            const index = armyQue.findIndex((i) => {
                return i.id === enemy.id;
              })
            armyQue.splice(index, 1);
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

    moveTurn(currentTurn)
});

function moveTurn(unit) {
    console.log(unit.movement)
    if (unit.movement <= 0) {
        if (turn === armyQue.length - 1) {
            turn = 0;
            armyQue[0].setMovement();
            battleMap.getPossiblePath(armyQue[0].i, armyQue[0].j, armyQue[0].movement);
        } else {
            turn++;
            var unit = armyQue[turn];
            unit.setMovement();
            battleMap.getPossiblePath(unit.i , unit.j , unit.movement);
        }
    }
}
