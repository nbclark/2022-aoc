const fs = require("fs");

const blizCells = ["<", ">", "v", "^"];
const directions = {
  "^": { y: -1, x: 0 },
  v: { y: 1, x: 0 },
  ">": { y: 0, x: 1 },
  "<": { y: 0, x: -1 },
  wait: { y: 0, x: 0, wait: true },
};
const walls = {};
const blizzards = [];
const blizzardConfigs = [];
let grid = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row, index) => {
    const cells = row.split("");
    for (let i = 0; i < cells.length; ++i) {
      if (blizCells.indexOf(cells[i]) >= 0) {
        blizzards.push({
          index: blizzards.length,
          x: i,
          y: index,
          dir: cells[i],
        });
        cells[i] = ".";
      } else if (cells[i] === "#") {
        walls[`${i}_${index}`] = 1;
      }
    }
    return cells;
  });

const height = grid.length - 2;
const width = grid[0].length - 2;

function draw(blizzards) {
  const gridCopy = JSON.parse(JSON.stringify(grid));
  for (const b of blizzards) {
    if (gridCopy[b.y][b.x] === ".") {
      gridCopy[b.y][b.x] = b.dir;
    } else if (gridCopy[b.y][b.x] !== "#") {
      if (blizCells.indexOf(gridCopy[b.y][b.x]) >= 0) {
        gridCopy[b.y][b.x] = 2;
      } else {
        gridCopy[b.y][b.x]++;
      }
    }
  }
  console.log(gridCopy.map((x) => x.join("")).join("\n"));
}

function advance(bs, cellX, cellY) {
  const bsCopy = [...bs];
  const bsMap = { ...walls };
  for (let i = 0; i < bsCopy.length; ++i) {
    const b = { ...bsCopy[i] };
    const newX = ((b.x + directions[b.dir].x - 1 + width) % width) + 1;
    const newY = ((b.y + directions[b.dir].y - 1 + height) % height) + 1;
    b.x = newX;
    b.y = newY;
    bsMap[`${b.x}_${b.y}`] = 1;
    bsCopy[i] = b;
  }
  return { bs: bsCopy, bsMap };
}

(function () {
  let b = blizzards;
  blizzardConfigs.push({ bs: b });
  for (let i = 0; i < 10000; ++i) {
    const { bs, bsMap } = advance(b);
    b = bs;
    blizzardConfigs.push({ bs, bsMap });
  }
})();

let queue = [{ x: 1, y: 0, bs: blizzards, count: 1 }];
const end = { x: grid[0].length - 2, y: grid.length - 1 };
while (queue.length) {
  const nextQueue = [];
  const seen = {};
  for (const cell of queue) {
    const { bs, bsMap } = blizzardConfigs[cell.count];

    if (cell.x === end.x && cell.y === end.y) {
      console.log("done", cell);
      process.exit(0);
    }
    // if (cell.count === 20) break;

    // check each direction of move
    let advanced = 0;
    let log = false;
    if (cell.count === 13 && cell.x === 3 && cell.y === 3) {
      // log = true;
    }
    for (const dir of Object.keys(directions)) {
      if (log) {
        console.log(cell.x, cell.y, dir, cell.count);
      }
      const newX = cell.x + directions[dir].x;
      const newY = cell.y + directions[dir].y;
      const key = `${newX}_${newY}`;
      const cacheKey1 = `${newX}_${newY}`;
      if (bsMap[key] || newX < 0 || newY < 0) {
        if (dir === "v") {
          if (log) {
            console.log("skip", dir, bsMap, bs);
            // draw(bs);
          }
        }
        continue;
      }
      if (seen[cacheKey1]) {
        if (log) {
          console.log("seen", dir, directions[dir]);
        }
        continue;
      }
      if (log) {
        console.log({ dir, newX, newY });
        console.log("push", { x: newX, y: newY, count: cell.count + 1 });
        console.log("add");
      }
      seen[cacheKey1] = 1;
      nextQueue.push({ x: newX, y: newY, count: cell.count + 1 });
      advanced++;
    }
  }
  queue = nextQueue;
}

// Advance the storm and keep track of all connected cells
