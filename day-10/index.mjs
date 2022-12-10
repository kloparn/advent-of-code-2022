import fs from "fs";

const instructions = fs.readFileSync("data", "utf-8").split(/\r?\n/);
// const instructions = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

function getCrtIndexPosition(currentCycle) {
  return Math.floor(currentCycle / 40);
}

function canDraw(signal, crtCycle) {
  return crtCycle >= signal - 1 && crtCycle <= signal + 1;
}

function handleCycle(currentCycle, cycleAmount, x, totalSignal, crt, crtCycle) {
  let signalStrenght = 0;

  for (let i = 0; i < cycleAmount; i++) {
    currentCycle++;
    const crtRowIndex = getCrtIndexPosition(currentCycle);
    if (currentCycle === 20 || currentCycle === 60 || currentCycle === 100 || currentCycle === 140 || currentCycle === 180 || currentCycle === 220) {
      signalStrenght += currentCycle * totalSignal;
    }
    if (crt) {
      if (crtRowIndex < crt.length) {
        if (canDraw(totalSignal, crtCycle % 40)) {
          crt[crtRowIndex][crtCycle % 40] = "#";
        }
      }

      crtCycle++;
    }
    if ((i + 1) % 2 === 0) totalSignal += x;
  }

  return [currentCycle, totalSignal, signalStrenght, crt, crtCycle];
}

function part1() {
  let signalStrenghts = [];
  let currentCycle = 0;
  let totalSignal = 1;
  for (const instruction of instructions) {
    const [command, amount] = instruction.split(" ");

    if (command === "noop") {
      const [newCycle, newTotal, signalStrenght] = handleCycle(currentCycle, 1, 0, totalSignal);
      currentCycle = newCycle;
      totalSignal = newTotal;
      if (signalStrenght) signalStrenghts.push(signalStrenght);
    } else {
      const [newCycle, newTotal, signalStrenght] = handleCycle(currentCycle, 2, parseInt(amount), totalSignal);
      currentCycle = newCycle;
      totalSignal = newTotal;
      if (signalStrenght) signalStrenghts.push(signalStrenght);
    }
  }
  return signalStrenghts.reduce((sum, num) => sum + num, 0);
}

function part2() {
  let crt = Array.from({ length: 6 }, () => Array.from({ length: 40 }, (_) => "."));
  let currentCycle = 0;
  let totalSignal = 1;
  let crtCycle = 0;

  for (const instruction of instructions) {
    const [command, amount] = instruction.split(" ");

    if (command === "noop") {
      const [newCycle, newTotal, signalStrenght, newCrt, newCrtCycle] = handleCycle(currentCycle, 1, 0, totalSignal, crt, crtCycle);
      currentCycle = newCycle;
      totalSignal = newTotal;
      crt = [...newCrt];
      crtCycle = newCrtCycle;
    } else {
      const [newCycle, newTotal, signalStrenght, newCrt, newCrtCycle] = handleCycle(currentCycle, 2, parseInt(amount), totalSignal, crt, crtCycle);
      currentCycle = newCycle;
      totalSignal = newTotal;
      crt = [...newCrt];
      crtCycle = newCrtCycle;
    }
  }
  return crt;
}

console.log(part1());
console.log(part2()); // This outputs the arrays to the console, then i transfer it to a json file and format it, and thus get a readable output
