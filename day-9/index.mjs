import fs from "fs";

const moves = fs.readFileSync("data", "utf-8").split(/\r?\n/);
// const movesPart2 = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

// const movesPart2 = fs.readFileSync("data", "utf-8").split(/\r?\n/);
// const movesPart2 = fs.readFileSync("data-part2.example", "utf-8").split(/\r?\n/);

function tailNextToHead(head, tail) {
  return Math.hypot(tail[1] - head[1], tail[0] - head[0]) < 2 ? true : false;
}

function getTailMove(previousRope, currentRope) {
  if (previousRope[0] > currentRope[0]) {
    // previous rope is further to the right than it should be
    if (previousRope[1] > currentRope[1]) {
      // the previous rope is also above the current rope
      return [1, 1];
    } else if (previousRope[1] < currentRope[1]) {
      // the previous rope is also under the current rope
      return [1, -1];
    }
    return [1, 0];
  }
  if (previousRope[0] < currentRope[0]) {
    // previous rope is further to the left than it should be
    if (previousRope[1] > currentRope[1]) {
      // the previous rope is also above the current rope
      return [-1, 1];
    } else if (previousRope[1] < currentRope[1]) {
      // the previous rope is also under the current rope
      return [-1, -1];
    }
    return [-1, 0];
  }
  if (previousRope[1] > currentRope[1]) {
    // Rope is too far up than it should be
    if (previousRope[0] > currentRope[0]) {
      // it is also to far right
      return [1, 1];
    } else if (previousRope[0] < currentRope[0]) {
      // it is also to far left
      return [-1, 1];
    }
    return [0, 1];
  }
  if (previousRope[1] < currentRope[1]) {
    if (previousRope[0] > currentRope[0]) {
      // it is also to far right
      return [1, -1];
    } else if (previousRope[0] < currentRope[0]) {
      // it is also to far left
      return [-1, -1];
    }
    return [0, -1];
  }
}

function part1() {
  // we start at pos 0,0 with both head and the tail0
  const headPosition = [0, 0];
  let tailPosition = [0, 0];

  // We create a hashmap to save all the visited locations for fast indexing later.
  const placesVisited = {};

  for (const move of moves) {
    const [direction, length] = move.split(" ");

    for (let _ = 0; _ < length; _++) {
      switch (direction) {
        case "R":
          headPosition[0]++;
          break;
        case "L":
          headPosition[0]--;
          break;
        case "D":
          headPosition[1]++;
          break;
        case "U":
          headPosition[1]--;
          break;
      }

      if (!tailNextToHead(headPosition, tailPosition)) {
        const nextMove = getTailMove(headPosition, tailPosition);

        tailPosition[0] += nextMove[0];
        tailPosition[1] += nextMove[1];
      }

      placesVisited[tailPosition.join(" ")] = 1;
    }
  }

  return Object.keys(placesVisited).length;
}

function part2() {
  let tailPositions = Array.from({ length: 10 }, (_) => [0, 0]);

  // We create a hashmap to save all the visited locations for fast indexing later.
  const placesVisited = {};

  for (const move of moves) {
    const [direction, length] = move.split(" ");

    for (let _ = 0; _ < length; _++) {
      switch (direction) {
        case "R":
          tailPositions[0][0]++;
          break;
        case "L":
          tailPositions[0][0]--;
          break;
        case "D":
          tailPositions[0][1]++;
          break;
        case "U":
          tailPositions[0][1]--;
          break;
      }

      for (let i = 1; i < tailPositions.length; i++) {
        if (!tailNextToHead(tailPositions[i - 1], tailPositions[i])) {
          const nextMove = getTailMove(tailPositions[i - 1], tailPositions[i], direction);

          tailPositions[i][0] += nextMove[0];
          tailPositions[i][1] += nextMove[1];
        }
      }

      placesVisited[tailPositions[tailPositions.length - 1].join(" ")] = 1;
    }
  }

  return Object.keys(placesVisited).length;
}

console.log(part1());
console.log(part2());
