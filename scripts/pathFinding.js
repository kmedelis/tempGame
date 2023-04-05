var openSet = [];
var closedSet = [];
var path = [];

function pathFinding() {
  if (openSet.length > 0) {
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];
    if (current === end) {
      path.unshift(current);
      stop = true;
      return;
    }
    
    removeFromArray(openSet, current);
    closedSet.push(current);
    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      var newPath = false;
      if (!closedSet.includes(neighbor) && (neighbor === end || neighbor.type !== "wall" && neighbor.type !== "gold" && neighbor.type !== "player")) {
        var tempG = current.g + 1;
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if(newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  } else {
    stop = true;
    return;
  }
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
}


function heuristic(a, b) {
    let d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    return d;
}

function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function BFS(startRow, startCol, maxDistance, grid, gridSize) {
  var visited = new Set();
  var changedElements = [];

  for (var rowOffset = -maxDistance; rowOffset <= maxDistance; rowOffset++) {
    for (var colOffset = -maxDistance; colOffset <= maxDistance; colOffset++) {
      var newRow = startRow + rowOffset;
      var newCol = startCol + colOffset;

      if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        var key = newRow + "," + newCol;
        if (!visited.has(key)) {
          visited.add(key);
          if (grid[newRow][newCol].type === null) {
            var element = grid[newRow][newCol];
            element.color = "#4169E1";
            element.type = "walkable";
            changedElements.push(element);
          }
        }
      }
    }
  }

  return changedElements;
}

// algorithm for penalizing istriz movement
// function BFS(startRow, startCol, maxDistance, grid, gridSize) {
//   var queue = [];
//   var visited = new Set();
//   var distance = new Array(gridSize);
//   for (var i = 0; i < gridSize; i++) {
//     distance[i] = new Array(gridSize);
//   }

//   queue.push([startRow, startCol]);
//   visited.add(startRow + "," + startCol);
//   distance[startRow][startCol] = 0;

//   var changedElements = []; 

//   while (queue.length > 0) {
//     var current = queue.shift();
//     var currentRow = current[0];
//     var currentCol = current[1];

//     var neighbors = [];
//     if (currentRow > 0) neighbors.push([currentRow - 1, currentCol]);
//     if (currentRow < gridSize - 1) neighbors.push([currentRow + 1, currentCol]);
//     if (currentCol > 0) neighbors.push([currentRow, currentCol - 1]);
//     if (currentCol < gridSize - 1) neighbors.push([currentRow, currentCol + 1]);

//     for (var i = 0; i < neighbors.length; i++) {
//       var neighbor = neighbors[i];
//       var neighborRow = neighbor[0];
//       var neighborCol = neighbor[1];

//       if (!visited.has(neighborRow + "," + neighborCol)) {
//         visited.add(neighborRow + "," + neighborCol);
//         queue.push([neighborRow, neighborCol]);
//         distance[neighborRow][neighborCol] = distance[currentRow][currentCol] + 1;
//         if (distance[neighborRow][neighborCol] <= maxDistance && grid[neighborRow][neighborCol].type == null) {
//           var element = grid[neighborRow][neighborCol];
//           element.color = "#4169E1"; 
//           element.type = "walkable";
//           changedElements.push(element); 
//         }
//       }
//     }
//   }

//   return changedElements; 
// }




