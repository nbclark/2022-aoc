const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const rows = contents.split("\n");

const directories = ["/"];
const files = [];
let path = "";
let dir = "";
let dirs = [];
for (const row of rows) {
  if (row.startsWith("$")) {
    const command = row.substring(2).split(" ");
    if (command[0] === "cd") {
      if (command[1] === "..") {
        const parts = path.split("/");
        path = parts.slice(0, parts.length - 2).join("/") + "/";
      } else if (command[1].startsWith("/")) {
        path = command[1];
      } else {
        path = `${path}${command[1]}/`;
      }
      if (directories.indexOf(path) < 0) {
        directories.push(path);
      }
      // console.log({ path });
    } else if (command === "ls") {
      dirs = [];
      // files = [];
    }
  } else if (row.startsWith("dir ")) {
    dirs.push(row.substring(4));
  } else {
    const [size, file] = row.split(" ");
    // files.push({ size: parseFloat(size), file: `${path}${file}` });
    files[`${path}~${file}`] = parseFloat(size);
  }
  // console.log(path, dir);
}

// console.log({ directories, files });

const diskSize = 70000000;
const neededSize = 30000000;
let totalSum = Object.values(files).reduce((sum, size) => sum + size, 0);
const freeSize = diskSize - totalSum;
const neededToFree = neededSize - freeSize;

console.log({ totalSum, freeSize, neededToFree });

let available = [];
for (const directory of directories) {
  const filesInPath = Object.keys(files).filter((x) => x.startsWith(directory));
  const size = filesInPath.reduce((sum, file) => files[file] + sum, 0);
  // console.log({ directory, filesInPath, size });
  if (size >= neededToFree) {
    // console.log({ directory, filesInPath, size });
    // sum += size;
    available.push({ directory, size });
  }
  //100000
}

const sortedAvailable = available.sort((x1, x2) => x1.size - x2.size);

console.log({ sortedAvailable }, sortedAvailable[0].size);
