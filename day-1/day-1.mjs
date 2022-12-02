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

// const mostCaloriesSorted = (await fs.readFile("day-1-data", "utf-8")).split("\r\n").reduce((total, curr) => curr.length === 0 ? total.concat([0]) : total.map((value, index) => index + 1 === total.length ? value + parseInt(curr) : value) , []).sort((a, b) => b - a);

const a = (await fs.readFile("day-1-data", "utf-8")).split("\r\n").reduce((b, c) => c.length === 0 ? b.concat([0]) : b.map((d, e) => e + 1 === b.length ? d + parseInt(c) : d) , []).sort((f, g) => g - f);

console.log(`most calories: ${a[0]}`);

console.log(
  `Calories in total of the top 3 elves: ${a[0] + a[1] + a[2]}`
);
