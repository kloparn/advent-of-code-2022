import fs from "fs";

const commands = fs.readFileSync("data", "utf-8").split(/\r?\n/);
// const commands = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

function setupDirectories() {
  const path = [];
  const directoriesSizes = {};
  for (const command of commands) {
    if (command.includes("$ ls") || command.includes("dir")) continue;

    if (command.includes("$ cd")) {
      const [_, matched] = command.match(/cd (.+)/);

      matched === ".." ? path.pop() : path.push(matched === "/" ? matched : matched + "/");

      continue;
    }

    const fileSize = command.split(" ")[0];

    for (let i = 1; i <= path.length; i++) {
      const fullpath = path.slice(0, i).join("");

      if (!directoriesSizes[fullpath]) directoriesSizes[fullpath] = parseInt(fileSize);
      else directoriesSizes[fullpath] += parseInt(fileSize);
    }
  }
  return directoriesSizes;
}

const directories = setupDirectories();

function part1(maxSize) {
  return Object.values(directories)
    .filter((value) => value < maxSize)
    .reduce((total, currValue) => total + currValue, 0);
}

function part2(totalSize, updateSize) {
  const spaceLeft = totalSize - directories["/"];

  return Object.values(directories)
    .filter((directorySize) => spaceLeft + directorySize > updateSize)
    .sort((a, b) => a - b)[0];
}

console.log(part1(100_000));
console.log(part2(70_000_000, 30_000_000));