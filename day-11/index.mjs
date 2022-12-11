import fs from "fs";

function parseMonkeysInformation() {
  const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
  // const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);
  const monkeys = [];

  let currentMonkey = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i] === "") {
      currentMonkey++;
      continue;
    }

    const info = data[i].match(/: (.+)/);

    if (!info) {
      monkeys[currentMonkey] = { monkeyId: currentMonkey, inspectionsDone: 0 };
      continue;
    }

    const beforeInfo = data[i].match(/(.+):/)[1];

    if (beforeInfo.includes("Starting items")) {
      monkeys[currentMonkey].items = [...info[1].split(" ").map((val) => parseInt(val))];
      continue;
    }

    if (beforeInfo.includes("Operation")) {
      const operationInfo = info[1].split(" ");
      const value1 = operationInfo.at(-3);
      const operationType = operationInfo.at(-2);
      const value2 = operationInfo.at(-1);

      monkeys[currentMonkey].operation = `${value1} ${operationType} ${value2}`;

      continue;
    }

    if (beforeInfo.includes("Test")) {
      const divisibleBy = parseInt(info[1].split(" ").at(-1));
      const ifTrue = parseInt(data[i + 1].match(/throw to monkey (\d+)/)[1]);
      const ifFalse = parseInt(data[i + 2].match(/throw to monkey (\d+)/)[1]);

      monkeys[currentMonkey].test = {
        divisibleBy,
        true: ifTrue,
        false: ifFalse,
      };

      i += 2; // We are taking three chunks of data in the if clause.
      continue;
    }
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
