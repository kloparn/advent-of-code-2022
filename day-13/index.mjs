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

    const packetName = `packete${index}`;

    if (!parsedPackages[packetName]) parsedPackages[packetName] = { left: JSON.parse(packet), index: index };
    else {
      parsedPackages[packetName] = {
        ...parsedPackages[packetName],
        right: JSON.parse(packet),
        comparePackates: function (left, right) {
          if (left === undefined && right === undefined) {
            left = this.left;
            right = this.right;
          }
          const left1IsNumber = typeof left === "number";
          const right2IsNumber = typeof right === "number";

          if (left1IsNumber && right2IsNumber) {
            // both is a number, so we can return from the recursion
            return left - right;
          }

          if (left1IsNumber) {
            left = [left];
          }

          if (right2IsNumber) {
            right = [right];
          }

          const numberOfLoops = Math.min(left.length, right.length);

          for (let i = 0; i < numberOfLoops; i++) {
            const result = this.comparePackates(left[i], right[i]);

            // not equal
            if (result !== 0) return result;
          }
          // if we arrive here the sublists are equal, so lengths are compared
          return left.length - right.length;
        },
      };
    }
  }

  return parsedPackages;
}

function part1() {
  let sumOfIndices = 0;

  for (const packete of Object.values(parsedPackets)) {
    const value = packete.comparePackates();

    packete.compareValue = value;
    if (value <= 0) {
      sumOfIndices += packete.index;
    }
  }

  return sumOfIndices;
}

function part2() {
  // const parsedPackagesCopy = JSON.parse(JSON.stringify(parsedPackets));

  parsedPackets[`packete${Object.keys(parsedPackets).length + 1}`] = {
    left: [[2]],
    right: [[6]],
    index: Object.keys(parsedPackets).length + 1,
  };

  const allPackets = Object.values(parsedPackets).reduce((packets, curr) => [...packets, curr.left, curr.right], []);

  const sortedPackages = allPackets.sort((package1, package2) => parsedPackets["packete1"].comparePackates(package1, package2));

  const findIndexOfTopDivider = sortedPackages.findIndex((pkg) => JSON.stringify(pkg) === "[[2]]") + 1;
  const findIndexOfBottomDivider = sortedPackages.findIndex((pkg) => JSON.stringify(pkg) === "[[6]]") + 1;

  return findIndexOfTopDivider * findIndexOfBottomDivider;
}

const parsedPackets = parsePackets();

let t0 = performance.now();
console.log(part1(), ` ${performance.now() - t0}`);
t0 = performance.now();
console.log(part2(), ` ${performance.now() - t0}`);
