const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const letters = contents.split("");

for (let i = 0; i < letters.length; ++i) {
  const arr = letters.slice(i, i + 4).sort();
  let success = true;
  for (let j = 0; j < arr.length - 1; ++j) {
    if (arr[j] === arr[j + 1]) {
      success = false;
      break;
    }
  }
  if (success) {
    console.log(i + 4);
    break;
  }
}
