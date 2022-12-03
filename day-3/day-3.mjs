import fs from "fs";

const rugsacks = fs.readFileSync("day-3-data", "utf-8").split(/\r?\n/);
// const rugsacks = fs.readFileSync("example-data", "utf-8").split(/\r?\n/);

const alphabet = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];

function part1() {
  let priorityValue = 0;

  for (const wholeRugsack of rugsacks) {
    const firstHalf = wholeRugsack.slice(0, Math.ceil(wholeRugsack.length / 2)).split("");
    const secondHalf = wholeRugsack.slice(Math.ceil(wholeRugsack.length / 2)).split("");

    const item = firstHalf.find((char) => secondHalf.includes(char));

    priorityValue += alphabet.indexOf(item) + 1;
  }

  return priorityValue;
}

function part2() {
  let priorityValue = 0;

  for (let i = 0; i < rugsacks.length; i += 3) {
    const groupRugsack = [rugsacks[i], rugsacks[i + 1], rugsacks[i + 2]];

    const item = groupRugsack[0]
      .split("")
      .find((char) => groupRugsack[1].includes(char) && groupRugsack[2].includes(char));

    priorityValue += alphabet.indexOf(item) + 1;
  }

  return priorityValue;
}

console.log("priority items for part1: ", part1());
console.log("priority items for part2: ", part2());
