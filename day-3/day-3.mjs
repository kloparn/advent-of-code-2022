import fs from "fs";

const rugsacks = fs.readFileSync("day-3-data", "utf-8").split(/\r?\n/);
// const rugsacks = fs.readFileSync("example-data", "utf-8").split(/\r?\n/);

const alphabet = new Array().concat([..."abcdefghijklmnopqrstuvwxyz"], [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]);

function part1() {
  let priorityValue = 0;

  for (const wholeRugsack of rugsacks) {
    const firstHalf = wholeRugsack.slice(0, Math.ceil(wholeRugsack.length / 2)).split("");
    const secondHalf = wholeRugsack.slice(Math.ceil(wholeRugsack.length / 2)).split("");

    const sharedCompartments = firstHalf.reduce(
      (contains, curr) => (secondHalf.includes(curr) ? [...new Set([...contains, curr])] : contains),
      []
    );

    for (const item of sharedCompartments) {
      priorityValue += alphabet.indexOf(item) + 1;
    }
  }

  return priorityValue;
}

function part2() {
  let priorityValue = 0;

  for (let i = 0; i < rugsacks.length; i += 3) {
    const groupRugsack = [rugsacks[i], rugsacks[i + 1], rugsacks[i + 2]];

    let sharedCompartments = [];

    for (let index = 0; index < 3; index++) {
      for (const char of groupRugsack[index]) {
        if (groupRugsack[(i + 1) % 3].includes(char) && groupRugsack[(i + 2) % 3].includes(char)) {
          sharedCompartments.push(char);
        }
      }
    }

    sharedCompartments = [...new Set(...sharedCompartments)];

    for (const item of sharedCompartments) {
      priorityValue += alphabet.indexOf(item) + 1;
    }
  }

  return priorityValue;
}

console.log("priority items for part1: ", part1());
console.log("priority items for part2: ", part2());
