const fs = require("fs");

const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

const time = 30;
const timeToOpen = 1;
const timeToMove = 1;
const rows = contents.split("\n").map((a) => {
  const [name, flowRate, valves] = a
    .match("Valve (.+?) has flow rate=(.+?); .+? to .+? (.+?)$")
    .slice(1);
  return {
    name,
    flowRate: parseFloat(flowRate),
    valves: valves.split(", "),
    open: false,
  };
});

const map = {};
for (const row of rows) {
  map[row.name] = row;
}

const paths = {};
for (const row of rows) {
  row.valves = row.valves.map((x) => map[x]);
  // paths[`${row.name}->${row.name}`] = 0;
  for (const row2 of row.valves) {
    paths[`${row.name}->${row2.name}`] = 1;
    paths[`${row2.name}->${row.name}`] = 1;
  }
}

for (const middleNode of rows) {
  for (const startNode of rows) {
    for (const endNode of rows) {
      paths[`${startNode.name}->${endNode.name}`] = Math.min(
        paths[`${startNode.name}->${endNode.name}`] ?? 9999,
        (paths[`${startNode.name}->${middleNode.name}`] ?? 9999) +
          (paths[`${middleNode.name}->${endNode.name}`] ?? 9999)
      );
    }
  }
}

let maxScore = 0;
const queue = [{ name: "AA", openNodes: [], time, score: 0 }];
while (queue.length) {
  const node = queue.pop();
  if (node.score > maxScore) {
    maxScore = Math.max(node.score, maxScore);
    console.log({ node });
  }
  if (node.time === 0) break;

  const remainingNodes = rows.filter(
    (r) => r.flowRate && node.openNodes.indexOf(r.name) < 0
  );

  for (const rNode of remainingNodes) {
    const timeToWalk = paths[`${node.name}->${rNode.name}`];
    const remainingTime = node.time - timeToWalk - 1;
    if (remainingTime > 0) {
      queue.push({
        name: rNode.name,
        time: remainingTime,
        openNodes: [...node.openNodes, rNode.name],
        score: node.score + remainingTime * rNode.flowRate,
      });
    }
  }
}

console.log({ maxScore });

const rowsWithFlow = rows.filter((x) => x.flowRate);

// const seen = {};

// const maxNodeTimePair = {};

// let maxScore = 0;
// let maxScorePath = "";

// function recurse(
//   node,
//   otherTime = 0,
//   score = 0,
//   path = node.name,
//   nodesSinceAdding = [],
//   openNodes = []
// ) {
//   const pair = `${node.name}-${time - otherTime}`;
//   if (!maxNodeTimePair[pair]) maxNodeTimePair[pair] = score;

//   for (let i = time - otherTime; i < time; i++) {
//     // console.log(`${node.name}-${i}`);
//     if (score < maxNodeTimePair[`${node.name}-${i}`]) {
//       // console.log("cant be");
//       return;
//     }
//   }
//   if (nodesSinceAdding.indexOf(node.name) >= 0) {
//     return;
//   }
//   if (seen[path]) return;

//   const remainingRows = rows.filter((r) => openNodes.indexOf(r.name) < 0);
//   const maxRemaining = rows
//     .filter((r) => openNodes.indexOf(r.name) < 0)
//     .reduce((sum, r) => sum + r.flowRate, 0);

//   // if (!maxRemaining) console.log(remainingRows);

//   if (score + maxRemaining * (time - otherTime) < maxScore) return;

//   seen[path] = 1;
//   if (score > maxScore) {
//     console.log(maxScore);
//     maxScore = score;
//     maxScorePath = path;
//   }
//   if (otherTime >= 30) {
//     return;
//   }
//   const timeRemaining = time - otherTime;
//   // console.log({ timeRemaining, node, otherTime, path });
//   let didOpen = false;
//   const nodeIsOpen = openNodes.indexOf(node.name) >= 0;
//   const openOptions = nodeIsOpen || !node.flowRate ? [false] : [false, true];

//   for (const willOpen of openOptions) {
//     // console.log({ nodeIsOpen });
//     if (node.flowRate && !nodeIsOpen && willOpen) {
//       node.open = true;
//       otherTime++;
//       score += node.flowRate * (timeRemaining - 1);
//       didOpen = true;
//     }
//     for (const valve of node.valves) {
//       recurse(
//         valve,
//         otherTime + 1,
//         score,
//         `${path}->${valve.name}(${didOpen})`,
//         didOpen ? [] : [...nodesSinceAdding, node.name],
//         didOpen ? [...openNodes, node.name] : openNodes
//       );
//     }
//   }
// }

// const start = rows[0];
// recurse(start);
// console.log({ maxScorePath, maxScore });

// AA->DD->CC->BB->AA->II->JJ->II->AA->DD->EE->FF->GG->HH->GG->FF->EE->DD->CC
// console.log(rows);
