const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

const data = contents.split("\n").map((x) => x.split(" "));

const aMap = { A: "rock", B: "paper", C: "scissors" };
const bMap = { X: "rock", Y: "paper", Z: "scissors" };

const scores = { rock: 1, paper: 2, scissors: 3 };

function evalRound(a, b) {
  if (a === b) {
    if (a === "rock") return 3 + scores[b];
    if (a === "paper") return 3 + scores[b];
    if (a === "scissors") return 3 + scores[b];
  }
  if (b === "rock") return a === "paper" ? scores[b] : 6 + scores[b];
  if (b === "paper") return a === "scissors" ? scores[b] : 6 + scores[b];
  if (b === "scissors") return a === "rock" ? scores[b] : 6 + scores[b];
  return 0;
}

console.log(data.reduce((sum, [a, b]) => sum + evalRound(aMap[a], bMap[b]), 0));
