const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const rows = contents.split("\n");

const setup = rows
  .slice(0, 3 + 5)
  .map((x) =>
    x
      .match(/(\[.+?\]|\s{2,5})/gi)
      .map((y) => y.trim().replace("[", "").replace("]", ""))
  );

const columns = setup
  .slice()
  .reverse()
  .reduce((arr, row) => {
    for (let i = 0; i < row.length; ++i) {
      if (row[i]) {
        if (!arr[i]) arr[i] = [];
        arr[i].push(row[i]);
      }
    }
    return arr;
  }, []);

const directions = rows.slice(5 + 5, rows.length).map((x) =>
  x
    .match(/move (.+?) from (.+?) to (.+?)/)
    .slice(1)
    .map(parseFloat)
);

console.log(
  columns.reduce((arr, col) => [...arr, col.join("")], []).join("\n")
);
console.log("\n");
console.log("\n");

for (const [move, from, to] of directions) {
  // console.log(columns, { move, from, to });
  columns[to - 1] = [
    ...columns[to - 1],
    ...columns[from - 1].splice(-move), //.reverse(),
  ];
  // console.log(columns, { move, from, to });
  // console.log(
  //   columns.reduce((arr, col) => [...arr, col[col.length - 1]], []).join("")
  // );
  console.log(
    columns.reduce((arr, col) => [...arr, col.join("")], []).join("\n")
  );
  console.log("\n");
}

console.log(
  columns.reduce((arr, col) => [...arr, col[col.length - 1]], []).join("")
);
// console.log({ setup, directions, columns });
