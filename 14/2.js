const fs = require("fs");

const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const values = contents.split("\n").map((a) =>
  a.split(" -> ").map((b) => {
    const [x, y] = b.split(",").map(parseFloat);
    return { x, y };
  })
);
const sand = { x: 500, y: 0 };
const sortedByX = values
  .reduce((cat, arr) => [...cat, ...arr], [])
  .sort((a1, a2) => a1.x - a2.x);
const sortedByY = values
  .reduce((cat, arr) => [...cat, ...arr], [])
  .sort((a1, a2) => a1.y - a2.y);
let xMin = Math.min(sand.x, sortedByX[0].x);
let xMax = Math.max(sand.x, sortedByX[sortedByX.length - 1].x);
const yMin = Math.min(sand.y, sortedByY[0].y);
const yMax = Math.max(sand.y, sortedByY[sortedByX.length - 1].y) + 2;

console.log({ values, xMin, xMax, yMin, yMax });

const grid = [];

for (let y = 0; y <= yMax - yMin; ++y) {
  const arr = [];
  grid.push(arr);
  for (let x = 0; x <= xMax - xMin; ++x) {
    arr.push(y === yMax - yMin ? "#" : ".");
  }
}

for (const row of values) {
  for (let i = 0; i < row.length - 1; ++i) {
    const start = row[i];
    const end = row[i + 1];

    const startX = Math.min(start.x, end.x) - xMin;
    const startY = Math.min(start.y, end.y) - yMin;
    const endX = Math.max(start.x, end.x) - xMin;
    const endY = Math.max(start.y, end.y) - yMin;

    for (let x = startX; x <= endX; ++x) {
      for (let y = startY; y <= endY; ++y) {
        grid[y][x] = "#";
      }
    }
  }
}

grid[sand.y - yMin][sand.x - xMin] = "+";
console.log(grid.map((x) => x.join("")).join("\n"));

function padGrid(grid, left = true) {
  for (let y = 0; y < grid.length; ++y) {
    const pad = y === grid.length - 1 ? "#" : ".";
    grid[y] = left ? [pad, ...grid[y]] : [...grid[y], pad];
  }
}

function checkCell(y, x) {
  const value = grid[y][x];
  if (value === ".") return true;
  if (value === undefined) throw new Error("out of bounds");
  return false;
}

let count = 0;
while (count++ < 100000) {
  try {
    // Move some sand
    let pos = { x: sand.x - xMin, y: sand.y - yMin };
    do {
      if (pos.x === 0) {
        pos.x++;
        xMin--;
        padGrid(grid);
      }
      if (pos.x === xMax - xMin - 1) {
        xMax++;
        padGrid(grid, false);
      }
      if (checkCell(pos.y + 1, pos.x)) {
        pos = { x: pos.x, y: pos.y + 1 };
      } else if (checkCell(pos.y + 1, pos.x - 1)) {
        pos = { x: pos.x - 1, y: pos.y + 1 };
      } else if (checkCell(pos.y + 1, pos.x + 1)) {
        pos = { x: pos.x + 1, y: pos.y + 1 };
      } else {
        if (grid[pos.y][pos.x] === "o") {
          throw new Error("done");
          break;
        }
        grid[pos.y][pos.x] = "o";
        break;
      }
    } while (true);
  } catch (e) {
    // console.log(e, count);
    break;
  }
}

// for (let i = 0; i < 10; ++i) {
//   padGrid(grid);
//   padGrid(grid, false);
// }

console.log(grid.map((x) => x.join("")).join("\n"), count - 1);
