const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const cells = contents.split("\n").map((x) => x.split("").map(parseFloat));
const copy = JSON.parse(JSON.stringify(cells));

for (let x = 0; x < cells.length; ++x) {
  for (let y = 0; y < cells[x].length; ++y) {
    copy[y][x] = 0;
  }
}

let count = 0;
for (const dir of [1, -1]) {
  for (
    let y = dir > 0 ? 0 : cells.length - 1;
    dir > 0 ? y < cells.length : y >= 0;
    y += dir
  ) {
    let prevRowMax = -1;
    console.log({ y, dir, prevRowMax });
    for (
      let x = dir > 0 ? 0 : cells.length - 1;
      dir > 0 ? x < cells.length : x >= 0;
      x += dir
    ) {
      console.log(cells[y][x], prevRowMax);
      if (cells[y][x] > prevRowMax) {
        prevRowMax = Math.max(prevRowMax, cells[y][x]);
        if (!copy[y][x]) {
          count++;
          copy[y][x] = 1;
        }
      }
    }
  }
}

for (const dir of [1, -1]) {
  for (
    let y = dir > 0 ? 0 : cells.length - 1;
    dir > 0 ? y < cells.length : y >= 0;
    y += dir
  ) {
    let prevRowMax = -1;
    console.log({ y, dir, prevRowMax });
    for (
      let x = dir > 0 ? 0 : cells.length - 1;
      dir > 0 ? x < cells.length : x >= 0;
      x += dir
    ) {
      if (cells[x][y] > prevRowMax) {
        prevRowMax = Math.max(prevRowMax, cells[x][y]);
        if (!copy[x][y]) {
          count++;
          copy[x][y] = 1;
        }
      }
    }
  }
}

console.log({ copy, count });
