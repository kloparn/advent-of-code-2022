import fs from "fs";

const packets = fs.readFileSync("data.txt", "utf-8").split(/\r?\n/);
// const packets = fs.readFileSync("data.example.txt", "utf-8").split(/\r?\n/);

function parsePackets() {
  const parsedPackages = {};

  let index = 1;

  for (const packet of packets) {
    if (packet === "") {
      index++;
      continue;
    }

    const packetName = `packet${index}`;

    if (!parsedPackages[packetName]) parsedPackages[packetName] = { left: JSON.parse(packet), index: index };
    else parsedPackages[packetName] = { ...parsedPackages[packetName], right: JSON.parse(packet) };
  }

  return parsedPackages;
}

const parsedPackets = parsePackets();

/*
  You need to identify how many pairs of packets are in the right order
  rules:
    If both values are integers, the lower integer should come first
    If the left integer is lower than the right integer, the inputs are in the right order
    If the left integer is higher than the right integer, the inputs are not in the right order
    Otherwise, the inputs are the same integer
    continue checking the next part of the input.

    If both values are lists, compare the first value of each list
    then the second value, and so on
    If the left list runs out of items first, the inputs are in the right order. 
    If the right list runs out of items first, the inputs are not in the right order
    If the lists are the same length and no comparison makes a decision about the order,
    continue checking the next part of the input

    If exactly one value is an integer
    convert the integer to a list which contains that integer as its only value
    then retry the comparison
    For example, if comparing [0,0,0] and 2
    convert the right value to [2] (a list containing 2)
    the result is then found by instead comparing [0,0,0] and [2].
*/

function comparePackates(packate1, packate2) {
  const packate1IsNumber = typeof packate1 === "number";
  const packate2IsNumber = typeof packate2 === "number";

  if (packate1IsNumber && packate2IsNumber) {
    // both is a number, so we can return from the recursion
    return packate1 - packate2;
  }

  if (packate1IsNumber) {
    packate1 = [packate1];
  }

  if (packate2IsNumber) {
    packate2 = [packate2];
  }

  const numberOfLoops = Math.min(packate1.length, packate2.length);

  for (let i = 0; i < numberOfLoops; i++) {
    const result = comparePackates(packate1[i], packate2[i]);

    // not equal
    if (result !== 0) return result;
  }
  // if we arrive here the sublists are equal, so lengths are compared
  return packate1.length - packate2.length;
}

function part1() {
  const parsedPackagesCopy = JSON.parse(JSON.stringify(parsedPackets));

  let sumOfIndices = 0;

  for (const packate of Object.values(parsedPackagesCopy)) {
    const value = comparePackates(packate.left, packate.right);

    if (value <= 0) {
      sumOfIndices += packate.index;
    }
  }

  return sumOfIndices;
}

function part2() {
  const parsedPackagesCopy = JSON.parse(JSON.stringify(parsedPackets));

  parsedPackagesCopy[`packet${Object.keys(parsedPackagesCopy).length + 1}`] = {
    left: [[2]],
    right: [[6]],
    index: Object.keys(parsedPackagesCopy).length + 1,
  };

  const allPackets = Object.values(parsedPackagesCopy).reduce((packets, curr) => [...packets, curr.left, curr.right], []);

  const sortedPackages = allPackets.sort((package1, package2) => comparePackates(package1, package2));

  const findIndexOfTopDivider = sortedPackages.findIndex((pkg) => JSON.stringify(pkg) === "[[2]]") + 1;
  const findIndexOfBottomDivider = sortedPackages.findIndex((pkg) => JSON.stringify(pkg) === "[[6]]") + 1;

  return findIndexOfTopDivider * findIndexOfBottomDivider;
}

let t0 = performance.now();
console.log(part1(), ` ${performance.now() - t0}`);
t0 = performance.now();
console.log(part2(), ` ${performance.now() - t0}`);
