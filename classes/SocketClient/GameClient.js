class GameClient {
    constructor() {
      this.clientId = null;
      this.gameId = null;
      this.playerColor = null;
      this.player = null;
      this.players = [];
      this.map = null;
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
        } else if (response.method === "broadcastJoin") {
          this.handleBroadcastJoin(response);
        }
      };
    }
  
    joinGame() {
      if (this.gameId === null) {
        this.gameId = 1;
      }
      let randomInt = Math.floor(Math.random() * 29);

      var player = new Player(randomInt, randomInt, rectangleSize, context, this.clientId);
      var map = new MainMap(player, mainGridSize, canvas, context);

      this.player = player;
      this.map = map;
  
      const payload = {
        method: "join",
        gameId: this.gameId,
        clientId: this.clientId,
        x: player.i,
        y: player.j,
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
      this.players = response.clients;
      showFirst(response.grid); // refactor this 
    
      const game = response.game;
    }
    
    handleBroadcastJoin(response) {
      const newClient = response.newClient;
      this.players.push(newClient);
    }
    

    handlePlayerMovement(data) {
      const clientId = data.clientId;
      const row = data.row;
      const col = data.col;
      const player = this.players.find((p) => p.clientId === clientId);

      this.map.grid[row][col] = 1;
      player1.i = row;
      player1.j = col;
    }

}