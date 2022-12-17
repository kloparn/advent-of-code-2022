import fs from "fs";

// const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

function getValveInformation(data) {
  const valves = {};

  for (const valveInformation of data) {
    const valveName = valveInformation.match(/Valve ([A-Z]+)/)[1];
    const flowRate = parseInt(valveInformation.match(/rate=(\d+)/)[1]);
    const valveInfo = valveInformation.split(" ");
    const leadsToValve = valveInfo.slice(9).map((valveName) => valveName.replace(",", ""));

    valves[valveName] = {
      status: flowRate === 0 ? "open" : "closed",
      flowRate,
      leadsToValve,
    };
  }

  return valves;
}

function getBestPathToTake(valves, currValve) {
  let bestPath = currValve.leadsToValve.reduce((path, currPath) => {
    const tempValve = valves[currPath];

    if (tempValve.status === "closed" && (tempValve?.flowRate > path[1]?.flowRate || !path[1])) {
      path = currPath;
    }

    return path;
  }, "");

  return bestPath.length > 0 ? bestPath : null;
}

function part1(valves, minutes) {
  const elephantStartRoom = "AA";
  let currentValveName = elephantStartRoom;
  let totalPressureReleased = 0;
  let releaseRate = 0;
  for (let timeLeft = minutes - 1; timeLeft >= 0; timeLeft--) {
    totalPressureReleased += releaseRate;

    const currentValve = valves[currentValveName];

    console.log({ currentValve, currentValveName, timeLeft, totalPressureReleased, releaseRate });

    // we check if we find a path that is bigger than the one we are currently on!
    const nextPath = getBestPathToTake(valves, currentValve);
    if (nextPath && currentValve.flowRate < valves[nextPath].flowRate) {
      currentValveName = nextPath;
      continue;
    }

    // if the current valve we are standing at is open we close it and continue;
    if (currentValve.status === "closed") {
      currentValve.status = "open";
      releaseRate += currentValve.flowRate;
      continue;
    }

    // the valve we are at is open so we go to the next one
    if (currentValve.status === "open") {
      const bestPathName = getBestPathToTake(valves, currentValve);

      // const // we move to the location

      currentValveName = bestPathName;
      // console.log({ currentValve, timeLeft, bestPath, valve });
    }
  }

  return totalPressureReleased;
}

const valves = getValveInformation(data);

// console.log(valves);

let t0 = performance.now();
console.log(part1(valves, 30), ` ${performance.now() - t0}`);
// t0 = performance.now();
// console.log(part2(sensorsAndBeacons, 4_000_000), ` ${performance.now() - t0}`);
