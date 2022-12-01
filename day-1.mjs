import fs from "fs/promises";

// const mostCaloriesSorted = (await fs.readFile("day-1-data", "utf-8"))
//   .split("\r\n")
//   .reduce(
//     (total, curr) => {
//       if (curr.length === 0) return total.concat([0]);
//       total[total.length - 1] = parseInt(curr) + total.at(-1);
//       return total;
//     },
//     [0]
//   )
//   .sort((a, b) => b - a);

const mostCaloriesSorted = (await fs.readFile("day-1-data", "utf-8")).split("\r\n").reduce((total, curr) => curr.length === 0 ? total.concat([0]) : total.map((value, index) => index + 1 === total.length ? value + parseInt(curr) : value) , []).sort((a, b) => b - a);

console.log(`most calories: ${mostCaloriesSorted[0]}`);

console.log(
  `Calories in total of the top 3 elves: ${mostCaloriesSorted[0] + mostCaloriesSorted[1] + mostCaloriesSorted[2]}`
);
