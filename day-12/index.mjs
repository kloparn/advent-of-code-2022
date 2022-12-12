import fs from "fs";

import findShortestPath from "./helper.mjs";

const grid = fs
  .readFileSync("data", "utf-8")
  .split(/\r?\n/)
  .map((row) => row.split(""));

// const grid = fs
//   .readFileSync("data.example", "utf-8")
//   .split(/\r?\n/)
//   .map((row) => row.split(""));

const characterHashmap = [..."SabcdefghijklmnopqrstuvwxyzE".split("")].reduce(
  (hashmap, currChar, index) => (hashmap = { ...hashmap, [index]: currChar }),
  {}
);

function updatePosition(instructions, position) {
  for (const direction of instructions) {
    switch (direction) {
      case "North":
        position[0]--;
        break;
      case "East":
        position[1]++;
        break;
      case "South":
        position[0]++;
        break;
      case "West":
        position[1]--;
        break;
    }
  }

  return position;
}

function part1(grid) {
  const startArrayIndex = grid.findIndex((arr) => arr.find((char) => char === "S"));

  const startPositionIndex = grid[startArrayIndex].findIndex((char) => char === "S");

  let currentPosition = [startArrayIndex, startPositionIndex];

  let totalSteps = 0;

  let currentCharacter = characterHashmap[0];

  for (let elevationLevel = 0; elevationLevel < Object.keys(characterHashmap).length; elevationLevel++) {
    let goalCharacter = characterHashmap[elevationLevel + 1];

    console.log({ currentCharacter, goalCharacter });

    if (!goalCharacter) break;

    const freshGrid = JSON.parse(JSON.stringify(grid));

    let pathInstructions = findShortestPath(currentPosition, freshGrid, currentCharacter, goalCharacter);

    if (!pathInstructions) {
      let indexBackwards = 2;
      while (true) {
        const newCurrentCharacter = currentCharacter;
        const newGoalCharacter = characterHashmap[elevationLevel - indexBackwards];
        const newFreshGrid = JSON.parse(JSON.stringify(grid));
        indexBackwards++;

        pathInstructions = findShortestPath(currentPosition, newFreshGrid, newCurrentCharacter, newGoalCharacter);

        if (pathInstructions) {
          goalCharacter = newGoalCharacter;
          break;
        }
      }
      elevationLevel += indexBackwards * -1;
    }

    totalSteps += pathInstructions.length;

    console.log({ pathInstructions, currentCharacter, goalCharacter, currentPosition });

    currentPosition = updatePosition(pathInstructions, currentPosition);
    currentCharacter = goalCharacter;
  }
  console.log(totalSteps);
}

part1(grid);
