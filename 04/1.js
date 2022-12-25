const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

const data = contents
  .split("\n")
  .map((x) => x.split(",").map((y) => y.split("-").map(parseFloat)));
console.log(data);

console.log(
  data.filter((d) => {
    if (d[0][0] <= d[1][0] && d[0][1] >= d[1][1]) return true;
    if (d[1][0] <= d[0][0] && d[1][1] >= d[0][1]) return true;
    return false;
  }).length
);
