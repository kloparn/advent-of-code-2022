import fs from "fs";

import { rocks } from "./rocks.mjs";

const data = fs.readFileSync("data", "utf-8");
// const data = fs.readFileSync("data.example", "utf-8");

const collisionCheck = (rock, stationaryRocks) => {
  // we split the rock up into chunks
  for (let chunk of rock) {
    // rock is on another settled rock.
    if (stationaryRocks[`${chunk.x},${chunk.y}`]) return "ROCK";

    // rock is at the floor level
    if (chunk.y < 1) return "FLOOR";

    // rock is touching the wall
    if (chunk.x <= 0 || chunk.x >= 8) return "WALL";
  }

  // Rock is free to move
  return false;
};

const getFreshRocks = () => JSON.parse(JSON.stringify(rocks));

const getTallestPoint = (rock, tallestPoint) => rock.reduce((_tallestPoint, currPiece) => Math.max(tallestPoint, _tallestPoint, currPiece.y), 0);

const updateToRightElevation = (rock, elevateTo) => rock.forEach((chunk) => ((chunk.y += elevateTo + 4), (chunk.x += 3)));

const part1 = (movePattern) => {
  const stationaryRocks = {};
  let rockHeight = 0;

  let movePatternIndex = 0;

  for (let i = 0; i < 2022; i++) {
    const rocks = getFreshRocks();
    const currentRock = rocks[i % rocks.length];

    updateToRightElevation(currentRock, rockHeight);

    let shouldFallNextMove = false;
    while (true) {
      if (!shouldFallNextMove) {
        //Gas turn to move the stone left or right

        // we get the gas move
        const moveX = movePattern[movePatternIndex++ % movePattern.length] === ">" ? 1 : -1;

        // we move the rock left or right
        currentRock.forEach((chunk) => (chunk.x += moveX));

        // we check that the move we just did is invalid
        // if so we revert the move
        const collisionResult = collisionCheck(currentRock, stationaryRocks);

        if (collisionResult === "WALL" || collisionResult === "ROCK") currentRock.forEach((chunk) => (chunk.x -= moveX));
      } /* stone falls */ else {
        // move the stone down 1 level
        currentRock.forEach((chunk) => chunk.y--);

        // we check that the move we just did is invalid
        // if so we revert the move & the rock becomes 'stationary'
        const collisionResult = collisionCheck(currentRock, stationaryRocks);
        if (collisionResult === "ROCK" || collisionResult === "FLOOR") {
          // revert move to get right height & add it to the stationary set
          currentRock.forEach((chunk) => (chunk.y++, (stationaryRocks[`${chunk.x},${chunk.y}`] = 1)));

          rockHeight = getTallestPoint(currentRock, rockHeight);
          break;
        }
      }

      // flip the condition for falling/moving;
      shouldFallNextMove = !shouldFallNextMove;
    }
  }

  return rockHeight;
};

let heighestPoint = 0;
let rockIndex = 0;
let movePatternIndex = 0;
const stationaryRocks = {};
const placeRock = (movePattern) => {
  const rocks = getFreshRocks();
  const currentRock = rocks[rockIndex++ % rocks.length];

  updateToRightElevation(currentRock, heighestPoint);

  let shouldFallNextMove = false;
  while (true) {
    if (!shouldFallNextMove) {
      //Gas turn to move the stone left or right

      // we get the gas move
      const moveX = movePattern[movePatternIndex++ % movePattern.length] === ">" ? 1 : -1;

      // we move the rock left or right
      currentRock.forEach((chunk) => (chunk.x += moveX));

      // we check that the move we just did is invalid
      // if so we revert the move
      const collisionResult = collisionCheck(currentRock, stationaryRocks);

      if (collisionResult === "WALL" || collisionResult === "ROCK") currentRock.forEach((chunk) => (chunk.x -= moveX));
    } /* stone falls */ else {
      // move the stone down 1 level
      currentRock.forEach((chunk) => chunk.y--);

      // we check that the move we just did is invalid
      // if so we revert the move & the rock becomes 'stationary'
      const collisionResult = collisionCheck(currentRock, stationaryRocks);
      if (collisionResult === "ROCK" || collisionResult === "FLOOR") {
        // revert move to get right height & add it to the stationary set
        currentRock.forEach((chunk) => (chunk.y++, (stationaryRocks[`${chunk.x},${chunk.y}`] = 1)));

        heighestPoint = getTallestPoint(currentRock, heighestPoint);
        break;
      }
    }

    // flip the condition for falling/moving;
    shouldFallNextMove = !shouldFallNextMove;
  }

  return currentRock;
};

const checkIfRepeatingPattern = (rock) => {
  let pattern = [];

  let minY = Infinity;
  let maxY = 0;

  for (const chunk of rock) {
    minY = Math.min(minY, chunk.y);
    maxY = Math.max(maxY, chunk.y);
  }

  for (let y = minY; y <= maxY; y++) for (let x = 1; x <= 7; x++) if (stationaryRocks[`${x},${y}`]) pattern.push(`x:${x}`);

  for (let y = minY; y <= maxY; y++) {
    let isInRow = true;
    for (let x = 1; x <= 7; x++) {
      if (!stationaryRocks[`${x},${y}`]) {
        isInRow = false;
        break;
      }
    }
    if (isInRow) return pattern;
  }
  return false;
};

const part2 = (movePattern) => {
  let placed = 0;

  let startPoint = 0;
  let startPlaced = 0;

  const patternHash = {};

  while (true) {
    const placedRock = placeRock(movePattern);
    placed++;

    const pattern = checkIfRepeatingPattern(placedRock);

    if (pattern) {
      if (patternHash[pattern.join("")]) {
        const { nextBlock, comingPattern, heighestPointAtHashTime, numberOfRocksPlacedAtHashTime } = patternHash[pattern.join("")];

        if (
          placed % rocks.length === nextBlock &&
          comingPattern ===
            movePattern
              .split("")
              .slice(movePatternIndex % movePattern.length)
              .join("")
        ) {
          startPoint = heighestPointAtHashTime;
          startPlaced = numberOfRocksPlacedAtHashTime;
          break;
        }
      }
      patternHash[pattern.join("")] = {
        nextBlock: placed % rocks.length,
        comingPattern: movePattern
          .split("")
          .slice(movePatternIndex % movePattern.length)
          .join(""),
        heighestPointAtHashTime: heighestPoint,
        numberOfRocksPlacedAtHashTime: placed,
      };
    }
  }

  const remaining = 1_000_000_000_000 - placed;
  const gainedPer = heighestPoint - startPoint;
  const repeatCount = Math.floor(remaining / (placed - startPlaced));
  const gained = repeatCount * gainedPer;
  const remainder = remaining % (placed - startPlaced);

  for (let i = 0; i < remainder; i++) placeRock(movePattern);

  return gained + heighestPoint;
};

let t0 = performance.now();
console.log(part1(data), ` ${performance.now() - t0}`);
t0 = performance.now();
console.log(part2(data), ` ${performance.now() - t0}`);
