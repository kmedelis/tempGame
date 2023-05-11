class GameClient {
    constructor() {
      this.clientId = null;
      this.gameId = null;
      this.playerColor = null;
      this.player = null;
      this.players = [];
      this.map = null;
      this.ws = new WebSocket("ws://localhost:9090");
      this.mainStateManager = null
      this.battleStateManager = null
      this.gameStateChangeManager = null
      this.btnServer = document.getElementById("btnServer");
      this.connectionOpen = false;
  
      this.initializeEventListeners();
      this.setupWebSocket();
    }
  
    initializeEventListeners() {
      this.btnServer.addEventListener("click", (e) => {
        const buttonValue = e.target.getAttribute("value");
        this.joinGame(buttonValue);
      });
    }
  
    setupWebSocket() {
      this.ws.onmessage = (message) => {
        const response = JSON.parse(message.data);
  
        if (response.method === "connect") {
          this.handleConnect(response);
        } else if (response.method === "create") {
          this.handleCreate(response);
        } else if (response.method === "update") {
          this.handleUpdate(response);
        } else if (response.method === "join") {
          this.handleJoin(response);
        } else if (response.method === "playerMovement") {
          this.handlePlayerMovement(response);
        } else if (response.method === "broadcastJoin") {
          this.handleBroadcastJoin(response);
        } else if (response.method === "getGrid") {
          this.handleGetGrid(response);
        }
      };
    }
  
    joinGame() {
      if (this.gameId === null) {
        this.gameId = 1;
      }
      let randomInt = Math.floor(Math.random() * 29);

      var player = new Player(randomInt, randomInt, rectangleSize, context, this.clientId);
      var troop1 = new Unit(5, 5, rectangleSizeBattle, battleContext, 3, "player");
      player.addUnit(troop1);


      var map = new MainMap(player, mainGridSize, canvas, context);

      this.player = player;
      this.map = map;
  
      const payload = {
        method: "join",
        gameId: this.gameId,
        clientId: this.clientId,
        i: player.i,
        j: player.j,
      };
  
      this.ws.send(JSON.stringify(payload));
    }
  
    createGame() {
      const payload = {
        method: "create",
      };
  
      setTimeout(() => {
        this.ws.send(JSON.stringify(payload));
      }, 1000);
    }

    sendPlayerMovement(i, j, oldI, oldJ) {
      const payload = {
        method: 'playerMovement',
        clientId: this.clientId,
        gameId: this.gameId,
        i: i,
        j: j,
        oldI: oldI,
        oldJ: oldJ,
      };
      this.ws.send(JSON.stringify(payload));
    }

    getGrid() {
      const payload = {
        method: 'getGrid',
        gameId: this.gameId,
      };
      this.ws.send(JSON.stringify(payload));
    }

  
    handleConnect(response) {
      this.clientId = response.clientId;
      console.log("Client id Set successfully " + this.clientId);
    }
  
    handleCreate(response) {
      this.gameId = response.game.id;
      this.btnServer.setAttribute("value", this.gameId);
    }
  
    handleUpdate(response) {
      if (!response.game.state) return;
      for (const b of Object.keys(response.game.state)) {
        const color = response.game.state[b];
        const ballObject = document.getElementById("ball" + b);
        ballObject.style.backgroundColor = color;
      }
    }
  
    handleJoin(response) {
      this.players = response.clients.map(client => new OtherPlayer(client.i, client.j, rectangleSize, context, client.clientId));
      this.mainStateManager.showFirst(response.grid); 
      // this.battleStateManager.showSecond();
    }
    
    handleBroadcastJoin(response) {
      const newClient = response.newClient;
      const newOtherPlayer = new OtherPlayer(newClient.i, newClient.j, rectangleSize, context, newClient.clientId);
      this.players.push(newOtherPlayer);
    }

    handlePlayerMovement(response) {
      this.map.grid[response.oldI][response.oldJ].color = "#007500";
      this.map.grid[response.oldI][response.oldJ].show(context);
      const movedPlayer = this.players.find(player => player.clientId === response.movedId); // This line selects the player with movedId
      movedPlayer.i = response.i;
      movedPlayer.j = response.j;
      movedPlayer.show()
    }

    async handleGetGrid(response) {
      const grid = response.grid;
      await this.map.setup();
      this.map.setGrid(grid);
      this.map.draw();
      playerInfoDiv.hidden = false;
      battleInfoDiv.hidden = true;
      userinfo.hidden = false;
      canvas.classList.remove('hide'); 
      canvasBattle.classList.add('hide');
    }

    setMainStateManager(mainStateManager) {
      this.mainStateManager = mainStateManager;
    }

    setBattleStateManager(battleStateManager) {
      this.battleStateManager = battleStateManager;
    }

    setGameStateChangeManager(gameStateChangeManager) {
      this.gameStateChangeManager = gameStateChangeManager;
    }
}