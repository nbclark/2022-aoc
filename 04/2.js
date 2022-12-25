const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

const data = contents
  .split("\n")
  .map((x) => x.split(",").map((y) => y.split("-").map(parseFloat)));
console.log(data);

console.log(
  data.filter(([[startA, endA], [startB, endB]]) => {
    if (startA <= startB) {
      return startB <= endA;
    }
    if (startB <= startA) {
      return startA <= endB;
    }
    return false;
  }).length
);
