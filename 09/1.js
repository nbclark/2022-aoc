const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const commands = contents.split("\n").map((x) => {
  const [dir, amount] = x.split(" ");
  return { dir, amount: parseFloat(amount) };
});

//  y, x
let head = [0, 0];
let tail = [0, 0];

const tailPositions = {};

for (const command of commands) {
  for (let i = 0; i < command.amount; ++i) {
    switch (command.dir) {
      case "U":
        head[0] += 1;
        break;
      case "D":
        head[0] -= 1;
        break;
      case "L":
        head[1] -= 1;
        break;
      case "R":
        head[1] += 1;
        break;
    }
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
    if (!tailPositions[`${tail[0]},${tail[1]}`])
      tailPositions[`${tail[0]},${tail[1]}`] = 0;
    tailPositions[`${tail[0]},${tail[1]}`]++;
  }
  console.log("stop", { command, head, tail });
}

console.log(Object.keys(tailPositions).length);
