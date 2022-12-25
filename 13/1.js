const fs = require("fs");

const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const cells = contents.split("\n");

function compareData(data1, data2, firstRun = false) {
  let matches = true;
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
const start = 0;
for (let i = start * 3; i < cells.length; i += 3) {
  const [row1, row2] = cells.slice(i, i + 2);
  const data1 = JSON.parse(row1);
  const data2 = JSON.parse(row2);

  if (compareData(data1, data2)) {
    matches.push(i / 3 + 1);
  }
}

console.log(
  // matches,
  matches.reduce((sum, value) => sum + value, 0)
);
