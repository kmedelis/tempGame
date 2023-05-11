class MainStateManager {
    constructor() {
    }

    registerEventListeners() {
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

            console.log(row, col)
        
            var isWall = client.map.checkIfWall(row, col);

            if (isWall) {
                return;
            }
            else {
                client.map.go(row, col);
            }
        
            client.player.walk(client.map.grid, client);
            client.map.reset(row, col);
        });
    }

    hideBoth() {
        playerInfoDiv.hidden = true;
        battleInfoDiv.hidden = true;
        canvas.classList.add('hide');
        canvasBattle.classList.add('hide');
        userinfo.hidden = true;
    }

    async showFirst(grid) {
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

    setup() {
        this.hideBoth();
        this.registerEventListeners();
    }
}