const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const cells = contents.split("\n").map((x) => x.split(""));
const steps = [];

const start = { x: 0, y: 0 };
const end = { x: 0, y: 0 };
for (let y = 0; y < cells.length; ++y) {
  steps[y] = [];
  for (let x = 0; x < cells[y].length; ++x) {
    steps[y][x] = Number.MAX_VALUE;
    const cell = cells[y][x];
    if (cell === "S") {
      start.y = y;
      start.x = x;
      cells[y][x] = "a";
      steps[y][x] = 0;
    } else if (cell === "E") {
      end.y = y;
      end.x = x;
      cells[y][x] = "z";
    }
  }
}

const seen = {};

const queue = [{ cell: end, distance: 0 }];

function canStep(from, { y, x }) {
  const fromValue = cells[from.y][from.x].charCodeAt(0);
  const to = cells[y][x].charCodeAt(0);
  const distance = to - fromValue;
  if (distance < -1) return false;
  return true;
}

while (queue.length) {
  const [{ cell, distance }] = queue.splice(0, 1);
  const { x, y } = cell;
  if (cells[y][x] === "a") {
    console.log({ distance });
    break;
  }
  seen[`${y},${x}`] = distance;

  if (x > 0) {
    if (
      undefined === seen[`${y},${x - 1}`] &&
      canStep({ x, y }, { y, x: x - 1 })
    ) {
      seen[`${y},${x - 1}`] = distance + 1;
      queue.push({ cell: { y, x: x - 1 }, distance: distance + 1 });
    }
  }
  if (x < cells[y].length - 1) {
    if (
      undefined === seen[`${y},${x + 1}`] &&
      canStep({ x, y }, { y, x: x + 1 })
    ) {
      seen[`${y},${x + 1}`] = distance + 1;
      queue.push({ cell: { y, x: x + 1 }, distance: distance + 1 });
    }
  }
  if (y > 0) {
    if (
      undefined === seen[`${y - 1},${x}`] &&
      canStep({ x, y }, { y: y - 1, x })
    ) {
      seen[`${y - 1},${x}`] = distance + 1;
      queue.push({ cell: { y: y - 1, x }, distance: distance + 1 });
    }
  }
  if (y < cells.length - 1) {
    if (
      undefined === seen[`${y + 1},${x}`] &&
      canStep({ x, y }, { y: y + 1, x })
    ) {
      seen[`${y + 1},${x}`] = distance + 1;
      queue.push({ cell: { y: y + 1, x }, distance: distance + 1 });
    }
  }
}

seen[`${end.y},${end.x}`] = "END";

// function recurse(y, x, distance = 0, priorCell = null) {
//   if (y === 4 && x === 5) {
//     // console.log(steps[y][x], distance, priorCell, cells[y][x]);
//     // process.exit(0);
//   }
//   if (steps[y][x] < distance) return;
//   // if (path.find((p) => p.y === y && p.x === x)) return;
//   if (priorCell) {
//     const from = priorCell.charCodeAt(0);
//     const to = cells[y][x].charCodeAt(0);
//     const distance = Math.abs(from - to);
//     if (distance > 1) return;
//   }
//   if (y === 4 && x === 5) {
//     // console.log(steps[y][x], distance, priorCell, cells[y][x]);
//     // process.exit(0);
//   }
//   // console.log({ y, x, path });
//   if (y === end.y && x === end.x) {
//     console.log("done", distance);
//     return;
//   }
//   steps[y][x] = distance;
//   // Up
//   // Down
//   // Left
//   // Right
//   if (y > 0) {
//     recurse(y - 1, x, distance + 1, cells[y][x]);
//   }
//   if (y < cells.length - 1) {
//     recurse(y + 1, x, distance + 1, cells[y][x]);
//   }
//   if (x > 0) {
//     recurse(y, x - 1, distance + 1, cells[y][x]);
//   }
//   if (x < cells[y].length - 1) {
//     recurse(y, x + 1, distance + 1, cells[y][x]);
//   }
// }

// recurse(start.y, start.x);

// console.log(cells.map((x) => x.join()).join("\n"));
// console.log(steps.map((x) => x.join()).join("\n"));

// console.log(JSON.stringify(seen, 2, 2), end);
console.log(
  cells
    .map((y, yIndex) =>
      y
        .map(
          (x, xIndex) =>
            `"${cells[yIndex][xIndex].charCodeAt(0) - "a".charCodeAt(0)} - ${
              seen[`${yIndex},${xIndex}`]
            }"`
        )
        .join(",")
    )
    .join("\n")
);
// console.log({ start, end });
