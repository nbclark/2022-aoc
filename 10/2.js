const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const commands = contents.split("\n").map((x) => {
  const [arg, amount] = x.split(" ");
  return { arg, amount: parseFloat(amount) };
});

let x = 1;
let cycles = 0;
let xByCycle = [];
for (const command of commands) {
  switch (command.arg) {
    case "addx":
      cycles += 2;
      xByCycle.push(x);
      x += command.amount;
      xByCycle.push(x);
      break;
    case "noop":
      cycles++;
      xByCycle.push(x);
      break;
  }
}

const crt = [];
let priorValue = 1;
for (let i = 0; i < xByCycle.length; i += 40) {
  const crtRow = [];
  crt.push(crtRow);
  for (let x = 0; x + i < xByCycle.length && x < 40; x++) {
    const coord = x + i;
    console.log({ coord, priorValue });
    let cycle = x + 1;
    if (
      cycle === priorValue ||
      cycle === priorValue + 1 ||
      cycle === priorValue + 2
    ) {
      crtRow.push("#");
    } else {
      crtRow.push(".");
    }
    priorValue = xByCycle[coord];
  }
}
console.log(crt.map((x) => x.join("")).join("\n"));

// let sum = 0;
// for (let i = 19; i < xByCycle.length; i += 40) {
//   console.log(i + 1, xByCycle[i], (i + 1) * xByCycle[i]);
//   sum += (i + 1) * xByCycle[i];
// }
// console.log({ sum });
