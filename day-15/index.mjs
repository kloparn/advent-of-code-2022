import fs from "fs";

const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
// const data = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

function setupSensorAndBeaconData(data) {
  const beaconsAndSensors = [];
  for (const dataInformation of data) {
    const [sensorX, sensorY, beaconX, beaconY] = dataInformation.match(/-?[0-9]\d*(\.\d+)?/g);

    beaconsAndSensors.push({
      sensor: { x: parseInt(sensorX), y: parseInt(sensorY) },
      beacon: { x: parseInt(beaconX), y: parseInt(beaconY) },
      distance: getDistance(sensorX, sensorY, beaconX, beaconY),
    });
  }

  return beaconsAndSensors;
}

function getDistance(sensorX, sensorY, beaconX, beaconY) {
  return Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
}

function getIntersectionsForRow(sensorsAndBeacons, row) {
  const sensors = [];

  for (const { sensor, distance } of sensorsAndBeacons) {
    if (Math.abs(row - sensor.y) < distance) {
      const distanceToY = Math.abs(row - sensor.y);
      sensors.push([sensor.x - (distance - distanceToY), sensor.x + (distance - distanceToY)]);
    }
  }

  // we sort it from biggest to largest as we go left to right in future checks
  return sensors.sort((a, b) => a[0] - b[0]);
}

function part1(sensorsAndBeacons, row) {
  const coveredXRanges = getIntersectionsForRow(sensorsAndBeacons, row);

  let coveredCount = 0;

  // coveredRanges are sorted from smallest to biggest, so this range counting works
  let [start, end] = coveredXRanges.shift();

  for (const [rangeStart, rangeEnd] of coveredXRanges) {
    if (rangeStart > end) {
      coveredCount += end - start + 1;
      start = rangeStart;
      end = rangeEnd;
    } else if (rangeEnd > end) {
      end = rangeEnd;
    }
  }

  // this is the covered amount on the row, but we have so far not "excluded" the beacons on the row!
  coveredCount += end - start + 1;

  // Some of the sensors has the same beacon as their closest one, so we want only unique beacons
  const uniqueBeacons = sensorsAndBeacons.reduce(
    (beacons, currSensorAndBeacon) =>
      !beacons[`${currSensorAndBeacon.beacon.x},${currSensorAndBeacon.beacon.y}`]
        ? { ...beacons, [`${currSensorAndBeacon.beacon.x},${currSensorAndBeacon.beacon.y}`]: currSensorAndBeacon.beacon }
        : beacons,
    {}
  );

  const beaconsOnRow = Object.values(uniqueBeacons).filter((beacon) => beacon.y === row).length;

  return coveredCount - beaconsOnRow;
}

function part2(sensorsAndBeacons, MAX_ROW) {
  for (let row = 0; row < MAX_ROW; row++) {
    const coveredXRanges = getIntersectionsForRow(sensorsAndBeacons, row);

    let end = coveredXRanges.shift()[1];

    const emptySpaceColumn = coveredXRanges.reduce((emptySpace, currRange) => {
      for (const [rangeStart, rangeEnd] of coveredXRanges) {
        if (rangeStart > end) return rangeStart - 1; // we have found the "empty" spot for the beacon
        else if (rangeEnd > end) end = rangeEnd;
      }

      return emptySpace;
    }, null);

    if (emptySpaceColumn) {
      return emptySpaceColumn * MAX_ROW + row;
    }
  }
}

const sensorsAndBeacons = setupSensorAndBeaconData(data);

let t0 = performance.now();
console.log(part1(sensorsAndBeacons, 10), ` ${performance.now() - t0}`);
t0 = performance.now();
console.log(part2(sensorsAndBeacons, 4_000_000), ` ${performance.now() - t0}`);
