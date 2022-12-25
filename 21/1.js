const fs = require("fs");

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

function op(m, operation, left, right) {
  switch (operation) {
    case "+":
      return left.get(m) + right.get(m);
    case "-":
      return left.get(m) - right.get(m);
    case "*":
      return left.get(m) * right.get(m);
    case "/":
      return left.get(m) / right.get(m);
  }
}

console.log(map.root.get(map));
