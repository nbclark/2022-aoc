const fs = require("fs");

let cubes = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row) => {
    const [x, y, z] = row.split(",").map(parseFloat);
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

const keys = ["xMin", "xMax", "yMin", "yMax", "zMin", "zMax"];

const sum = cubes.reduce(
  (sum, cube) =>
    sum + keys.reduce((keySum, key) => keySum + (cube[key] ? 0 : 1), 0),
  0
);

console.log({ sum });
