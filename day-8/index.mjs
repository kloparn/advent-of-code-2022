import fs from "fs";

const treeBoard = fs
  .readFileSync("data", "utf-8")
  .split(/\r?\n/)
  .reduce((arr, curr) => (arr = [...arr, [...curr.split("")]]), []);
// const treeBoard = fs
//   .readFileSync("data.example", "utf-8")
//   .split(/\r?\n/)
//   .reduce((arr, curr) => (arr = [...arr, [...curr.split("")]]), []);

function setupHasMap() {
  const treesAlreadySeen = {};
  for (let y = 1; y < treeBoard.length - 1; y++) {
    // We skip first and last cause we do not care about the bottom or top row
    let minHeighRight = treeBoard[y][treeBoard[y].length - 1];
    let minHeigtLeft = treeBoard[y][0];

    // we check from the right side to left
    for (let x = treeBoard[y].length - 1; x > 0; x--) {
      const treeHeight = treeBoard[y][x];
      if (treeHeight > minHeighRight && !treesAlreadySeen[`${y} , ${x}`]) {
        minHeighRight = treeHeight;
        treesAlreadySeen[`${y} , ${x}`] = treeHeight;
      } else if (treeHeight > minHeighRight) {
        minHeighRight = treeHeight;
      }
    }

    // we check from the left side to right
    for (let x = 1; x < treeBoard[y].length - 1; x++) {
      const treeHeight = treeBoard[y][x];
      if (treeHeight > minHeigtLeft && !treesAlreadySeen[`${y} , ${x}`]) {
        minHeigtLeft = treeHeight;
        treesAlreadySeen[`${y} , ${x}`] = treeHeight;
      } else if (treeHeight > minHeigtLeft) {
        minHeigtLeft = treeHeight;
      }
    }
  }

  for (let x = 1; x < treeBoard[0].length - 1; x++) {
    let minHeightDown = treeBoard[0][x];

    // we check from the top and down
    for (let y = 1; y < treeBoard.length - 1; y++) {
      const tree = treeBoard[y][x];
      if (tree > minHeightDown && !treesAlreadySeen[`${y} , ${x}`]) {
        minHeightDown = tree;
        treesAlreadySeen[`${y} , ${x}`] = tree;
      } else if (tree > minHeightDown) {
        minHeightDown = tree;
      }
    }
  }

  for (let x = 1; x < treeBoard[0].length - 1; x++) {
    let minHeightUp = treeBoard[treeBoard.length - 1][x];
    // we check from the bottom and up
    for (let y = treeBoard.length - 2; y > 0; y--) {
      const tree = treeBoard[y][x];
      if (tree > minHeightUp && !treesAlreadySeen[`${y} , ${x}`]) {
        minHeightUp = tree;
        treesAlreadySeen[`${y} , ${x}`] = tree;
      } else if (tree > minHeightUp) {
        minHeightUp = tree;
      }
    }
  }

  return treesAlreadySeen;
}

const seenTreeshashmap = setupHasMap();

function part1() {
  return Object.keys(seenTreeshashmap).length + treeBoard.length * 2 + treeBoard[0].length * 2 - 4;
}

function part2() {
  const scenaticScoreMap = {};
  for (let y = 1; y < treeBoard.length - 1; y++) {
    for (let x = 1; x < treeBoard[y].length - 1; x++) {
      let up = 0,
        down = 0,
        right = 0,
        left = 0;

      const MaxTreeSize = treeBoard[y][x];

      // up
      for (let i = y - 1; i >= 0; i--) {
        if (MaxTreeSize > treeBoard[i][x]) up++;
        else {
          up++;
          break;
        }
      }
      // down
      for (let i = y + 1; i < treeBoard.length; i++) {
        if (MaxTreeSize > treeBoard[i][x]) down++;
        else {
          down++;
          break;
        }
      }

      // left
      for (let i = x - 1; i >= 0; i--) {
        if (MaxTreeSize > treeBoard[y][i]) left++;
        else {
          left++;
          break;
        }
      }
      // right
      for (let i = x + 1; i < treeBoard[y].length; i++) {
        if (MaxTreeSize > treeBoard[y][i]) right++;
        else {
          right++;
          break;
        }
      }

      scenaticScoreMap[`${y}, ${x}`] = up * down * left * right;
    }
  }

  return Object.values(scenaticScoreMap).sort((a, b) => b - a)[0];
}

console.log(part1());
console.log(part2());
