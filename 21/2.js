const fs = require("fs");
const nerdamer = require("nerdamer/all.min");

const map = {};
let monkeys = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row, index) => {
    // root: pppw + sjmn
    const results = row.match(/(.+?)\: (\d+|(.+?) (.+?) (.+?))$/).slice(1);
    let node = {
      name: results[0],
      needsCalc: false,
      value: parseFloat(results[1]),
      get: () => parseFloat(results[1]),
    };
    if (results[2]) {
      node = {
        name: results[0],
        needsCalc: true,
        left: results[2],
        op: results[3],
        right: results[4],
        get: (m) => op(m, node.op, m[node.left], m[node.right]),
      };
    }
    map[node.name] = node;
    return node;
  });

function op(m, operation, leftFunc, rightFunc) {
  const left = leftFunc.get(m);
  const right = rightFunc.get(m);
  const leftIsComplex = typeof left !== "number";
  const rightIsComplex = typeof right !== "number";

  if (operation !== "=" && (leftIsComplex || rightIsComplex)) {
    return `(${left} ${operation} ${right})`;
  }
  switch (operation) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "=":
      return JSON.parse(nerdamer.solve(`${left}=${right}`, "x").toDecimal())[0];
  }
}

map.humn.get = () => "x";
map.root.op = "=";
console.log("x = ", map.root.get(map));
