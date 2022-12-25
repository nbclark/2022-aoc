const fs = require("fs");

const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

const time = 26;
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
  for (const row2 of row.valves) {
    paths[`${row.name}->${row2.name}`] = 1;
    paths[`${row2.name}->${row.name}`] = 1;
  }
}

const largeNumber = 9999999;
for (const middleNode of rows) {
  for (const startNode of rows) {
    for (const endNode of rows) {
      paths[`${startNode.name}->${endNode.name}`] = Math.min(
        paths[`${startNode.name}->${endNode.name}`] || largeNumber,
        (paths[`${startNode.name}->${middleNode.name}`] || largeNumber) +
          (paths[`${middleNode.name}->${endNode.name}`] || largeNumber)
      );
    }
  }
}

let maxScore = 0;
const queue = [{ name: "AA", openNodes: [], time, score: 0 }];
const results = {};
while (queue.length) {
  const node = queue.pop();
  if (node.score > maxScore) {
    maxScore = Math.max(node.score, maxScore);
  }
  const key = node.openNodes.sort((a1, a2) => a1.localeCompare(a2)).join(",");
  if (!results[key] || node.score > results[key].score) {
    results[key] = node;
  }

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

function intersect(a1, a2) {
  for (const key of a1) {
    if (a2.indexOf(key) >= 0) {
      return true;
    }
  }
  return false;
}

console.log(Object.keys(results).length);

let maxScoreCombined = 0;
for (const result1 of Object.keys(results)) {
  for (const result2 of Object.keys(results)) {
    if (!intersect(result1.split(","), result2.split(","))) {
      if (results[result1].score + results[result2].score > maxScoreCombined) {
        maxScoreCombined = Math.max(
          maxScoreCombined,
          results[result1].score + results[result2].score
        );
      }
    }
  }
}

console.log({ maxScoreCombined });
