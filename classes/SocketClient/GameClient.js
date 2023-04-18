class GameClient {
    constructor() {
      this.clientId = null;
      this.gameId = null;
      this.playerColor = null;
      this.player = null;
      this.ws = new WebSocket("ws://localhost:9090");
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
        }
      };
    }
  
    joinGame() {
      if (this.gameId === null) {
        this.gameId = this.txtGameId.value;
      }

      var player = new Player(0, 0, rectangleSize, context);
  
      const payload = {
        method: "join",
        clientId: this.clientId,
        gameId: this.gameId,
        player: player,
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

    sendPlayerMovement(row, col) {
      console.log("sending player movement")
      const payload = {
        method: 'playerMovement',
        clientId: this.clientId,
        gameId: this.gameId,
        row: row,
        col: col,
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
      console.log(response.grid)
      this.player = response.player;
      showFirst(response.grid); // refactor this 

      const game = response.game;
    }

    handlePlayerMovement(data) {
      const row = data.row;
      const col = data.col;
      map.grid[player1.i][player1.j] = new MapSpot(player1.i, player1.j, mainGridSize, rectangleSize);
      player1.i = row;
      player1.j = col;
      map.setStartingPlayerLocation();
      map.drawGrid();
    }

}