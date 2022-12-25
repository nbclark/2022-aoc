const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const commands = contents.split("\n").map((x) => {
  const [arg, amount] = x.split(" ");
  return { arg, amount: parseFloat(amount) };
});

let x = 1;
let cycles = 0;
let xByCycle = [1];
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

let sum = 0;
for (let i = 19; i < xByCycle.length; i += 40) {
  console.log(i + 1, xByCycle[i], (i + 1) * xByCycle[i]);
  sum += (i + 1) * xByCycle[i];
}
console.log({ sum });
