const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

let elf = {
  index: 0,
  calories: [],
  sum: 0,
};
console.log(contents);
const elves = [elf];
for (const line of contents.split("\n")) {
  if (!line) {
    elves.push(elf);
    elf = { index: elves.length, calories: [] };
  } else {
    elf.calories.push(parseInt(line, 10));
    elf.sum = elf.calories.reduce((sum, value) => sum + value, 0);
  }
}
const sortedElves = elves.sort((e1, e2) => e2.sum - e1.sum);
console.log(
  { sortedElves },
  sortedElves.slice(0, 3).reduce((sum, elf) => sum + elf.sum, 0)
);
