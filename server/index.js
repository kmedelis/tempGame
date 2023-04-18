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

  handleCreate(result, connection) {
    const clientId = result.clientId;
    const gameId = this.guid();
    this.games[gameId] = {
      id: gameId,
      clients: [],
    };

    const payload = {
      method: "create",
      game: this.games[gameId],
    };

    connection.send(JSON.stringify(payload));
  }

  handleJoin(result) {
    const clientId = result.clientId;
    const player = result.player;
    const gameId = result.gameId;
    const game = this.games[gameId];

    if (game.clients.length >= 3) {
      return;
    }

    const color = { "0": "Red", "1": "Green" }[game.clients.length];
    game.clients.push({
      clientId: clientId,
      color: color,
      player: player,
    });

    if (game.clients.length === 2) this.updateGameState();

    const payload = {
      method: "join",
      game: game,
      player: player,
    };

    game.clients.forEach((c) => {
      this.clients[c.clientId].connection.send(JSON.stringify(payload));
    });
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