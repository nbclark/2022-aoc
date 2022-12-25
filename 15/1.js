const fs = require("fs");

const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

let minX = Number.MAX_SAFE_INTEGER,
  minY = Number.MAX_SAFE_INTEGER,
  maxX = Number.MIN_SAFE_INTEGER,
  maxY = Number.MIN_SAFE_INTEGER;
const rows = contents.split("\n").map((a) => {
  const [sensorX, sensorY, beaconX, beaconY] = a
    .match("x=(.+?), y=(.+?):.+?x=(.+?), y=(.+?)$")
    .slice(1)
    .map(parseFloat);
  minX = Math.min(minX, sensorX, beaconX);
  minY = Math.min(minY, sensorY, beaconY);
  maxX = Math.max(maxX, sensorX, beaconX);
  maxY = Math.max(maxY, sensorY, beaconY);
  const distance = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
  return {
    sensorX,
    sensorY,
    beaconX,
    beaconY,
    distance,
  };
});

const map = [];
// for (let y = 0; y < maxY - minY; ++y) {
//   map.push([]);
//   for (let x = 0; x < maxX - minX; ++x) {
//     const hasBeacon = rows.find(
//       (r) => r.beaconX === x + minX && r.beaconY === y + minY
//     );
//     const hasSensor = rows.find(
//       (r) => r.sensorX === x + minX && r.sensorY === y + minY
//     );
//     if (hasBeacon) {
//       map[y][x] = "B";
//     } else if (hasSensor) {
//       map[y][x] = "S";
//     } else {
//       map[y][x] = ".";
//     }
//   }
// }
const grid = {};
const seen = {};
let count = 0;
let index = 3;
const countingRow = 2000000;
for (const row of rows) {
  seen[`{${row.beaconX},${row.beaconY}}`] = "B";
}
const ranges = [];
for (const row of rows) {
  // console.log({ row });
  grid[`{${row.sensorX},${row.sensorY}}`] = "S";
  grid[`{${row.beaconX},${row.beaconY}}`] = "B";
  let startDistance = row.distance;
  let startPos = null;
  const distFromTarget = Math.abs(row.sensorY - countingRow);
  if (row.sensorY <= countingRow) {
    if (row.sensorY + row.distance >= countingRow) {
      startDistance = row.distance - distFromTarget;
      // console.log("b", { row, startDistance });
      startPos = {
        x: row.sensorX,
        y: row.sensorY + distFromTarget,
        distFromTarget,
      };
    }
  } else if (row.sensorY > countingRow) {
    if (row.sensorY - row.distance <= countingRow) {
      startDistance = row.distance - distFromTarget;
      startPos = { x: row.sensorX, y: row.sensorY - distFromTarget };
      // console.log("a", { row, startDistance, startPos });
    }
  }
  if (startPos && startDistance > 0) {
    const add = startDistance;
    const hasBeacon = row.beaconY === countingRow;
    const beaconIsStart = row.beaconX === startPos.x - add;
    const beaconIsEnd = row.beaconX === startPos.x + add;
    ranges.push({
      startPos,
      from: startPos.x - add, // + (beaconIsStart ? 1 : 0),
      to: startPos.x + add, // - (beaconIsEnd ? 1 : 0),
      row,
      hasBeacon,
      beaconIsStart,
      beaconIsEnd,
      add,
    });
  }
  continue;
  console.log({ startDistance, startPos });
  let queue = [startPos];
  if (!startPos) continue;
  for (let i = row.distance - startDistance; i < row.distance; ++i) {
    for (const pos of queue.splice(0, queue.length)) {
      // console.log({ pos });
      // up, down, left, right
      for (const [x, y] of [
        [-1, 0],
        [1, 0],
        // [0, -1],
        // [0, 1],
      ]) {
        const coords = { x: pos.x + x, y: pos.y + y };
        console.log({ coords });
        if (!seen[`{${coords.x},${coords.y}}`]) {
          seen[`{${coords.x},${coords.y}}`] = "X";
          if (!grid[`{${coords.x},${coords.y}}`]) {
            grid[`{${coords.x},${coords.y}}`] = "X";
          }
          console.log(coords);
          if (coords.y === countingRow) {
            count++;
          }
          if (map[coords.y - minY] && coords.y === countingRow) {
            map[coords.y - minY][coords.x - minX] = "#";
          }
          queue.push(coords);
        } else {
          console.log("seen", { coords, x, y, startDistance, d: row.distance });
        }
        // if (
        //   coords.y === countingRow &&
        //   grid[`{${coords.x},${coords.y}}`] === "B"
        // ) {
        //   count++;
        // }
      }
    }
  }
}

function contains(r1, r2) {
  if (r1.from <= r2.from && r1.to >= r2.to) {
    return "contains";
  }
  if (r1.from <= r2.from && r1.to >= r2.from) {
    return "left-overlap";
  }
  if (r2.from < r1.from && r2.to > r1.from) {
    return "right-overlap";
  }
  return false;
}

ranges.sort((r1, r2) => r1.from - r2.from);

let filteredRanges = [...ranges.map((r) => ({ from: r.from, to: r.to }))];
console.log({ filteredRanges });
let hasChanges = false;
do {
  hasChanges = false;
  const newRanges = [...filteredRanges];
  for (let i = 0; i < filteredRanges.length - 1; ++i) {
    const r1 = filteredRanges[i];
    const r2 = filteredRanges[i + 1];

    // console.log(r1, r2);
    const result = contains(r1, r2);
    console.log({ result });
    if (result === "left-overlap") {
      // console.log(r1, r2);
      newRanges.push({ from: r1.from, to: r2.to });
      newRanges[i] = null;
      newRanges[i + 1] = null;
      hasChanges = true;
      break;
    } else if (result === "contains") {
      // newRanges.push(r1);
      newRanges[i + 1] = null;
      hasChanges = true;
      break;
    } else {
      // newRanges.push(r1);
    }
  }
  filteredRanges = newRanges
    .filter((x) => x)
    .sort((r1, r2) => r1.from - r2.from);
  console.log({ filteredRanges });
} while (hasChanges);
console.log({ filteredRanges });

let sum = 0;
const beaconsOnRow = new Set(
  rows.filter((x) => x.beaconY === countingRow).map((x) => x.beaconX)
);

for (let i = 0; i < filteredRanges.length; ++i) {
  const amount = filteredRanges[i].to - filteredRanges[i].from + 1;
  // const beaconsContained = beaconsOnRow.filter(
  //   (row) =>
  //     row.beaconX >= filteredRanges[i].from &&
  //     row.beaconX <= filteredRanges[i].to
  // );
  // console.log(beaconsContained);
  sum += amount;
}

console.log(sum - beaconsOnRow.size);

console.log(filteredRanges);
// const filteredRanges = ranges.filter(
//   (r) => !ranges.find((x) => r !== x && contains(r, x))
// );
// console.log(
//   filteredRanges.reduce((sum, range) => sum + (range.to - range.from), 0)
// );

// console.log(rows);

// console.log(map.map((x) => x.join("")).join("\n"), count);
