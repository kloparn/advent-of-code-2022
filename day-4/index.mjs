import fs from "fs";

const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
// const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

function between(x, min, max) {
  return (x - min) * (x - max) <= 0;
}

function part1() {
  let sameAssignments = 0;

  for (const elfs of data) {
    const [elf1, elf2] = elfs.split(",");

    const [elf1min, elf1max] = elf1.split("-");
    const [elf2min, elf2max] = elf2.split("-");

    if (between(elf2min, elf1min, elf1max) && between(elf2max, elf1min, elf1max)) {
      sameAssignments++;
      continue;
    }

    if (between(elf1min, elf2min, elf2max) && between(elf1max, elf2min, elf2max)) sameAssignments++;
  }

  return sameAssignments;
}

function part2() {
  let sameAssignments = 0;

  for (const elfs of data) {
    const [elf1, elf2] = elfs.split(",");

    const [elf1min, elf1max] = elf1.split("-");
    const [elf2min, elf2max] = elf2.split("-");

    if (between(elf2min, elf1min, elf1max) || between(elf2max, elf1min, elf1max)) {
      sameAssignments++;
      continue;
    }

    if (between(elf1min, elf2min, elf2max) || between(elf1max, elf2min, elf2max)) sameAssignments++;
  }

  return sameAssignments;
}

console.log(part1());
console.log(part2());
