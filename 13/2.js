const fs = require("fs");

const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const cells = contents.split("\n");

function compareData(data1, data2, firstRun = false) {
  for (let x = 0; x < data1.length; ++x) {
    const left = data1[x];
    const right = data2[x];
    const isArrayLeft = Array.isArray(left);
    const isArrayRight = Array.isArray(right);

    // if (left === undefined) return true;
    if (right === undefined) {
      console.log("d", { left, right, data2, x });
      return false;
    }

    console.log("compare", { left, right });

    if (isArrayLeft === isArrayRight) {
      if (!isArrayLeft) {
        if (left < right) return true;
        if (right < left) {
          console.log("a", { left, right });
          return false;
        }
      } else {
        const result = compareData(left, right);
        if (result !== undefined) {
          console.log("b", { left, right });
          return result;
        }
      }
    } else {
      const result = compareData(
        isArrayLeft ? left : [left],
        isArrayLeft ? [right] : right
      );
      if (result !== undefined) {
        console.log("c");
        return result;
      }
    }
  }
  console.log({ data1, data2 });
  if (data1.length < data2.length) return true;
  return undefined;
}

const matches = [];
const matches2 = [];
const start = 0;
const packets = [];
for (let i = start * 3; i < cells.length; i += 3) {
  const [row1, row2] = cells.slice(i, i + 2);
  const data1 = JSON.parse(row1);
  const data2 = JSON.parse(row2);
  packets.push(data1);
  packets.push(data2);

  const b = compareData(data1, data2);
  if (b) {
    matches2.push(i / 3 + 1);
  }
  // break;
}

const divider1 = [[2]];
const divider2 = [[6]];

packets.push(divider1);
packets.push(divider2);

const sorted = packets.sort((data1, data2) =>
  compareData(data1, data2) ? -1 : 1
);

console.log(
  (1 + sorted.findIndex((x) => x === divider1)) *
    (1 + sorted.findIndex((x) => x === divider2))
);
