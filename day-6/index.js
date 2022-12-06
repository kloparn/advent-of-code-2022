import fs from "fs";

const signal = fs.readFileSync("data", "utf-8").split("");
// const signal = fs.readFileSync("data.example", "utf-8").split("");

function onlyUniqueCharacters(arr) {
  return (
    arr.reduce((chars, char) => (chars.includes(char) ? chars : [...chars, char]), []).length === arr.length
  );
}

function part1() {
  for (let i = 3; i < signal.length; i++) {
    const signalBuffer = [signal[i - 3], signal[i - 2], signal[i - 1], signal[i]];
    if (onlyUniqueCharacters(signalBuffer)) return i + 1;
  }
}

function part2() {
  const signalCopy = [...signal];
  const signalBuffer = signalCopy.splice(0, 14);

  return signalCopy.reduce((signalStrength, curr) => {
    if (onlyUniqueCharacters(signalBuffer)) return signalStrength;
    signalBuffer.shift();
    signalStrength++;
    signalBuffer.push(curr);
    return signalStrength;
  }, 14);
}

console.log(part1());

console.log(part2());
