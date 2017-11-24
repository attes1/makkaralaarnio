const http = require('http');
// const state = require('./test.json');

const inBounds = (loc, edge) => {
  return loc.x > 0 && loc.x < edge &&
    loc.y > 0 && loc.y < edge &&
    loc.z > 0 && loc.z < edge;
};

const hasBomb = (loc, items) => {
  return !!items.filter((item) => {
    return loc.x === item.x && loc.y === item.y && loc.z === item.z;
  }).length;
};

const hasPlayer = (loc, players) => {
  return !!players.filter((player) => {
    return loc.x === player.x && loc.y === player.y && loc.z === player.z;
  }).length;
};

const resolvePossibleMoves = (state, player) => {
  const locations = [
    {x: player.x + 1, y: player.y + 0, z: player.z + 0},
    {x: player.x - 1, y: player.y + 0, z: player.z + 0},
    {x: player.x + 0, y: player.y + 1, z: player.z + 0},
    {x: player.x + 0, y: player.y - 1, z: player.z + 0},
    {x: player.x + 0, y: player.y + 0, z: player.z + 1},
    {x: player.x + 0, y: player.y + 0, z: player.z - 1}
  ].filter(loc => inBounds(loc, state.gameInfo.edgeLength) && !hasBomb(loc, items) && !hasPlayer(loc, players));
};

const getNextTicks = (state) => {
  const laarnio = state.players.filter((p) => p.name === 'laarnio')[0];
  const ownMoves = resolvePossibleMoves(state, laarnio);
};

//getNextTicks(state);

http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (data) => {
      body += data;
    });

    req.on('end', () => {
      const nextTickInfo = JSON.parse(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(getNextTicks(gameState)));
    });

  }
}).listen(1337);
