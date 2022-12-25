const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

const priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

const data = contents
  .split("\n")
  .map((x) => x.split(""))
  .map((x) => {
    const left = x.slice(0, x.length / 2).sort();
    const right = x.slice(x.length / 2, x.length).sort();
    const match = left.find((char) => right.find((rChar) => rChar === char));
    console.log({ x, left, right, match }, priorities.indexOf(match) + 1);
    return { left, right, match, score: priorities.indexOf(match) + 1 };
  });

console.log(data.reduce((sum, x) => sum + x.score, 0));
