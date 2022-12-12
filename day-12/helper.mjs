function findShortestPath(startCordinates, grid, currentCharacter, goal) {
  const distanceFromTop = startCordinates[0];
  const distanceFromLeft = startCordinates[1];

  const location = {
    distanceFromTop,
    distanceFromLeft,
    path: [],
    status: "start",
  };

  const queue = [location];

  while (queue.length > 0) {
    const currentLocation = queue.shift();

    let newLocation;

    // Explore East
    newLocation = exploreInDirection(currentLocation, "East", grid, currentCharacter, goal);

    if (newLocation.status === "Goal") {
      return newLocation.path;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore South
    newLocation = exploreInDirection(currentLocation, "South", grid, currentCharacter, goal);

    if (newLocation.status === "Goal") {
      return newLocation.path;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore North
    newLocation = exploreInDirection(currentLocation, "North", grid, currentCharacter, goal);
    if (newLocation.status === "Goal") {
      return newLocation.path;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore West
    newLocation = exploreInDirection(currentLocation, "West", grid, currentCharacter, goal);
    if (newLocation.status === "Goal") {
      return newLocation.path;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }
  }

  // Cannot find a path
  return false;
}

function locationStatus(location, grid, currentCharacter, characterGoal) {
  const dft = location.distanceFromTop;
  const dfl = location.distanceFromLeft;
  const gridHeight = grid.length;
  const gridWidth = grid[0].length;

  if (
    location.distanceFromLeft < 0 ||
    location.distanceFromLeft >= gridWidth ||
    location.distanceFromTop < 0 ||
    location.distanceFromTop >= gridHeight
  ) {
    // location is not on the grid--return false
    return "Invalid";
  } else if (grid[dft][dfl] === characterGoal) {
    return "Goal";
  } else if (grid[dft][dfl] !== currentCharacter) {
    // location is either an obstacle or has been visited
    return "Blocked";
  } else {
    return "Valid";
  }
}

function exploreInDirection(currentLocation, direction, grid, currentCharacter, goal) {
  const newPath = currentLocation.path.slice();
  newPath.push(direction);

  let dft = currentLocation.distanceFromTop;
  let dfl = currentLocation.distanceFromLeft;

  if (direction === "North") {
    dft -= 1;
  } else if (direction === "East") {
    dfl += 1;
  } else if (direction === "South") {
    dft += 1;
  } else if (direction === "West") {
    dfl -= 1;
  }

  const newLocation = {
    distanceFromTop: dft,
    distanceFromLeft: dfl,
    path: newPath,
    status: "Unknown",
  };

  newLocation.status = locationStatus(newLocation, grid, currentCharacter, goal);

  // If this new location is valid, mark it as 'Visited'
  if (newLocation.status === "Valid") {
    grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
  }

  return newLocation;
}

export default findShortestPath;
