const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const commands = contents.split("\n").map((x) => {
  const [dir, amount] = x.split(" ");
  return { dir, amount: parseFloat(amount) };
});

//  y, x

let knots = 10;
let positions = [];
for (let k = 0; k < knots; ++k) {
  positions.push([0, 0]);
}
const tailPositions = {};

for (const command of commands) {
  for (let i = 0; i < command.amount; ++i) {
    const actualHead = positions[0];
    switch (command.dir) {
      case "U":
        actualHead[0] += 1;
        break;
      case "D":
        actualHead[0] -= 1;
        break;
      case "L":
        actualHead[1] -= 1;
        break;
      case "R":
        actualHead[1] += 1;
        break;
    }
    for (let k = 1; k < knots; ++k) {
      let head = positions[k - 1];
      let tail = positions[k];
      // Need to move the tail
      const yDelta = head[0] - tail[0];
      const xDelta = head[1] - tail[1];
      // Need to catch up on Y
      if (Math.abs(yDelta) > 1) {
        tail[0] += yDelta / Math.abs(yDelta);
        if (Math.abs(xDelta) > 0) {
          // Need to diagonal
          tail[1] += xDelta / Math.abs(xDelta);
        } else {
          // Need to just move on y
        }
      } else if (Math.abs(xDelta) > 1) {
        tail[1] += xDelta / Math.abs(xDelta);
        if (Math.abs(yDelta) > 0) {
          // Need to diagonal
          tail[0] += yDelta / Math.abs(yDelta);
        } else {
          // Need to just move on x
        }
      }
      console.log({ head, tail });
      if (k === 9) {
        if (!tailPositions[`${tail[0]},${tail[1]}`])
          tailPositions[`${tail[0]},${tail[1]}`] = 0;
        tailPositions[`${tail[0]},${tail[1]}`]++;
      }
    }
  }
}

console.log(Object.keys(tailPositions).length);
