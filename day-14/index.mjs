import fs from "fs";

const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
// const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

const parsedData = data.reduce((instructions, currInstruction) => {
  const splitCurrInstruction = currInstruction.split(" -> ");
  const instructionssArray = splitCurrInstruction.reduce((arr, str) => [...arr, [parseInt(str.split(",")[0]), parseInt(str.split(",")[1])]], []);

  return [...instructions, instructionssArray];
}, []);

const maxXValue = parsedData.reduce(
  (val, currPoint) =>
    Math.max(
      currPoint.reduce((_val, _curr) => Math.max(_val, _curr[0]), 0),
      val
    ),
  0
);

const minXValue = parsedData.reduce(
  (val, currPoint) =>
    Math.min(
      currPoint.reduce((_val, _curr) => Math.min(_val, _curr[0]), Infinity),
      val
    ),
  Infinity
);

const maxYValue = parsedData.reduce(
  (val, currPoint) =>
    Math.max(
      currPoint.reduce((_val, _curr) => Math.max(_val, _curr[1]), 0),
      val
    ),
  0
);

function fillCave(cave, data, dripPoint, floorIsRock) {
  const caveCopy = JSON.parse(JSON.stringify(cave));

  caveCopy[0][dripPoint] = "+";

  if (floorIsRock) {
    for (let i = 0; i < caveCopy[0].length; i++) caveCopy[caveCopy.length - 1][i] = "#";
  }

  for (const instructions of data) {
    let currentPoint = instructions.shift();
    caveCopy[currentPoint[1]][currentPoint[0]] = "#";
    for (const [insX, insY] of instructions) {
      const diffX = insX - currentPoint[0];
      const diffY = insY - currentPoint[1];

      if (diffX > 0) {
        for (let i = 0; i < diffX; i++) {
          currentPoint[0]++;
          caveCopy[currentPoint[1]][currentPoint[0]] = "#";
        }
      }

      if (diffX < 0) {
        for (let i = 0; i > diffX; i--) {
          currentPoint[0]--;
          caveCopy[currentPoint[1]][currentPoint[0]] = "#";
        }
      }

      if (diffY > 0) {
        for (let i = 0; i < diffY; i++) {
          currentPoint[1]++;
          caveCopy[currentPoint[1]][currentPoint[0]] = "#";
        }
      }

      if (diffY < 0) {
        for (let i = 0; i > diffY; i--) {
          currentPoint[1]--;
          caveCopy[currentPoint[1]][currentPoint[0]] = "#";
        }
      }
    }
  }

  return caveCopy;
}

function prettyPrint(arr) {
  arr.forEach((a) => console.log(JSON.stringify(a)));
}

function part1(cave, dripPoint) {
  const sandInitDropPoint = [dripPoint, 0];

  let sand = 0;

  while (true) {
    const sandPosition = [...sandInitDropPoint];
    while (true) {
      if (sandPosition[1] + 1 > cave.length - 1 || sandPosition[0] - 1 < 0 || sandPosition[0] + 1 > cave[0].length - 1) return sand;

      if (!["#", "o"].includes(cave[sandPosition[1] + 1][sandPosition[0]])) {
        sandPosition[1]++;
      } else if (!["#", "o"].includes(cave[sandPosition[1] + 1][sandPosition[0] - 1])) {
        sandPosition[0]--;
        sandPosition[1]++;
      } else if (!["#", "o"].includes(cave[sandPosition[1] + 1][sandPosition[0] + 1])) {
        sandPosition[0]++;
        sandPosition[1]++;
      } else {
        cave[sandPosition[1]][sandPosition[0]] = "o";
        break;
      }
    }

    sand++;
  }
}

function part2(cave, dripPoint) {
  const sandInitDropPoint = [dripPoint, 0];

  let sand = 0;

  while (true) {
    const sandPosition = [...sandInitDropPoint];
    while (true) {
      if (cave[0][dripPoint] === "o") return sand;

      if (!["#", "o"].includes(cave[sandPosition[1] + 1][sandPosition[0]])) {
        sandPosition[1]++;
      } else if (!["#", "o"].includes(cave[sandPosition[1] + 1][sandPosition[0] - 1])) {
        sandPosition[0]--;
        sandPosition[1]++;
      } else if (!["#", "o"].includes(cave[sandPosition[1] + 1][sandPosition[0] + 1])) {
        sandPosition[0]++;
        sandPosition[1]++;
      } else {
        cave[sandPosition[1]][sandPosition[0]] = "o";
        break;
      }
    }

    sand++;
  }
}

const standardizedData = parsedData.map((arr) => arr.map(([x, y]) => [x % minXValue, y]));

const dripPointPart1 = 500 % minXValue;

const caveSizepart1 = [maxXValue - minXValue, maxYValue];

const cavepart1 = Array.from({ length: caveSizepart1[1] + 1 }, () => Array.from({ length: caveSizepart1[0] + 1 }, () => "."));

const caveCopyForPart1 = fillCave(cavepart1, standardizedData, dripPointPart1);

const dripPointPart2 = 500;

const caveSizepart2 = [maxXValue, maxYValue];

const cavepart2 = Array.from({ length: caveSizepart2[1] + 3 }, () => Array.from({ length: caveSizepart2[0] * 2 }, () => "."));

const caveCopyForPart2 = fillCave(cavepart2, parsedData, dripPointPart2, true);

let t0 = performance.now();
console.log(part1(caveCopyForPart1, dripPointPart1), ` ${performance.now() - t0}`);
t0 = performance.now();
console.log(part2(caveCopyForPart2, dripPointPart2), ` ${performance.now() - t0}`);
