const fs = require("fs");

const elves = [];
let grid = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((row, index) => {
    const cells = row.split("");
    for (let i = 0; i < cells.length; ++i) {
      if (cells[i] === "#") {
        elves.push({ index: elves.length, x: i, y: index });
      }
    }
    return cells;
  });
// console.log({ elves });

const directions = {
  N: { y: -1, x: 0 },
  S: { y: 1, x: 0 },
  E: { y: 0, x: 1 },
  W: { y: 0, x: -1 },
  NE: { y: -1, x: 1 },
  SE: { y: 1, x: 1 },
  SW: { y: 1, x: -1 },
  NW: { y: -1, x: -1 },
};

// During the first half of each round, each Elf considers the eight positions adjacent to themself. If no other Elves are in one of those eight positions, the Elf does not do anything during this round. Otherwise, the Elf looks in each of four directions in the following order and proposes moving one step in the first valid direction:

// If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
// If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
// If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
// If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step.

const moveOrders = [
  ["N", "NE", "NW"],
  ["S", "SE", "SW"],
  ["W", "NW", "SW"],
  ["E", "NE", "SE"],
];

function makeElfMap() {
  const elfMap = elves.reduce((map, elf) => {
    const key = `${elf.x}_${elf.y}`;
    if (!map[key]) map[key] = [];
    map[key].push(elf);
    return map;
  }, {});
  return elfMap;
}

let count = 0;
while (true) {
  count++;
  const proposals = [];
  const elfMap = makeElfMap();
  for (const elf of elves) {
    let hasElf = false;
    for (const [key, value] of Object.entries(directions)) {
      const newPos = { x: elf.x + value.x, y: elf.y + value.y };
      const elfInPosition = elfMap[`${newPos.x}_${newPos.y}`];
      if (elfInPosition) {
        hasElf = true;
      }
    }
    if (hasElf) {
      for (const moveOrder of moveOrders) {
        let canMove = true;
        for (const d of moveOrder) {
          const dir = directions[d];

          const elfInPosition = elfMap[`${elf.x + dir.x}_${elf.y + dir.y}`];
          if (elfInPosition) {
            canMove = false;
            break;
          }
        }
        if (canMove) {
          const dir = directions[moveOrder[0]];
          proposals.push({
            elf,
            dir: moveOrder[0],
            newPos: { x: elf.x + dir.x, y: elf.y + dir.y },
          });
          break;
        }
      }
    }
  }

  // After each Elf has had a chance to propose a move, the second half of the round can begin. Simultaneously, each Elf moves to their proposed destination tile if they were the only Elf to propose moving to that position. If two or more Elves propose moving to the same position, none of those Elves move.
  const propMap = proposals.reduce((map, prop) => {
    const key = `${prop.newPos.x}_${prop.newPos.y}`;
    if (!map[key]) map[key] = [];
    map[key].push(prop.elf);
    return map;
  }, {});

  const filteredProposals = proposals.filter(
    (p) => propMap[`${p.newPos.x}_${p.newPos.y}`].length === 1
  );

  // console.log(filteredProposals);
  for (const proposal of filteredProposals) {
    proposal.elf.x = proposal.newPos.x;
    proposal.elf.y = proposal.newPos.y;
  }

  // Finally, at the end of the round, the first direction the Elves considered is moved to the end of the list of directions. For example, during the second round, the Elves would try proposing a move to the south first, then west, then east, then north. On the third round, the Elves would first consider west, then east, then north, then south.
  const [firstOrder] = moveOrders.splice(0, 1);
  moveOrders.push(firstOrder);

  // console.log({ count, moveOrders });

  if (filteredProposals.length === 0) {
    console.log({ count });
    break;
  }
}

let minX = Number.MAX_SAFE_INTEGER;
let maxX = Number.MIN_SAFE_INTEGER;
let minY = Number.MAX_SAFE_INTEGER;
let maxY = Number.MIN_SAFE_INTEGER;
for (const elf of elves) {
  minX = Math.min(minX, elf.x);
  maxX = Math.max(maxX, elf.x);
  minY = Math.min(minY, elf.y);
  maxY = Math.max(maxY, elf.y);
}

console.log({ minX, maxX, minY, maxY }, elves.length);
console.log((maxX - minX + 1) * (maxY - minY + 1) - elves.length);

// const elfMap = makeElfMap();
// for (let y = minY; y <= maxY; y++) {
//   let str = "";
//   for (let x = minX; x <= maxX; x++) {
//     str += elfMap[`${x}_${y}`] ? "#" : ".";
//   }
//   console.log(str);
// }
