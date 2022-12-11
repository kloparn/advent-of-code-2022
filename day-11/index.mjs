import fs from "fs";

function parseMonkeysInformation() {
  const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
  // const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);
  const monkeys = [];

  let currentMonkey = 0;

  for (let i = 0; i < data.length; i += 7) {
    const monkeyStartingItems = [
      ...data[i + 1]
        .split(" ")
        .map((val) => parseInt(val))
        .filter((val) => val),
    ];

    const monkeyOperation = `${data[i + 2].split(" ").at(-3)} ${data[i + 2].split(" ").at(-2)} ${data[i + 2].split(" ").at(-1)}`;

    const monkeyDivisibleBy = parseInt(data[i + 3].split(" ").at(-1));

    const monkeyIfTrue = parseInt(data[i + 4].match(/throw to monkey (\d+)/)[1]);

    const monkeyIfFalse = parseInt(data[i + 5].match(/throw to monkey (\d+)/)[1]);

    monkeys[currentMonkey] = {
      items: monkeyStartingItems,
      operation: monkeyOperation,
      test: {
        divisibleBy: monkeyDivisibleBy,
        true: monkeyIfTrue,
        false: monkeyIfFalse,
      },
      inspectionsDone: 0,
    };

    currentMonkey++;
  }

  return monkeys;
}

function part1(rounds) {
  const monkeysCopy = JSON.parse(JSON.stringify(monkeys));

  for (let round = 1; round <= rounds; round++) {
    for (const monkey of monkeysCopy) {
      while (monkey.items.length) {
        // while the monkey still has items
        let itemWorryLevel = monkey.items.shift();

        // Monkey inspects the item, worry level is adjusted accodingly
        itemWorryLevel = eval(monkey.operation.replaceAll("old", itemWorryLevel));

        // Item is not destroyed, so we reduce the worry level 3 times rounded down
        itemWorryLevel = Math.floor(itemWorryLevel / 3);

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

function part2(rounds) {
  const monkeysCopy = JSON.parse(JSON.stringify(monkeys));

  let modulo = 1;

  // As the numbers are increadibly big after a point we can add all the divisible numbers together to create a more "unified" modulo.
  // This in turn is much easier to handle and we keep the "integrity" of the original numbers size.
  monkeysCopy.forEach((monkey) => (modulo *= monkey.test.divisibleBy));

  // we set a timer to get the perfomance of the function.
  let t0 = performance.now();

  for (let round = 1; round <= rounds; round++) {
    for (const monkey of monkeysCopy) {
      while (monkey.items.length) {
        // while the monkey still has items
        let itemWorryLevel = monkey.items.shift();

        // Monkey inspects the item, worry level is adjusted accodingly
        itemWorryLevel = eval(monkey.operation.replaceAll("old", itemWorryLevel));

        // We reduce by the global modulo
        itemWorryLevel = itemWorryLevel % modulo;

        if (itemWorryLevel % monkey.test.divisibleBy === 0) {
          const throwToMonkey = monkey.test.true;
          // as it is divisible by the test number we divide then another monkey gets it
          // itemWorryLevel = itemWorryLevel / monkey.test.divisibleBy;

          monkeysCopy[throwToMonkey].items.push(itemWorryLevel);
        } else {
          const throwToMonkey = monkey.test.false;

          monkeysCopy[throwToMonkey].items.push(itemWorryLevel);
        }

        // This monkey has now inspected an item so we increment its actions done
        monkey.inspectionsDone++;
      }
    }
  }

  let t1 = performance.now();

  console.log("execution time for part 2: ", t1 - t0, " miliseconds");

  return monkeysCopy
    .map((monkey) => monkey.inspectionsDone)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((sum, curr) => curr * sum, 1);
}

const monkeys = parseMonkeysInformation();
console.log(part1(20));
console.log(part2(10_000));
