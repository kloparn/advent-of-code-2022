import fs from "fs";

const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
// const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

function setupStates(data) {
  const state = {
    points: {},
    routes: {},
  };

  for (const valveInformation of data) {
    const valveName = valveInformation.match(/Valve ([A-Z]+)/)[1];
    const flowRate = parseInt(valveInformation.match(/rate=(\d+)/)[1]);
    const valveInfo = valveInformation.split(" ");
    const leadsToValve = valveInfo.slice(9).map((valveName) => valveName.replace(",", ""));

    state.points[valveName] = flowRate;
    for (const valve of leadsToValve) {
      if (state.routes[valveName]) state.routes[valveName].push(valve);
      else state.routes[valveName] = [valve];
    }
  }

  return state;
}

const valves = setupStates(data);

const dp = {};
function part1(valve, openValves, timeLeft) {
  if (timeLeft === 0) return 0;
  const key = `${valve} ${Object.keys(openValves).sort().join("")} ${timeLeft}`;
  if (dp[key] !== undefined) {
    return dp[key];
  }

  let ans = 0;
  if (timeLeft > 0 && openValves[valve] === undefined && valves.points[valve] > 0) {
    const tempOpenValves = JSON.parse(JSON.stringify(openValves));
    tempOpenValves[valve] = 1;
    ans = Math.max(ans, Object.keys(openValves).reduce((sum, k) => sum + valves.points[k], 0) + part1(valve, tempOpenValves, timeLeft - 1));
  }
  if (timeLeft > 0) {
    for (const v of valves.routes[valve]) {
      ans = Math.max(ans, Object.keys(openValves).reduce((sum, k) => sum + valves.points[k], 0) + part1(v, openValves, timeLeft - 1));
    }
  }
  dp[key] = ans;
  return ans;
}

console.log(valves);

let t0 = performance.now();
// part1();
console.log(part1("AA", {}, 30), ` ${performance.now() - t0}`);
// t0 = performance.now();
// console.log(part2(sensorsAndBeacons, 4_000_000), ` ${performance.now() - t0}`);
