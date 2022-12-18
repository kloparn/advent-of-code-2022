import fs from "fs";

// const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

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
  // we are out of time, no more paths can be taken from here
  if (timeLeft === 0) return 0;

  const key = `${valve} ${Object.keys(openValves).sort().join("")} ${timeLeft}`;
  if (dp[key] !== undefined) {
    return dp[key];
  }

  let ans = 0;

  if (openValves[valve] === undefined && valves.points[valve] > 0) {
    const tempOpenValves = JSON.parse(JSON.stringify(openValves));
    tempOpenValves[valve] = 1;
    ans = Math.max(ans, (timeLeft - 1) * valves.points[valve] + part1(valve, tempOpenValves, timeLeft - 1));
  }

  for (const v of valves.routes[valve]) {
    ans = Math.max(ans, part1(v, openValves, timeLeft - 1));
  }

  dp[key] = ans;
  return ans;
}

const dp2 = {};
function part2(valve, openValves, timeLeft, otherPlayers) {
  if (timeLeft === 0) {
    // i have ran out of time, now we "reset for the elephant(s) (xd) to do the moves we did not"
    // console.log("elephant starts to traverse");
    return otherPlayers ? part2("AA", openValves, 26, otherPlayers - 1) : 0;
  }

  const key = `${valve} ${Object.keys(openValves).sort().join("")} ${timeLeft} ${otherPlayers}`;
  if (dp2[key] !== undefined) {
    return dp2[key];
  }

  let ans = 0;

  if (openValves[valve] === undefined && valves.points[valve] > 0) {
    const newOpenValves = JSON.parse(JSON.stringify(openValves));
    newOpenValves[valve] = 1;
    ans = Math.max(ans, (timeLeft - 1) * valves.points[valve] + part2(valve, newOpenValves, timeLeft - 1, otherPlayers));
  }

  for (const v of valves.routes[valve]) {
    ans = Math.max(ans, part2(v, openValves, timeLeft - 1, otherPlayers));
  }

  dp2[key] = ans;
  return ans;
}

let t0 = performance.now();
console.log(part1("AA", {}, 30), ` ${performance.now() - t0}`);
t0 = performance.now();
console.log(part2("AA", {}, 26, 1), ` ${performance.now() - t0}`);
