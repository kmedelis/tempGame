const http = require("http");
const app = require("express")();
const websocketServer = require("websocket").server;

class GameServer {
  constructor() {
    this.clients = {};
    this.games = {};

    app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
    app.listen(9091, () => console.log("Listening on http port 9091"));

    this.httpServer = http.createServer();
    this.httpServer.listen(9090, () => console.log("Listening.. on 9090"));

    this.wsServer = new websocketServer({
      httpServer: this.httpServer, 
    });

    this.wsServer.on("request", (request) => this.handleRequest(request));

    this.updateGameState();
  }

  handleRequest(request) {
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"));
    connection.on("close", () => console.log("closed!"));
    connection.on("message", (message) => {
      const result = JSON.parse(message.utf8Data);

      if (result.method === "create") {
        this.handleCreate(result, connection);
      } else if (result.method === "join") {
        this.handleJoin(result);
      } else if (result.method === "play") {
        this.handlePlay(result);
      } else if (result.method === "playerMovement") {
        this.handlePlayerMovement(result);
      }
    });

    const clientId = this.guid();
    this.clients[clientId] = {
      connection: connection,
    };

    const payload = {
      method: "connect",
      clientId: clientId,
    };

    connection.send(JSON.stringify(payload));
  }

  handleJoin(result) {
    const clientId = result.clientId;
    const gameId = result.gameId;
    const x = result.x;
    const y = result.y;

    const game = this.games[gameId];

    this.broadcastJoin(game, clientId, x, y);

    game.clients.push({
      clientId: clientId,
      x: x,
      y: y,
    });

    const payload = {
      method: "join",
      grid: game.grid,
    };

    game.clients.forEach((c) => {
      this.clients[c.clientId].connection.send(JSON.stringify(payload));
    });
  }

  broadcastJoin(game, clientId, x, y) {
    const payload = {
      method: "broadcastJoin",
      clientId: clientId,
      x: x,
      y: y,
    };

    game.clients.forEach((c) => {
      console.log("sending broadcast join");
      this.clients[c.clientId].connection.send(JSON.stringify(payload));
    });
  }

  handlePlayerMovement(result) {
    const gameId = result.gameId;
    const game = this.games[gameId];

    const payload = {
      method: "playerMovement",
      row: result.row,
      col: result.col,
    };

    game.clients.forEach((c) => {
      console.log(payload);
      this.clients[c.clientId].connection.send(JSON.stringify(payload));
    });
  }

  handleCreate(result, connection) {
    let gameId;
    let gameExists = false;
  
    // Check if a game already exists
    for (const game in this.games) {
      if (this.games[game].clients.length < 2) {
        gameId = this.games[game].id;
        gameExists = true;
        break;
      }
    }
  
    // If no game exists, create a new one
    if (!gameExists) {
      gameId = this.guid();
      const grid = this.createGrid(30, 20);
      this.games[gameId] = {
        id: gameId,
        clients: [],
        grid: grid,
      };
    }
  
    const payload = {
      method: "create",
      game: this.games[gameId],
      grid: this.games[gameId].grid,
    };
  
    connection.send(JSON.stringify(payload));
  }

  createGrid(gridSize, rectangleSize) {
    var grid = new Array(gridSize);
    for (var i = 0; i < gridSize; i++) {
      grid[i] = new Array(gridSize);
    }
  
    for (var i = 0; i < gridSize; i++) {
      for (var j = 0; j < gridSize; j++) {
        let cell = {
          i: i,
          j: j,
          type: "empty",
          color: "green"
        };
  
        if (Math.random() < 0.2) {
          cell.type = "wall";
        } else if (Math.random() < 0.1) {
          cell.type = "gold";
        } else if (Math.random() < 0.1) {
          cell.type = "enemy";
          cell.color = "red";
        }
  
        grid[i][j] = cell;
      }
    }
  
    return grid;
  }

  handlePlay(result) {
    const gameId = result.gameId;
    const ballId = result.ballId;
    const color = result.color;
    let state = this.games[gameId].state;

    if (!state) state = {};

    state[ballId] = color;
    this.games[gameId].state = state;
  }

  updateGameState() {
    for (const g of Object.keys(this.games)) {
      const game = this.games[g];
      const payload = {
        method: "update",
        game: game,
      };

      game.clients.forEach((c) => {
        this.clients[c.clientId].connection.send(JSON.stringify(payload));
      });
    }

    setTimeout(() => this.updateGameState(), 500);
  }

  guid() {
    const S4 = (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
    return (S4+S4+"-"+S4+"-"+S4+"-"+S4+"-"+S4+S4+S4);
  }
}

new GameServer();