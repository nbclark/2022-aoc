const { match } = require("assert");
const fs = require("fs");

let moves = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")[0]
  .split("")
  .reverse();

const movesCopy = [...moves];

// ####

// .#.
// ###
// .#.

// ..#
// ..#
// ###

// #
// #
// #
// #

// ##
// ##

const shapes = [
  [0b11110000],
  [0b01000000, 0b11100000, 0b01000000],
  [0b00100000, 0b00100000, 0b11100000],
  [0b10000000, 0b10000000, 0b10000000, 0b10000000],
  [0b11000000, 0b11000000],
];

function collides(shape, x, y, grid) {
  for (let row = 0; row < shape.length; ++row) {
    const shiftedRow = shape[row] >> x;
    const gridRow = grid[y + row];
    // console.log({
    //   shiftedRow: binaryToRow(shiftedRow),
    //   gridRow: binaryToRow(gridRow),
    // });
    if (shiftedRow & gridRow) return true;
  }
  return false;
}

function move(shape, x, y, direction, grid) {
  switch (direction) {
    case "<":
      if (x - 1 < 0 || collides(shape, x - 1, y, grid)) return false;
      return [x - 1, y];
    case ">":
      if (collides(shape, x + 1, y, grid)) return false;
      return [x + 1, y];
    case "v":
      if (collides(shape, x, y + 1, grid)) return false;
      return [x, y + 1];
  }
  throw new Error("");
}

function binaryRowToPrettier(row) {
  return row.replaceAll(/0/g, ".").replaceAll(/1/g, "#");
}

function binaryToRow(num) {
  const n = num.toString(2);
  return "00000000".substr(n.length) + n;
}

function drawGrid(grid, shape, startX, startY) {
  for (let row = 0; row < shape.length; ++row) {
    const shiftedRow = shape[row] >> startX;
    grid[startY + row] |= shiftedRow;
  }
  console.log(
    grid.map((x) => binaryRowToPrettier(binaryToRow(x))).join("\n") + "\n\n"
  );
}

// Each rock appears so that its left edge is two units away from the left wall
// and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).

const width = 7;
let grid = [];
const map = {};
let highestRock = 4;
let lastLength = 0;
const lengths = [];
for (let i = 0; i < 4; ++i) {
  grid.push(0b00000001);
}
const moveOutHeights = [];
const actualResults = {};
// The bottom
grid.push(0b11111111);
for (let i = 0; i < 15000; ++i) {
  let canMove = true;
  const shape = shapes[i % 5];
  let startY = 0,
    startX = 2;

  highestRock = grid.findIndex((x) => x > 1);

  const highestRockShouldBe = shape.length + 3;
  const padAmount = 3 - (highestRock - shape.length);

  if (padAmount > 0) {
    // highestRock += padAmount;
    for (let pad = 0; pad < padAmount; ++pad) {
      grid.unshift(0b00000001);
    }
  } else if (padAmount < 0) {
    // console.log("remove pad");
    grid.splice(0, Math.abs(padAmount));
  }

  if (collides(shape, startX, startY, grid)) {
    // We need to add rows if we bump into something or are too close to the bottom
  }
  // drawGrid([...grid], shape, startX, startY);

  let inMove = 0;
  do {
    const moveIndex = movesCopy.length - moves.length;

    let directive = moves.pop();
    if (!directive) {
      moves = [...movesCopy];
      directive = moves.pop();
      const key = `${inMove}-${shape.join(".")}`;
      if (map[key]) {
        // if (map[key].shapeCount % 10 === 0) {
        // }
      }
      // console.log({ inMove, shape }, grid.length);
    }

    inMove++;

    // console.log({ shape, startX, startY, grid });
    const canMoveLeftRight = move(shape, startX, startY, directive, grid);
    if (canMoveLeftRight) {
      startX = canMoveLeftRight[0];
      startY = canMoveLeftRight[1];
    }

    // drawGrid([...grid], shape, startX, startY);

    // Move down
    // console.log({ directive, startX, startY });
    canMove = move(shape, startX, startY, "v", grid);
    // console.log({ canMove });
    if (canMove) {
      startY = canMove[1];
    } else {
      for (let row = 0; row < shape.length; ++row) {
        const shiftedRow = shape[row] >> startX;
        grid[startY + row] |= shiftedRow;
      }
      // highestRock = startY;
      // console.log({ startY, length: shape.length, highestRock });
      if (!moveIndex) {
        console.log("xxx", moveIndex);
      }
    }

    // drawGrid([...grid], shape, startX, startY);
  } while (canMove);

  // console.log(grid.findIndex((x) => x === 0b11111111));

  // console.log();
  // console.log("--------");
  // console.log();
  if (i && i % 1000 === 0) {
    // console.log(
    //   "xxx",
    //   shape,
    //   moves.length,
    //   grid.findIndex((x) => x === 0b11111111)
    // );
    actualResults[i] = grid.length - grid.findIndex((x) => x > 1) - 1;
  }
  grid = grid.filter((x) => x !== 1);
  lengths.push(grid.length - 1 - lastLength);
  lastLength = grid.length - 1;
}

const str = lengths.slice(0, 5000).join(",");
// console.log(str);
let matchingSub = "";
// Find the first repeat of 1000

let priorSubstr = "";
//Math.floor(str.length / 2)
for (let i = 3000; i < 5000; i++) {
  const substr = str.substring(str.length - i, str.length);
  const index = str.indexOf(substr);
  const indexNext = str.indexOf(substr, index + 1);
  // console.log({ index, i, indexNext, length: substr.length, substr });
  if (index + substr.length + 1 === indexNext) {
    console.log("found it");
    priorSubstr = substr;
  }
}
// process.exit(0);

matchingSub = priorSubstr;

// for (let i = 0; i < str.length && i < 25000; ++i) {
//   const start = str.length - 1 - i;
//   const sub = str.substring(start, str.length);
//   const repeatIndex = str.indexOf(sub);
//   if (
//     repeatIndex > 0 &&
//     start !== repeatIndex &&
//     str.indexOf(sub, repeatIndex + 1) > 0
//   ) {
//     matchingSub = sub;
//   }
// }
// console.log(matchingSub.length, str.length, str.indexOf(matchingSub));
// process.exit(0);

if (matchingSub.startsWith(",")) {
  matchingSub = matchingSub.substring(1);
}

// console.log(
//   str.indexOf(matchingSub),
//   str.indexOf(matchingSub, matchingSub.length + 40)
// );
// process.exit(0);

const actualResult = grid.length - grid.findIndex((x) => x > 1) - 1;
if (matchingSub) {
  let indexStart = str.indexOf(matchingSub);
  // do {
  const repeatIndex = indexStart;
  const matchingSubShapes = matchingSub.split(",");
  const shapeCount = matchingSubShapes.length;
  const priorStr = str.substring(0, repeatIndex - 1);
  const priorShapeCount = priorStr.split(",").length;
  console.log(matchingSubShapes.length, { shapeCount });
  // process.exit(0);
  if (true || matchingSub.length + priorStr.length + 1 === str.length) {
    // console.log(
    //   repeatIndex,
    //   str.length,
    //   matchingSub.length,
    //   priorStr.length,
    //   shapeCount,
    //   priorShapeCount.length,
    //   str.split(",").length
    // );
    let i;
    let repeatHeight = matchingSub
      .split(",")
      .reduce((sum, delta) => sum + parseFloat(delta), 0);
    // console.log({ matchingSub: matchingSub.split(","), repeatHeight });
    //1000000000000
    for (const test of [
      5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000,
      1000000000000,
    ]) {
      let height = priorStr
        .split(",")
        .reduce((sum, delta) => sum + parseFloat(delta), 0);
      // const test = 14000;
      let shapeCountCounted = priorShapeCount;
      let lastI = 0;
      let remadeSet = priorStr.split(",");
      for (i = priorShapeCount; i < test; i += shapeCount) {
        height += repeatHeight;
        shapeCountCounted += shapeCount;
        lastI = i;
        // remadeSet.push(...matchingSubShapes);
      }
      const delta = i - test;
      console.log({ test, i, delta, shapeCountCounted });
      if (delta > 0) {
        const removeDeltas = matchingSubShapes.slice(
          matchingSubShapes.length - delta,
          matchingSubShapes.length
        );
        console.log(removeDeltas);
        // remadeSet.splice(-delta, delta);
        // console.log({ removeDeltas });
        const removeSum = removeDeltas.reduce(
          (sum, d) => sum + parseFloat(d),
          0
        );
        // let testActual = 1514285714288;
        // 1514515050172
        height -= removeSum;
      }
      console.log(
        "actual",
        height,
        str
          .split(",")
          .slice(0, test)
          .reduce((sum, delta) => sum + parseFloat(delta), 0),
        remadeSet.reduce((sum, delta) => sum + parseFloat(delta), 0),
        actualResults[test]
      );
      // console.log(str.split(",").slice(0, test).join(","));
      // console.log(remadeSet.join(","));
      // console.log(str.split(",").slice(0, test).length);
      // console.log(remadeSet.length);
      // process.exit(0);
    }
    // break;
  }
  //   indexStart = repeatIndex + 1;
  // } while (true);
}

console.log({ actualResults });

// // 1000000000000
// console.log(moves.length, grid.length - grid.findIndex((x) => x > 1) - 1);
// // console.log(moveOutHeights);

// for (const { i, height } of moveOutHeights) {
//   const match = moveOutHeights.find(
//     (x) => x.i !== i && x.i % i == 0 && (x.i / i) * height === x.height
//   );
//   if (match) {
//     console.log("xxx", { i, height, match });
//   }
// }
// console.log(1000000000000 / 100000);
