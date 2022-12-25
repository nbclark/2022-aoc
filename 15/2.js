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

// const countingRow = 2000000;
const endCount = 4000000;
for (let countingRow = 0; countingRow <= endCount; ++countingRow) {
  // const countingRow = 10;
  const ranges = [];
  for (const row of rows) {
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
  }

  function contains(r1, r2) {
    if (r1.from <= r2.from && r1.to >= r2.to) {
      return "contains";
    }
    if (r1.from <= r2.from && r1.to >= r2.from) {
      return "left-overlap";
    }
    if (r1.to === r2.from - 1) {
      return "side-by-side";
    }
    if (r2.from < r1.from && r2.to > r1.from) {
      return "right-overlap";
    }
    return false;
  }

  ranges.sort((r1, r2) => r1.from - r2.from);

  let filteredRanges = [...ranges.map((r) => ({ from: r.from, to: r.to }))];
  let hasChanges = false;
  do {
    hasChanges = false;
    const newRanges = [...filteredRanges];
    for (let i = 0; i < filteredRanges.length - 1; ++i) {
      const r1 = filteredRanges[i];
      const r2 = filteredRanges[i + 1];

      // console.log(r1, r2);
      const result = contains(r1, r2);
      if (result === "left-overlap") {
        // console.log(r1, r2);
        newRanges.push({ from: r1.from, to: r2.to });
        newRanges[i] = null;
        newRanges[i + 1] = null;
        hasChanges = true;
        break;
      } else if (result === "side-by-side") {
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
  } while (hasChanges);

  let sum = 0;
  const beaconsOnRow = new Set(
    rows.filter((x) => x.beaconY === countingRow).map((x) => x.beaconX)
  );

  for (let i = 0; i < filteredRanges.length; ++i) {
    const amount = filteredRanges[i].to - filteredRanges[i].from + 1;
    sum += amount;
  }

  // console.log(sum - beaconsOnRow.size);
  if (filteredRanges.length > 1) {
    console.log(
      countingRow,
      filteredRanges[0].to + 1,
      4000000 * (filteredRanges[0].to + 1) + countingRow,
      filteredRanges
    );
  }
}

// for (let y = 0; y <= 4000000; ++y) {
//   for (let x = 0; x <= 4000000; ++x) {
//     //
//   }
//   console.log(y);
// }
console.log("done");
