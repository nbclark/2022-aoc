const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

const priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

const lines = contents.split("\n").map((x) => x.split(""));

const groups = [];

for (let i = 0; i < lines.length; i += 3) {
  groups.push(lines.slice(i, i + 3));
}

const data = groups.map(([a, b, c]) => {
  const inCommonAB = a.filter((xa) => b.find((xb) => xb === xa));
  const inCommonAC = a.filter((xa) => c.find((xc) => xc === xa));
  const match = inCommonAB.find((x) => inCommonAC.find((y) => x === y));
  // const match = left.find((char) => right.find((rChar) => rChar === char));
  console.log({ match, match }, priorities.indexOf(match) + 1);
  return { match, score: priorities.indexOf(match) + 1 };
});

console.log({ data });
console.log(data.reduce((sum, x) => sum + x.score, 0));
