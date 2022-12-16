import fs from "fs";

const data = fs.readFileSync("data", "utf-8").split(/\r?\n/);
const dataExample = fs.readFileSync("data.example", "utf-8").split(/\r?\n/);

function buildGraph(data) {
  // const REALLY_SMALL_NUMBER = -123456789;
  // const REALLY_HUGE_NUMBER = Infinity;

  const graphInformation = [];
  for (const dataInformation of data) {
    const [sensorX, sensorY, beaconX, beaconY] = dataInformation.match(/-?[0-9]\d*(\.\d+)?/g);

    graphInformation.push({ sensor: { x: parseInt(sensorX), y: parseInt(sensorY) }, closeBeacon: { x: parseInt(beaconX), y: parseInt(beaconY) } });
    // graphInformation.push({ sensor: { x: parseInt(sensorX), y: parseInt(sensorY) } });
    // graphInformation.push({ beacon: { x: parseInt(beaconX), y: parseInt(beaconY) } });
  }

  console.log(graphInformation);

  // getting min first then standarizing the data for easier handling later on with negative values.
  // const minX = graphInformation.reduce((value, obj) => Math.min(obj.sensor.x, obj.beacon.x, value), REALLY_HUGE_NUMBER);
  // const minY = graphInformation.reduce((value, obj) => Math.min(obj.sensor.y, obj.beacon.y, value), REALLY_HUGE_NUMBER);

  // standardizedXValue = minX < 0 ? minX : 0;
  // standardizedYValue = minY < 0 ? minY : 0;

  // graphInformation.forEach((obj) => {
  //   if (standardizedXValue < 0) {
  //     obj.sensor.x += Math.abs(standardizedXValue);
  //     obj.beacon.x += Math.abs(standardizedXValue);
  //   }
  //   if (standardizedYValue < 0) {
  //     obj.sensor.y += Math.abs(standardizedYValue);
  //     obj.beacon.y += Math.abs(standardizedYValue);
  //   }
  //   return obj;
  // });

  // const maxX = graphInformation.reduce((value, obj) => Math.max(obj.sensor.x, obj.beacon.x, value), REALLY_SMALL_NUMBER) + 1;
  // const maxY = graphInformation.reduce((value, obj) => Math.max(obj.sensor.y, obj.beacon.y, value), REALLY_SMALL_NUMBER) + 1;

  // const graph = Array.from({ length: maxY }, () => Array.from({ length: maxX }, (_, idx) => ""));

  // console.log("Done building the graph");

  // for (const fillStep of graphInformation) {
  //   graph[fillStep.sensor.y][fillStep.sensor.x] = "S";
  //   graph[fillStep.beacon.y][fillStep.beacon.x] = "B";
  // }

  // console.log("filled graph");

  // prettyPrint(graph);

  return graphInformation;
}

function prettyPrint(graph) {
  graph.forEach((row) => console.log(JSON.stringify(row).replaceAll('"', "").replaceAll(",", " ")));
}

function exampleRun(caveSystem) {
  // console.log(dataExample);

  /* psudo code
  Get distance between min X and max X to determine the MAXIMUM places beacons can exist on a row.
  create SINGLE dimension array with the distance with each slot as empty or ".".
  Loop through all beacons and sensor values
    Check if their positions in someway intercept the row we are given.
      If it does intercept, calculate the height after the interception on the opposite side of the sensor
      take the distance between the interception point and reduce it by 1 then add it to the place of interception.
      like this -> row[interceptionPoint - (distanceOfInterceptionToBeacon - 1)] = "#" to row[interceptionPoint + (distanceOfInterceptionToBeacon - 1)] = "#"
      then repeat until empty

      if it does not, skip to next sensor / beacon.
  Get amount of slots in the created array that has the value "#"
  */

  return 0;
}

const sensorsAndBeacons = buildGraph(dataExample);
// const sensorsAndBeacons = buildGraph(data);

console.log(exampleRun(sensorsAndBeacons));

// let t0 = performance.now();
// console.log(part1(caveCopyForPart1, dripPointPart1), ` ${performance.now() - t0}`);
// t0 = performance.now();
// console.log(part2(caveCopyForPart2, dripPointPart2), ` ${performance.now() - t0}`);
