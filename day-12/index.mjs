import fs from "fs";

const heightMap = fs
  .readFileSync("data", "utf-8")
  .split(/\r?\n/)
  .map((row) => row.split(""));

// const heightMap = fs
//   .readFileSync("data.example", "utf-8")
//   .split(/\r?\n/)
//   .map((row) => row.split(""));

const hashmapValues = [..."SabcdefghijklmnopqrstuvwxyzE".split("")].reduce((hashmap, currChar, index) => (hashmap = { ...hashmap, [index]: currChar }), {});

/*
  Rules:
   - As few steps as possible.
   - Can only move UP, RIGHT, DOWN, LEFT
   - AT MOST only allowed to take 1 step up, m -> n is allowed, m -> o is not allowed
*/

function getDistanceBetweenSteps(currStep, destinationStep) {
  return Math.round(Math.hypot(destinationStep[1] - currStep[1], destinationStep[0] - currStep[0]));
}

function getRawDistanceBetweenSteps(currStep, destinationStep) {
  return Math.hypot(destinationStep[1] - currStep[1], destinationStep[0] - currStep[0]);
}



function getNextPosition(currPoint, nextChar) {
  const allpossiblePositions = [];

  for (let y = 0; y < heightMap.length; y++) {
    for (let x = 0; x < heightMap[y].length; x++) {
      if (heightMap[y][x] === nextChar) allpossiblePositions.push([y, x]);
    }
  }

  const closestPoint = getClosestPoint(currPoint, allpossiblePositions);

  console.log(closestPoint);

  return closestPoint;
}

function getClosestPoint(currPoint, points) {
  const valuesFromPointToCurrentPoint = [];

  for (const point of points) {
    if (!point) continue;
    valuesFromPointToCurrentPoint.push({
      point,
      distanceFromCurrent: getRawDistanceBetweenSteps(currPoint, point),
    });
  }

  // console.log(valuesFromPointToCurrentPoint);

  const closestPoint = valuesFromPointToCurrentPoint.reduce((nearestPoint, obj) => {
    // console.log(nearestPoint, obj);
    if (!nearestPoint.point) return obj;
    if (nearestPoint.distanceFromCurrent > obj.distanceFromCurrent) return obj;
    return nearestPoint;
  }, {});

  return closestPoint.point;
}

function getCharFromValue(stepValue) {
  return hashmapValues[stepValue];
}

function part1() {
  const startArrayIndex = heightMap.findIndex((arr) => arr.find((char) => char === "S"));
  const destinationArrayIndex = heightMap.findIndex((arr) => arr.find((char) => char === "E"));

  const startPositionIndex = heightMap[startArrayIndex].findIndex((char) => char === "S");
  const destinationPositionIndex = heightMap[destinationArrayIndex].findIndex((char) => char === "E");

  const startPosition = [startArrayIndex, startPositionIndex];
  const destinationPosition = [destinationArrayIndex, destinationPositionIndex];

  let currentPosition = [...startPosition];
  let stepsToGoal = 1;
  let currentIncrement = 0;

  console.log(hashmapValues);
  while (true) {
    if (currentPosition[0] === destinationPosition[0] && currentPosition[1] === destinationPosition[1]) break;

    const nextChar = getCharFromValue(currentIncrement++);

    const nextPosition = getNextPosition(currentPosition, nextChar);

    stepsToGoal += getDistanceBetweenSteps(currentPosition, nextPosition);

    console.log({ currentPosition, nextPosition, destinationPosition, steps: getDistanceBetweenSteps(currentPosition, nextPosition) });

    currentPosition = [...nextPosition];
  }

  return stepsToGoal;
}

console.log(part1());
