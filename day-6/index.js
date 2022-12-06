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

// Only way seems odd of handing stuff, the 'onlyUniqueCharacters' function did what [... new Set()] does so i rewrote everything!

// much shorter and with less complexity :D 


function tuningTrouble(n) {
  for (let i = n; i < signal.length; i++) {
    const signalBuffer = signal.slice(n - 3, n);
    if ([...new Set(signalBuffer)] === signalBuffer.length) return i + 1;
  }
}

console.log(tuningTrouble(4));

console.log(tuningTrouble(14));
