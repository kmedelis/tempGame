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
        stop = true;
        return;
      }
      
      removeFromArray(openSet, current);
      closedSet.push(current);

      var neighbors = current.neighbors;

      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        var newPath = false;
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
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
