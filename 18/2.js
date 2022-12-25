const fs = require("fs");

let minX = Number.MAX_SAFE_INTEGER;
let maxX = Number.MIN_SAFE_INTEGER;
let minY = Number.MAX_SAFE_INTEGER;
let maxY = Number.MIN_SAFE_INTEGER;
let minZ = Number.MAX_SAFE_INTEGER;
let maxZ = Number.MIN_SAFE_INTEGER;

const map = {};

let inputCubes = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row) => {
    const [x, y, z] = row.split(",").map(parseFloat);
    minX = Math.min(minX, x - 1);
    minY = Math.min(minY, y - 1);
    minZ = Math.min(minZ, z - 1);
    maxX = Math.max(maxX, x + 1);
    maxY = Math.max(maxY, y + 1);
    maxZ = Math.max(maxZ, z + 1);
    map[`${x},${y},${z}`] = 1;
    return {
      x,
      y,
      z,
      xMin: false,
      xMax: false,
      yMin: false,
      yMax: false,
      zMin: false,
      zMax: false,
    };
  });

function findBarriersOnCube(cubes) {
  for (let i = 0; i < cubes.length; ++i) {
    const cubeI = cubes[i];
    for (let j = i + 1; j < cubes.length; ++j) {
      const cubeJ = cubes[j];
      // console.log({ cubeI, cubeJ });
      if (cubeI.x === cubeJ.x && cubeI.y === cubeJ.y) {
        // Check Z
        if (cubeI.z === cubeJ.z - 1) {
          cubeI.zMax = true;
          cubeJ.zMin = true;
        } else if (cubeI.z === cubeJ.z + 1) {
          cubeJ.zMax = true;
          cubeI.zMin = true;
        }
      }
      if (cubeI.x === cubeJ.x && cubeI.z === cubeJ.z) {
        // Check Y
        if (cubeI.y === cubeJ.y - 1) {
          cubeI.yMax = true;
          cubeJ.yMin = true;
        } else if (cubeI.y === cubeJ.y + 1) {
          cubeJ.yMax = true;
          cubeI.yMin = true;
        }
      }
      if (cubeI.z === cubeJ.z && cubeI.y === cubeJ.y) {
        // Check X
        if (cubeI.x === cubeJ.x - 1) {
          cubeI.xMax = true;
          cubeJ.xMin = true;
        } else if (cubeI.x === cubeJ.x + 1) {
          cubeJ.xMax = true;
          cubeI.xMin = true;
        }
      }
    }
  }
}

findBarriersOnCube(inputCubes);

for (let x = minX; x <= maxX; ++x) {
  for (let y = minY; y <= maxY; ++y) {
    for (let z = minZ; z <= maxZ; ++z) {
      const key = `${x},${y},${z}`;
      if (!map[key]) {
        map[key] = -1;
      }
    }
  }
}

const seen = {};
function outsideInFill({ x, y, z }) {
  if (seen[`${x},${y},${z}`]) return;
  map[`${x},${y},${z}`] = 0;
  seen[`${x},${y},${z}`] = 1;

  if (map[`${x + 1},${y},${z}`] === -1) outsideInFill({ x: x + 1, y: y, z: z });
  if (map[`${x - 1},${y},${z}`] === -1) outsideInFill({ x: x - 1, y: y, z: z });
  if (map[`${x},${y + 1},${z}`] === -1) outsideInFill({ x: x, y: y + 1, z: z });
  if (map[`${x},${y - 1},${z}`] === -1) outsideInFill({ x: x, y: y - 1, z: z });
  if (map[`${x},${y},${z + 1}`] === -1) outsideInFill({ x: x, y: y, z: z + 1 });
  if (map[`${x},${y},${z - 1}`] === -1) outsideInFill({ x: x, y: y, z: z - 1 });
}

outsideInFill({ x: minX, y: minY, z: minZ });

const sumAir = Object.keys(map)
  .filter((key) => map[key] === 1)
  .reduce((sum, key) => {
    let subSum = 0;
    const [x, y, z] = key.split(",").map(parseFloat);
    for (const [dx, dy, dz] of [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ]) {
      const dkey = `${x + dx},${y + dy},${z + dz}`;
      if (map[dkey] === 0) subSum++;
    }
    return sum + subSum;
  }, 0);

console.log({ sumAir });
