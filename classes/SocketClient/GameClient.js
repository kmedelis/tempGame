class GameClient {
    constructor() {
      this.clientId = null;
      this.gameId = null;
      this.playerColor = null;
      this.player = null;
      this.ws = new WebSocket("ws://localhost:9090");
      this.btnCreate = document.getElementById("btnCreate");
      this.btnJoin = document.getElementById("btnJoin");
      this.txtGameId = document.getElementById("txtGameId");
      this.divPlayers = document.getElementById("divPlayers");
  
      this.initializeEventListeners();
      this.setupWebSocket();
    }
  
    initializeEventListeners() {
      this.btnJoin.addEventListener("click", (e) => {
        this.joinGame();
      });
  
      this.btnCreate.addEventListener("click", (e) => {
        this.createGame();
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
        clientId: this.clientId,
      };
  
      this.ws.send(JSON.stringify(payload));
    }
  
    handleConnect(response) {
      this.clientId = response.clientId;
      console.log("Client id Set successfully " + this.clientId);
    }
  
    handleCreate(response) {
      this.gameId = response.game.id;
      console.log("game successfully created with id " + response.game.id);
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
      console.log(response)
      this.player = response.player;
      showFirst(); // refactor this 

      const game = response.game;
    }



  }