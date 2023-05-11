class BattleStateManager {
    constructor() {
        this.currentBattle = null;
        this.currentTurn = null;
        this.player1 = null;
        this.player2 = null;
    }

    showSecond() {
        console.log("hide")
        this.currentBattle.setup(); 
        playerInfoDiv.hidden = true;
        battleInfoDiv.hidden = false;
        inBattle = true;
        canvas.classList.add('hide');
        canvasBattle.classList.remove('hide');
        this.initializeFirstTurn();
    }
    
    initializeFirstTurn() {
        console.log("initialize")
        armyQue = this.player1.army.concat(this.player2);
        armyQue.sort((a, b) => b.speed - a.speed);
        this.currentTurn = armyQue[0]
        for (var i = 0; i < armyQue.length; i++) {
            this.currentBattle.grid[armyQue[i].i][armyQue[i].j].unit = armyQue[i];
            armyQue[i].id = i;
    
            htmlHelper.createInfoElements(i, armyQue[i].image.src, armyQue[i].color, armyQue[i].health)
        }
        this.currentTurn.setMovement();
        this.currentBattle.getPossiblePath(this.currentTurn.i , this.currentTurn.j , this.currentTurn.movement);
    
    }
    
    setCurrentBattle(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        for (var i = 0; i < player2.length; i++) {
            for (var j = 0; j < player1.army.length; j++) {
                player2[i].addPlayerUnits(player1.army[j])
            }
        }
        this.currentBattle = new BattleMap(player1, player2, battleGridSize, canvasBattle, battleContext);
        this.showSecond();
    }

    registerEventListeners() {
        canvasBattle.addEventListener("click", async (event) => {
            if (!inBattle) { 
                return;
            }
        
            if (walkingInBattle) {
                return;
            }
        
            this.currentTurn = armyQue[turn];
        
            path = [];
            this.currentBattle.resetInformationAboutPrevious();
            this.currentBattle.resetDrawnGridPaths();
        
            const x = event.clientX - canvasBattle.offsetLeft;
            const y = event.clientY - canvasBattle.offsetTop;
            const row = Math.floor(y / rectangleSizeBattle);
            const col = Math.floor(x / rectangleSizeBattle);
        
            start = this.currentBattle.grid[this.currentTurn.i][this.currentTurn.j];
            var enemy = this.currentBattle.grid[row][col].unit;
        
            var isWalkable = this.currentBattle.checkIfWalkable(row, col);
            var isEnemy = this.currentBattle.checkIfEnemy(this.currentTurn, enemy);
            var isNear = this.currentBattle.arePointsNextToEachOther(this.currentTurn, row, col)
        
            if (isEnemy && isNear) {
                var dead = this.currentTurn.tryToKill(enemy);
                htmlHelper.updateHealth(enemy)
                
                this.currentBattle.reset(row, col);
                this.currentBattle.getPossiblePath(this.currentTurn.i , this.currentTurn.j , this.currentTurn.movement);
                this.currentTurn.show();
        
                this.moveTurn(this.currentTurn);
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
                this.currentBattle.go(row, col);
            }
        
            await this.currentTurn.walk(this.currentBattle.grid);
        
            this.currentBattle.reset(row, col);
            this.currentBattle.getPossiblePath(this.currentTurn.i , this.currentTurn.j , this.currentTurn.movement);
            this.currentTurn.show();
        
            htmlHelper.moveFirstElementToEnd(turn);
        
            this.moveTurn(this.currentTurn)   
        });
    }

    checkIfTroopsAreDead() {
        var aiAlive = 0;
        var playerAlive = 0;
    
        for (var i = 0; i < armyQue.length; i++) {
            var unit = armyQue[i];
            console.log(unit.team)
    
            if (unit.team === "player") {
                playerAlive++;
            }
            if (unit.team === "AI") {
                aiAlive++;
            }
    
            if (aiAlive > 0 && playerAlive > 0) {
                return false;
            }
        }
    
        return true;
    }
    
    moveTurn(unit) {
        var troopsAreDead = this.checkIfTroopsAreDead();
    
        if (troopsAreDead) {
            console.log("troops are dead")
            client.getGrid()
            return;
        }
    
        if (unit.movement <= 0) {
            if (turn === armyQue.length - 1) {
                turn = 0;
                armyQue[0].setMovement();
                this.currentBattle.getPossiblePath(armyQue[0].i, armyQue[0].j, armyQue[0].movement);
            } else {
                turn++;
                var unit = armyQue[turn];
    
                if (unit.team == "player")
                {
                    unit.setMovement();
                    this.currentBattle.getPossiblePath(unit.i , unit.j , unit.movement);
                }
    
                if (unit.team == "AI")
                {
                    this.doAiStuff(unit)
                }
            }
        }
    }

    async doAiStuff(unit) {
        console.log(unit)
        start = this.currentBattle.grid[unit.i][unit.j];
        var shortestDistance = unit.calculateDistanceToPlayerUnits();
        this.currentBattle.go(shortestDistance.i, shortestDistance.j);
        var isEnemyMet = await unit.walk(this.currentBattle.grid);
    
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
        this.currentBattle.reset();
        htmlHelper.moveFirstElementToEnd(turn);
        this.moveTurn(unit)  
    }
    
    
    setup() {
        this.registerEventListeners();
    }
}