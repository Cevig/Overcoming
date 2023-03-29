export const createPoint = (...pos) => {
  const [x, y, z] = pos;
  return { x, y, z, coord: `${x},${y},${z}` };
}

export const isSame = p1 => p2 => p1.coord === p2.coord;

export const isNotSame = p1 => p2 => p1.coord !== p2.coord;

export const getNeighbors = ({ x, y, z }) => {
  return [
    [0, -1, 1],
    [1, -1, 0],
    [1, 0, -1],
    [0, 1, -1],
    [-1, 1, 0],
    [-1, 0, 1],
  ]
    .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
    .map(p => createPoint(...p));
}

const areNeighbors = points => {
  const allNeighbors = points.reduce((allNeighbors, point) => [
    ...allNeighbors,
    ...getNeighbors(point),
  ], []);
  return possible => allNeighbors.some(isSame(possible));
}

const isContained = list => point => !list.some(isSame(point));

export const areAllConnected = points => {
  points = [...points];
  let current = points.splice(0, 1);
  while (points.length > 0 && current.length > 0) {
    current = points.filter(areNeighbors(current));
    points = points.filter(isContained(current));
  }
  return points.length === 0;
}

export const getPointByVector = (point, vector) =>
  createPoint(point.x + vector.x, point.y + vector.y, point.z + vector.z);

export const getInGameUnits = (G, filter = () => true) =>
  G.players.flatMap(p => p.units.filter(unit => (unit.unitState.isInGame === true) && filter(unit)));

export const skipPositioningTurn = (G, ctx, events) => {
  if(getInGameUnits(G, (unit) => (unit.unitState.playerId === +ctx.currentPlayer) && unit.unitState.isClickable).length === 0)
    events.endTurn()
}

