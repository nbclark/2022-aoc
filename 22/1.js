const fs = require("fs");

const grid = [];
const path = [];
let isGrid = true;
let facing = "R";
let lines = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row, index) => {
    if (!row) {
      isGrid = false;
    }
    if (isGrid) grid.push(row.split("").map((x) => x.trim()));
    else if (row) {
      const match = row.matchAll(/(\d+|[RL])/g);
      let amount;
      for (const foo of match) {
        if (amount === undefined) {
          amount = true;
          path.push({ type: "amount", value: parseFloat(foo[0]) });
        } else {
          path.push({ type: "dir", value: foo[0] });
          amount = undefined;
        }
      }
    }
  });

const openSquares = [".", "v", "^", "<", ">"];
function move(pos, facing, amount) {
  const returnPos = { ...pos };
  if (facing === "R") {
    for (let i = 0; i < amount; ++i) {
      const nextValue = grid[returnPos.y][returnPos.x + 1];
      console.log({ nextValue }, returnPos.y, returnPos.x + 1);
      if (nextValue === "#") return returnPos;
      if (openSquares.indexOf(nextValue) >= 0) {
        returnPos.x++;
        continue;
      }
      // Wrap around
      let x = 0;
      while (!grid[returnPos.y][x]) x++;
      if (grid[returnPos.y][x] !== "#") returnPos.x = x;
      else break;
    }
  } else if (facing === "L") {
    for (let i = 0; i < amount; ++i) {
      const nextValue = grid[returnPos.y][returnPos.x - 1];
      if (nextValue === "#") return returnPos;
      if (openSquares.indexOf(nextValue) >= 0) {
        returnPos.x--;
        continue;
      }
      // Wrap around
      let x = grid[returnPos.y].length - 1;
      while (!grid[returnPos.y][x]) x--;
      if (grid[returnPos.y][x] !== "#") returnPos.x = x;
      else break;
    }
  } else if (facing === "U") {
    for (let i = 0; i < amount; ++i) {
      const nextRow = grid[returnPos.y - 1];
      if (nextRow) {
        const nextValue = nextRow[returnPos.x];
        if (nextValue === "#") return returnPos;
        if (openSquares.indexOf(nextValue) >= 0) {
          returnPos.y--;
          continue;
        }
      }
      // Wrap around
      let y = grid.length - 1;
      while (!grid[y][returnPos.x]) y--;
      if (grid[y][returnPos.x] !== "#") returnPos.y = y;
      else break;
    }
  } else if (facing === "D") {
    for (let i = 0; i < amount; ++i) {
      const nextRow = grid[returnPos.y + 1];
      // console.log({ nextRow });
      if (nextRow) {
        const nextValue = nextRow[returnPos.x];
        // console.log({ nextValue });
        if (nextValue === "#") return returnPos;
        if (openSquares.indexOf(nextValue) >= 0) {
          returnPos.y++;
          continue;
        }
      }
      // Wrap around
      // console.log({ x: returnPos.x, y: returnPos.y });
      let y = 0;
      while (!grid[y][returnPos.x]) {
        y++;
        // console.log({ y }, grid[y][returnPos.x]);
      }
      // console.log(
      //   "xxx",
      //   { x: returnPos.x, y },
      //   grid[y][returnPos.x],
      //   "=",
      //   !grid[y][returnPos.x]
      // );
      if (grid[y][returnPos.x] !== "#") returnPos.y = y;
      else break;
    }
  }
  return returnPos;
}

function turn(facing, dir) {
  switch (facing) {
    case "U":
      return dir === "R" ? "R" : "L";
    case "D":
      return dir === "R" ? "L" : "R";
    case "L":
      return dir === "R" ? "U" : "D";
    case "R":
      return dir === "R" ? "D" : "U";
  }
}

let startPos = { x: grid[0].indexOf("."), y: 0 };
// console.log(grid, path, startPos);

for (const instr of path) {
  if (instr.type === "dir") {
    console.log("turn", facing, instr.value);
    facing = turn(facing, instr.value);
  } else {
    console.log("move", facing, instr.value);
    startPos = move(startPos, facing, instr.value);
  }
  console.log({ facing, startPos });
}

function getDirectionScore(facing) {
  switch (facing) {
    case "U":
      return 3;
    case "D":
      return 1;
    case "L":
      return 2;
    case "R":
      return 0;
  }
}
console.log(
  1000 * (startPos.y + 1) + 4 * (startPos.x + 1) + getDirectionScore(facing)
);
