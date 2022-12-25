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
let highestRock = 4;
for (let i = 0; i < 4; ++i) {
  grid.push(0b00000001);
}
// The bottom
grid.push(0b11111111);
for (let i = 0; i < 2022; ++i) {
  let canMove = true;
  const shape = shapes[i % 5];
  let startY = 0,
    startX = 2;

  highestRock = grid.findIndex((x) => x > 1);

  const highestRockShouldBe = shape.length + 3;
  // console.log({ highestRock, highestRockShouldBe });
  const padAmount = 3 - (highestRock - shape.length);
  // console.log({ padAmount, highestRock });

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

  do {
    let directive = moves.pop();
    // console.log({ directive });
    if (!directive) {
      moves = [...movesCopy];
      directive = moves.pop();
    }

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
    }

    // drawGrid([...grid], shape, startX, startY);
  } while (canMove);

  grid = grid.filter((x) => x !== 1);
  console.log(grid.findIndex((x) => x === 0b11111111));

  // console.log();
  // console.log("--------");
  // console.log();
}
console.log(moves.length, grid.length - grid.findIndex((x) => x > 1) - 1);
