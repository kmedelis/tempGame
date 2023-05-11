var htmlHelper = new HtmlHelper();
var client = new GameClient();
var mainStateManager = new MainStateManager();
var battleStateManager = new BattleStateManager();
// var gameStateChangeManager = new GameStateChangeManager();

mainStateManager.setup();
battleStateManager.setup();

client.setMainStateManager(mainStateManager);
client.setBattleStateManager(battleStateManager);
// client.setGameStateChangeManager(gameStateChangeManager);

client.createGame();

// var player1 = new Player(0, 0, rectangleSize, context);
// var player2 = new Player(1, 1, rectangleSize, context);

// var troop1 = new Unit(5, 5, rectangleSizeBattle, battleContext, 3, "player");
// var troop3 = new ComputerUnit(5, 10, rectangleSizeBattle, battleContext, 2, "AI");

// troop3.addPlayerUnits(troop1);
// player1.addUnit(troop1);
// player2.addUnit(troop3);

// var battleMap = new BattleMap(player1, player2, battleGridSize, canvasBattle, battleContext);

function hideMenu() {
    gameMenu.hidden = true;
}

async function doAiStuff(unit) {
    start = battleMap.grid[unit.i][unit.j];
    var shortestDistance = unit.calculateDistanceToPlayerUnits();
    battleMap.go(shortestDistance.i, shortestDistance.j);
    var isEnemyMet = await unit.walk(battleMap.grid);

    if (isEnemyMet) {
        var dead = unit.tryToKill(shortestDistance);
        htmlHelper.updateHealth(shortestDistance)
        if (dead)
        {
            const index = armyQue.findIndex((i) => {
                return i.id === shortestDistance.id;
                })
            armyQue.splice(index, 1);
        }
    }
    battleMap.reset();
    htmlHelper.moveFirstElementToEnd(turn);
    moveTurn(unit)  
}
