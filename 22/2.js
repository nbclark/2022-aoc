const fs = require("fs");

const grid = [];
const path = [];
let isGrid = true;
let facing = "R";
let lines = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row, index) => {
    if (!row) {
      isGrid = false;
    }
    if (isGrid)
      grid.push(row.split("").map((x) => x.trim().replace("#asx", ".")));
    else if (row) {
      const match = row.matchAll(/(\d+|[RL])/g);
      let amount;
      for (const foo of match) {
        if (amount === undefined) {
          amount = true;
          path.push({ type: "amount", value: parseFloat(foo[0]) });
        } else {
          path.push({ type: "dir", value: foo[0] });
          amount = undefined;
        }
      }
    }
  });

const testSquares = [
  // BACK OF CUBE
  {
    id: 0,
    left: 3, // top
    leftEdge: "left",
    right: 1, // right
    rightEdge: "left",
    top: 5, // top
    topEdge: "left",
    bottom: 2, // top
    bottomEdge: "top",
    // --
    startX: 50,
    endX: 99,
    startY: 0,
    endY: 49,
  },
  // RIGHT OF CUBE
  {
    id: 1,
    left: 0, // top
    leftEdge: "right",
    right: 4, // right
    rightEdge: "right",
    top: 5, // top
    topEdge: "bottom",
    bottom: 2, // top
    bottomEdge: "right",
    // --
    startX: 100,
    endX: 149,
    startY: 0,
    endY: 49,
  },
  // BOTTOM OF CUBE
  {
    id: 2,
    left: 3, // top
    leftEdge: "top",
    right: 1, // right
    rightEdge: "bottom",
    top: 0, // top
    topEdge: "bottom",
    bottom: 4, // top
    bottomEdge: "top",
    // --
    startX: 50,
    endX: 99,
    startY: 50,
    endY: 99,
  },
  // LEFT OF CUBE
  {
    id: 3,
    left: 0, // top
    leftEdge: "left",
    right: 4, // right
    rightEdge: "left",
    top: 2, // top
    topEdge: "left",
    bottom: 5, // top
    bottomEdge: "top",
    // --
    startX: 0,
    endX: 49,
    startY: 100,
    endY: 149,
  },
  // FRONT OF CUBE
  {
    id: 4,
    left: 3, // top
    leftEdge: "right",
    right: 1, // right
    rightEdge: "right",
    top: 2, // top
    topEdge: "bottom",
    bottom: 5, // top
    bottomEdge: "right",
    // --
    startX: 50,
    endX: 99,
    startY: 100,
    endY: 149,
  },
  // TOP OF CUBE
  {
    id: 5,
    left: 0, // top
    leftEdge: "top",
    right: 4, // right
    rightEdge: "bottom",
    top: 3, // top
    topEdge: "bottom",
    bottom: 1, // top
    bottomEdge: "top",
    // --
    startX: 0,
    endX: 49,
    startY: 150,
    endY: 199,
  },
];

const _testSquares = [
  {
    id: 0,
    left: 2, // top
    leftEdge: "top",
    right: 5, // right
    rightEdge: "right",
    top: 1, // top
    topEdge: "top",
    bottom: 3, // top
    bottomEdge: "top",
    // --
    startX: 8,
    endX: 11,
    startY: 0,
    endY: 3,
  },
  {
    id: 1,
    left: 5, // bottom
    right: 2, // left
    top: 0, // top
    bottom: 4, // bottom
    leftEdge: "bottom",
    rightEdge: "left",
    topEdge: "top",
    bottomEdge: "bottom",
    // --
    startX: 0,
    endX: 3,
    startY: 4,
    endY: 7,
  },
  {
    id: 2,
    left: 1, // right
    right: 3, // left
    top: 0, // left
    bottom: 4, // left
    leftEdge: "right",
    rightEdge: "left",
    topEdge: "left",
    bottomEdge: "left",
    // --
    startX: 4,
    endX: 7,
    startY: 4,
    endY: 7,
  },
  {
    id: 3,
    left: 2, // right
    right: 5, // top
    top: 0, // bottom
    bottom: 4, // top
    leftEdge: "right",
    rightEdge: "top",
    topEdge: "bottom",
    bottomEdge: "top",
    // --
    startX: 8,
    endX: 11,
    startY: 4,
    endY: 7,
  },
  {
    id: 4,
    left: 2, // bottom
    right: 5, // left
    top: 3, // bottom
    bottom: 1, // bottom
    leftEdge: "bottom",
    rightEdge: "left",
    topEdge: "bottom",
    bottomEdge: "bottom",
    // --
    startX: 8,
    endX: 11,
    startY: 8,
    endY: 11,
  },
  {
    id: 5,

    left: 4, // right
    right: 0, // right
    top: 3, // right
    bottom: 1, // left
    leftEdge: "right",
    rightEdge: "right",
    topEdge: "right",
    bottomEdge: "left",
    // --
    startX: 12,
    endX: 15,
    startY: 8,
    endY: 11,
  },
];

// right->left, bottom->top = no direction or orientation change
const orientationChanges = {
  right_left: (from, to, x, y) => {
    return { x: x + 1, y };
  },
  bottom_top: (from, to, x, y) => {
    const deltaX = x - from.startX;
    const deltaY = y - from.startY;
    console.log({ from, to, x, y }, { x: to.startX + deltaX, y: to.startY });
    return { x: to.startX + deltaX, y: to.startY, facing: "D" };
  },
  top_bottom: (from, to, x, y) => {
    const deltaX = x - from.startX;
    const deltaY = y - from.startY;
    console.log({ from, to, x, y }, { x: to.startX + deltaX, y: to.startY });
    return { x: to.startX + deltaX, y: to.endY, facing: "U" };
  },
  left_right: (from, to, x, y) => {
    return { x: x + 1, y, facing: "R" };
  },
  right_top: (from, to, x, y) => {
    // top-left = bottom-right
    const deltaX = x - from.endX;
    const deltaY = y - from.startY;
    return { x: to.endX - deltaY, y: to.startY, facing: "D" };
  },
  bottom_bottom: (from, to, x, y) => {
    // top-left = bottom-right
    const deltaX = from.endX - x;
    const deltaY = y - from.startY;
    console.log("zzz", to.endX, deltaX, x, from);
    return { x: to.startX + deltaX, y: to.endY, facing: "U" };
  },
  left_top: (from, to, x, y) => {
    // top-left = bottom-right
    const deltaX = x - from.startX;
    const deltaY = y - from.startY;
    console.log("left_top", {
      x: to.startX + deltaY,
      y: to.startY,
      facing: "D",
    });
    // process.exit(0);
    return { x: to.startX + deltaY, y: to.startY, facing: "D" };
  },
  top_left: (from, to, x, y) => {
    // top-left = bottom-right
    const deltaX = x - from.startX;
    const deltaY = y - from.startY;
    console.log("zzz", { x: to.startX, y: to.startY + deltaX, facing: "R" });
    return { x: to.startX, y: to.startY + deltaX, facing: "R" };
  },
  left_left: (from, to, x, y) => {
    // top-left = bottom-right
    const deltaX = x - from.startX;
    const deltaY = y - from.startY;
    console.log("zzz", { x: to.startX, y: to.startY + deltaX, facing: "R" });
    return { x: to.startX, y: to.endY - deltaY, facing: "R" };
  },
  right_right: (from, to, x, y) => {
    // top-left = bottom-right
    const deltaX = x - from.startX;
    const deltaY = y - from.startY;
    console.log("zzz", { x: to.startX, y: to.startY + deltaX, facing: "R" });
    return { x: to.endX, y: to.endY - deltaY, facing: "L" };
  },
  right_bottom: (from, to, x, y) => {
    // top-left = bottom-right
    const deltaX = x - from.endX;
    const deltaY = y - from.startY;
    return { x: to.startX + deltaY, y: to.endY, facing: "U" };
  },
  bottom_right: (from, to, x, y) => {
    // top-left = bottom-right
    const deltaX = x - from.startX;
    const deltaY = y - from.startY;
    return { x: to.endX, y: to.startY + deltaX, facing: "L" };
  },
};
//

const directionEdges = {
  R: "right",
  U: "top",
  D: "bottom",
  L: "left",
};

function getNextSquareAndDirection(pos, facing) {
  console.log({ pos });
  const square = testSquares.find((square) => {
    if (
      pos.x >= square.startX &&
      pos.x <= square.endX &&
      pos.y >= square.startY &&
      pos.y <= square.endY
    ) {
      return true;
    }
  });
  const nextSquare = testSquares[square[directionEdges[facing]]];
  const nextSquareEdge = square[directionEdges[facing] + "Edge"];
  console.log({ square, nextSquare, facing, x: directionEdges[facing] });
  const key = `${directionEdges[facing]}_${nextSquareEdge}`;
  const orientationChange = orientationChanges[key];
  if (orientationChange) {
    console.log(
      "xxx",
      key,
      orientationChange(square, nextSquare, pos.x, pos.y)
    );
    return orientationChange(square, nextSquare, pos.x, pos.y);
  }
  console.log("xxx", key);
  process.exit(0);
  throw new Error("Missing orientation change");
  console.log({ nextSquare, nextSquareEdge, key, orientationChange });
  return { nextSquare, facing, nextSquareEdge };
}

const openSquares = [".", "v", "^", "<", ">"];
function move(pos, facing, amount) {
  const returnPos = { ...pos };
  if (grid[returnPos.y][returnPos.x] === "#") throw new Error("#");
  try {
    if (facing === "R") {
      grid[returnPos.y][returnPos.x] = ">";
      for (let i = 0; i < amount; ++i) {
        const nextValue = grid[returnPos.y][returnPos.x + 1];
        if (nextValue === "#") return { returnPos, facing };
        if (openSquares.indexOf(nextValue) >= 0) {
          grid[returnPos.y][returnPos.x + 1] = ">";
          returnPos.x++;
          continue;
        }
        // We have to wrap
        const {
          x: newX,
          y: newY,
          facing: newFacing,
        } = getNextSquareAndDirection(returnPos, facing);
        console.log("R", {
          x: newX,
          y: newY,
          facing: newFacing,
        });
        return move({ x: newX, y: newY }, newFacing, amount - i - 1);
      }
    } else if (facing === "L") {
      grid[returnPos.y][returnPos.x] = "<";
      for (let i = 0; i < amount; ++i) {
        const nextValue = grid[returnPos.y][returnPos.x - 1];
        if (nextValue === "#") return { returnPos, facing };
        if (openSquares.indexOf(nextValue) >= 0) {
          grid[returnPos.y][returnPos.x - 1] = "<";
          returnPos.x--;
          continue;
        }
        // We have to wrap
        const {
          x: newX,
          y: newY,
          facing: newFacing,
        } = getNextSquareAndDirection(returnPos, facing);
        console.log("R", {
          x: newX,
          y: newY,
          facing: newFacing,
        });
        return move({ x: newX, y: newY }, newFacing, amount - i - 1);
      }
    } else if (facing === "U") {
      grid[returnPos.y][returnPos.x] = "^";
      for (let i = 0; i < amount; ++i) {
        const nextRow = grid[returnPos.y - 1];
        if (nextRow) {
          const nextValue = nextRow[returnPos.x];
          if (nextValue === "#") return { returnPos, facing };
          if (openSquares.indexOf(nextValue) >= 0) {
            grid[returnPos.y - 1][returnPos.x] = "^";
            returnPos.y--;
            continue;
          }
        }
        // We have to wrap
        const {
          x: newX,
          y: newY,
          facing: newFacing,
        } = getNextSquareAndDirection(returnPos, facing);
        console.log("R", {
          x: newX,
          y: newY,
          facing: newFacing,
        });
        return move({ x: newX, y: newY }, newFacing, amount - i - 1);
      }
    } else if (facing === "D") {
      grid[returnPos.y][returnPos.x] = "v";
      for (let i = 0; i < amount; ++i) {
        const nextRow = grid[returnPos.y + 1];
        // console.log({ nextRow });
        if (nextRow) {
          const nextValue = nextRow[returnPos.x];
          // console.log({ nextValue });
          if (nextValue === "#") return { returnPos, facing };
          if (openSquares.indexOf(nextValue) >= 0) {
            grid[returnPos.y + 1][returnPos.x] = "v";
            returnPos.y++;
            continue;
          }
        }
        // We have to wrap
        const {
          x: newX,
          y: newY,
          facing: newFacing,
        } = getNextSquareAndDirection(returnPos, facing);
        if (!newFacing) process.exit(0);
        console.log("D", {
          x: newX,
          y: newY,
          facing: newFacing,
        });
        return move({ x: newX, y: newY }, newFacing, amount - i - 1);
      }
    }
  } catch (e) {
    console.error(e, e.message);
    if (e.message !== "#") {
      console.log("done");
      process.exit(0);
    }
  }
  return { returnPos, facing };
}

function turn(facing, dir) {
  switch (facing) {
    case "U":
      return dir === "R" ? "R" : "L";
    case "D":
      return dir === "R" ? "L" : "R";
    case "L":
      return dir === "R" ? "U" : "D";
    case "R":
      return dir === "R" ? "D" : "U";
  }
}

let startPos = { x: grid[0].indexOf("."), y: 0 };
// console.log(grid, path, startPos);

// console.log(
//   grid.map((x) => x.map((y) => (y === "" ? " " : y)).join(" ")).join("\n")
// );

for (const instr of path) {
  if (instr.type === "dir") {
    // console.log("turn", facing, instr.value);
    facing = turn(facing, instr.value);
  } else {
    console.log("move", facing, instr.value);
    const { returnPos, facing: newFacing } = move(
      startPos,
      facing,
      instr.value
    );
    startPos = returnPos;
    facing = newFacing;
    // console.log(
    //   { startPos },
    //   "\n",
    //   grid.map((x) => x.map((y) => (y === "" ? " " : y)).join(" ")).join("\n")
    // );
  }
  console.log({ facing, startPos });
}

function getDirectionScore(facing) {
  switch (facing) {
    case "U":
      return 3;
    case "D":
      return 1;
    case "L":
      return 2;
    case "R":
      return 0;
  }
}
console.log(
  1000 * (startPos.y + 1) + 4 * (startPos.x + 1) + getDirectionScore(facing),
  { startPos }
);

// console.log(
//   grid.map((x) => x.map((y) => (y === "" ? " " : y)).join(" ")).join("\n")
// );
