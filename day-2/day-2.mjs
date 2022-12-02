import fs from "fs";

const data = fs.readFileSync("day-2-data", "utf-8");
// const data = fs.readFileSync("example-data", "utf-8");

function getWinningMove(move) {
  switch (move) {
    case "A":
      return "Y";
    case "B":
      return "Z";
    case "C":
      return "X";
  }
}

function getLosingMove(move) {
  switch (move) {
    case "A":
      return "Z";
    case "B":
      return "X";
    case "C":
      return "Y";
  }
}

function getScoreForMove(move) {
  switch (move) {
    case "Y":
    case "B":
      return 2;
    case "X":
    case "A":
      return 1;
    case "Z":
    case "C":
      return 3;
  }
}

function part1() {
  const moves = data.split(/\r\n/);

  let score = 0;

  for (const move of moves) {
    const [aiMove, yourMove] = move.split(/ /);

    if (!aiMove || !yourMove) continue;

    if (getWinningMove(aiMove) === yourMove) {
      score += getScoreForMove(yourMove) + 6;
    } else if (convertAiMove(aiMove) === yourMove) {
      score += getScoreForMove(yourMove) + 3;
    } else {
      score += getScoreForMove(yourMove) + 0;
    }
  }

  return score;
}

function part2() {
  const moves = data.split(/\r\n/);

  let score = 0;

  for (const move of moves) {
    const [aiMove, matchResult] = move.split(/ /);

    if (!aiMove || !matchResult) continue;

    if (matchResult === "Z") {
      score += getScoreForMove(getWinningMove(aiMove)) + 6;
    } else if (matchResult === "Y") {
      score += getScoreForMove(aiMove) + 3;
    } else {
      score += getScoreForMove(getLosingMove(aiMove)) + 0;
    }
  }

  return score;
}

const part1Score = part1();

const part2Score = part2();

console.log(`Your score after part 1: ${part1Score}`);
console.log(`Your score after part 2: ${part2Score}`);
