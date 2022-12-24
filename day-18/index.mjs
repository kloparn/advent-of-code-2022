import fs from "fs";

const data = fs
  .readFileSync("data", "utf-8")
  .trim()
  .split(/\r?\n/)
  .map((cube) => cube.split(","))
  .map((sides) => [parseInt(sides[0]), parseInt(sides[1]), parseInt(sides[2])]);

// const data = fs
//   .readFileSync("data.example", "utf-8")
//   .trim()
//   .split(/\r?\n/)
//   .map((cube) => cube.split(","))
//   .map((sides) => [parseInt(sides[0]), parseInt(sides[1]), parseInt(sides[2])]);

const seenHashmap = {};

const getCleanCubesCopy = () => JSON.parse(JSON.stringify(data));


// Hashmap of all the sides for O(1) lookup
data.forEach(([x, y, z]) => (seenHashmap[`${x} ${y} ${z}`] = 1));

function countAvailableSides([x, y, z]) {
  let count = 0;
  if (!seenHashmap[`${x + 1} ${y} ${z}`]) count++;
  if (!seenHashmap[`${x - 1} ${y} ${z}`]) count++;
  if (!seenHashmap[`${x} ${y + 1} ${z}`]) count++;
  if (!seenHashmap[`${x} ${y - 1} ${z}`]) count++;
  if (!seenHashmap[`${x} ${y} ${z + 1}`]) count++;
  if (!seenHashmap[`${x} ${y} ${z - 1}`]) count++;

  return count;
}

function part1() {
  const cubesCopy = getCleanCubesCopy();

  let exposedSides = 0;

  // loop through all the cubes we have
  for (const cube of cubesCopy) {
    // check all sides of the cube and count the "water" sides
    exposedSides += countAvailableSides(cube);
  }

  return exposedSides;
}

const countAffectedCubes = ([x, y, z]) => {
  let count = 0;
  if (seenHashmap[`${x + 1} ${y} ${z}`]) count++;
  if (seenHashmap[`${x - 1} ${y} ${z}`]) count++;
  if (seenHashmap[`${x} ${y + 1} ${z}`]) count++;
  if (seenHashmap[`${x} ${y - 1} ${z}`]) count++;
  if (seenHashmap[`${x} ${y} ${z + 1}`]) count++;
  if (seenHashmap[`${x} ${y} ${z - 1}`]) count++;

  return count;
};

let MIN = Infinity;
let MAX = -Infinity;

for (let cube of data) {
  let [x, y, z] = cube;
  MIN = Math.min(MIN, x, y, z);
  MAX = Math.max(MAX, x, y, z);
}


function part2() {
  const visited = {};

  let exposedSides = 0;

  const queue = [[0, 0, 0]];

  while (queue.length > 0) {
    const [x, y, z] = queue.shift();

    if (visited[`${x} ${y} ${z}`]) continue;

    if (seenHashmap[`${x} ${y} ${z}`]) continue;

    if (x < MIN - 1 || y < MIN - 1 || z < MIN - 1) continue;
    if (x > MAX + 1 || y > MAX + 1 || z > MAX + 1) continue;
    visited[`${x} ${y} ${z}`] = 1;

    exposedSides += countAffectedCubes([x, y, z]);

    queue.push([x + 1, y, z]);
    queue.push([x - 1, y, z]);
    queue.push([x, y + 1, z]);
    queue.push([x, y - 1, z]);
    queue.push([x, y, z + 1]);
    queue.push([x, y, z - 1]);
  }

  return exposedSides;
}

let t0 = performance.now();
console.log(part1(), ` ${performance.now() - t0}`);
t0 = performance.now();
console.log(part2(), ` ${performance.now() - t0}`);
