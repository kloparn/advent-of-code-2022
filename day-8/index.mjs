import fs from "fs";

const treeBoard = fs
  .readFileSync("data", "utf-8")
  .split(/\r?\n/)
  .reduce((arr, curr) => (arr = [...arr, [...curr.split("")]]), []);
// const treeBoard = fs
//   .readFileSync("data.example", "utf-8")
//   .split(/\r?\n/)
//   .reduce((arr, curr) => (arr = [...arr, [...curr.split("")]]), []);

function part1() {
  const treesAlreadySeen = {};

  for (let y = 1; y < treeBoard.length - 1; y++) {
    // We skip first and last cause we do not care about the bottom or top row
    let minHeighRight = treeBoard[y][treeBoard[y].length - 1];
    let minHeigtLeft = treeBoard[y][0];

    // console.log({ minHeighRight, minHeigtLeft, minHeighUp, minHeighDown });

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

  console.log(treesAlreadySeen);

  return Object.keys(treesAlreadySeen).length + treeBoard.length * 2 + treeBoard[0].length * 2 - 4;
}

console.log(part1());
