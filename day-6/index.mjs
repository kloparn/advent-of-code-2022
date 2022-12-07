import fs from "fs";

const signal = fs.readFileSync("data", "utf-8").split("");
// const signal = fs.readFileSync("data.example", "utf-8").split("");

function tuningTrouble(n) {
  for (let i = 0; i < signal.length - n; i++) {
    const signalBuffer = signal.slice(i, i + n);
    if ([...new Set(signalBuffer)].length === signalBuffer.length) return i + n;
  }
}

console.log(tuningTrouble(4));

console.log(tuningTrouble(14));
