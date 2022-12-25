const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const cells = contents.split("\n").map((x) => x.split("").map(parseFloat));
const copy = JSON.parse(JSON.stringify(cells));

let iterations = 0;
Array.prototype.findUntil = function (func) {
  for (let i = 0; i < this.length; ++i) {
    iterations++;
    if (func(this[i])) return i;
  }
  return this.length - 1;
};

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
    let prevRowMax = [];
    for (
      let x = dir > 0 ? 0 : cells.length - 1;
      dir > 0 ? x < cells.length : x >= 0;
      x += dir
    ) {
      const find = Math.max(
        0,
        prevRowMax
          .slice()
          .reverse()
          .findUntil((val) => cells[y][x] <= val) + 1
      );
      prevRowMax.push(cells[y][x]);
      if (!copy[y][x]) {
        copy[y][x] = 1;
      }
      copy[y][x] *= find;
      // if (!copy[y][x]) {
      //   copy[y][x] = "";
      // }
      // copy[y][x] += find + ",";
      // console.log(count, copy[y][x], copy);
      count = Math.max(count, copy[y][x]);
    }
  }
}

for (const dir of [1, -1]) {
  for (
    let y = dir > 0 ? 0 : cells.length - 1;
    dir > 0 ? y < cells.length : y >= 0;
    y += dir
  ) {
    let prevRowMax = [];
    for (
      let x = dir > 0 ? 0 : cells.length - 1;
      dir > 0 ? x < cells.length : x >= 0;
      x += dir
    ) {
      const find = Math.max(
        0,
        prevRowMax
          .slice()
          .reverse()
          .findUntil((val) => cells[x][y] <= val) + 1
      );
      if (x === 2 && y === 2) {
        console.log(cells[x][y], { find, prevRowMax });
      }
      prevRowMax.push(cells[x][y]);
      if (!copy[x][y]) {
        copy[y][x] = 1;
      }
      copy[x][y] *= find;
      // if (!copy[x][y]) {
      //   copy[x][y] = "";
      // }
      // copy[x][y] += find + ",";
      // console.log(count, copy[x][y], copy);
      count = Math.max(count, copy[x][y]);
    }
  }
}

count = 0;
for (y = 0; y < cells.length; ++y) {
  for (x = 0; x < cells[y].length; ++x) {
    count = Math.max(copy[x][y], count);
  }
}

console.log({ copy, count, iterations }, cells.length * cells[0].length);
