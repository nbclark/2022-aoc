const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });

const data = contents.split("\n").map((x) => x.split(" "));

const aMap = { A: "rock", B: "paper", C: "scissors" };
const bMap = { X: "rock", Y: "paper", Z: "scissors" };

const scores = { rock: 1, paper: 2, scissors: 3 };

// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win

function evalRound(a, b) {
  if (b === "Y") {
    if (a === "rock") return 3 + scores[a];
    if (a === "paper") return 3 + scores[a];
    if (a === "scissors") return 3 + scores[a];
  }
  if (a === "rock") return b === "X" ? scores["scissors"] : 6 + scores["paper"];
  if (a === "paper") return b === "X" ? scores["rock"] : 6 + scores["scissors"];
  if (a === "scissors") return b === "X" ? scores["paper"] : 6 + scores["rock"];
  return 0;
}

console.log(data.reduce((sum, [a, b]) => sum + evalRound(aMap[a], b), 0));
