import fs from "fs";

function parseMonkeysInformation() {
  const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
  // const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);
  const monkeys = [];

  for (let i = 0; i < data.length; i += 7) {
    const monkeyStartingItems = [
      ...data[i + 1]
        .split(" ")
        .map((val) => parseInt(val))
        .filter((val) => val),
    ];

    const currentMonkeyIndex = Math.floor(i / 7);

    const monkeyOperation = `${data[i + 2].split(" ").at(-3)} ${data[i + 2].split(" ").at(-2)} ${data[i + 2].split(" ").at(-1)}`;

    const monkeyDivisibleBy = parseInt(data[i + 3].split(" ").at(-1));

    const monkeyIfTrue = parseInt(data[i + 4].match(/throw to monkey (\d+)/)[1]);

    const monkeyIfFalse = parseInt(data[i + 5].match(/throw to monkey (\d+)/)[1]);

    monkeys[currentMonkeyIndex] = {
      items: monkeyStartingItems,
      operation: monkeyOperation,
      test: {
        divisibleBy: monkeyDivisibleBy,
        true: monkeyIfTrue,
        false: monkeyIfFalse,
      },
      inspectionsDone: 0,
    };
  }

  return monkeys;
}

function activateMonkeys(rounds, largeNumbers) {
  const monkeysCopy = JSON.parse(JSON.stringify(monkeys));

  const modulo = monkeysCopy.reduce((val, curr) => val * curr.test.divisibleBy, 1);

  for (let round = 1; round <= rounds; round++) {
    for (const monkey of monkeysCopy) {
      while (monkey.items.length) {
        // while the monkey still has items
        let itemWorryLevel = monkey.items.shift();

        // Monkey inspects the item, worry level is adjusted accodingly
        itemWorryLevel = eval(monkey.operation.replaceAll("old", itemWorryLevel));

        // Item is not destroyed, so we reduce the worry level 3 times rounded down
        itemWorryLevel = largeNumbers ? itemWorryLevel % modulo : Math.floor(itemWorryLevel / 3);

        if (itemWorryLevel % monkey.test.divisibleBy === 0) {
          const throwToMonkey = monkey.test.true;
          monkeysCopy[throwToMonkey].items.push(itemWorryLevel);
        } else {
          const throwToMonkey = monkey.test.false;
          monkeysCopy[throwToMonkey].items.push(itemWorryLevel);
        }

        monkey.inspectionsDone++;
      }
    }
  }

  return monkeysCopy
    .map((monkey) => monkey.inspectionsDone)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((sum, curr) => curr * sum, 1);
}

const monkeys = parseMonkeysInformation();

console.log(activateMonkeys(20));

let t0 = performance.now();
console.log(activateMonkeys(10_000, true), `part two took ${performance.now() - t0} miliseconds`);
