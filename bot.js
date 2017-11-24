const http = require('http');
// const state = require('./test.json');

const inBounds = (loc, edge) => {
  return loc.x > 0 && loc.x < edge &&
    loc.y > 0 && loc.y < edge &&
    loc.z > 0 && loc.z < edge;
};

const isAvoidableLocation = (loc, locations) => {
  return !locations || !!locations.filter((l) => {
    return loc.x === l.x && loc.y === l.y && loc.z === l.z;
  }).length;
};

const resolvePossibleMoves = (state, player, extraAvoidableLocations) => {
  return locations = [
    {x: player.x + 1, y: player.y + 0, z: player.z + 0, direction: '+X'},
    {x: player.x - 1, y: player.y + 0, z: player.z + 0, direction: '-X'},
    {x: player.x + 0, y: player.y + 1, z: player.z + 0, direction: '+Y'},
    {x: player.x + 0, y: player.y - 1, z: player.z + 0, direction: '-Y'},
    {x: player.x + 0, y: player.y + 0, z: player.z + 1, direction: '+Z'},
    {x: player.x + 0, y: player.y + 0, z: player.z - 1, direction: '-Z'}
  ].filter(loc => inBounds(loc, state.gameInfo.edgeLength) &&
    !isAvoidableLocation(loc, state.items) &&
    !isAvoidableLocation(loc, state.players) &&
    !isAvoidableLocation(loc, extraAvoidableLocations));
};

const getNextTicks = (state) => {
  const laarnio = state.players.filter((p) => p.name === state.currentPlayer.name)[0];
  const otherPlayersPossibleMoves = [].concat(state.players.filter((p) => p.name === state.currentPlayer.name).map((p) => {
    return resolvePossibleMoves(state, p).push({x: p.x, y: p.y, z: p.z});
  }));

  const ownPossibleMoves = resolvePossibleMoves(state, laarnio, otherPlayersPossibleMoves);

  // const maxCost = 10000;
  // let moveCost = 0;
  // let bombCost = 0;
  // let noopCost = 1000;

  // moveCost = numOfTasksPerTick * 100;
  // bombCost = 100 / numOfTasksPerTick;

  const tasks = [];

  for (let i = 0; i < state.gameInfo.numOfTasksPerTick; i++) {
    const pm = ownPossibleMoves[0];

    if (pm) {
      tasks.push({
        task: 'MOVE',
        direction: pm.direction
      });
    } else {
      tasks.push({
        task: 'NOOP'
      });
    }
  }

  console.log(tasks);

  return tasks;
};

http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (data) => {
      body += data;
    });

    req.on('end', () => {
      const gameState = JSON.parse(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(getNextTicks(gameState)));
    });

  }
}).listen(80);
