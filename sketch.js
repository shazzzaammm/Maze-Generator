var cols;
var rows;
var s = 40;
var grid = [];
var current;
var end;
var stack = [];
function getIndex(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}
function removeWalls(a, b) {
  let x = a.i - b.i;
  let y = a.j - b.j;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
class cell {
  constructor(i, j) {
    this.x = i * s;
    this.y = j * s;
    this.i = i;
    this.j = j;
    this.visited = false;
    this.walls = [true, true, true, true]; //top right bottom left
    this.show = function () {
      stroke(255);
      strokeWeight(2);
      if (this.walls[0]) line(this.x, this.y, this.x + s, this.y); //
      if (this.walls[1]) line(this.x + s, this.y, this.x + s, this.y + s); //
      if (this.walls[2]) line(this.x + s, this.y + s, this.x, this.y + s); //
      if (this.walls[3]) line(this.x, this.y + s, this.x, this.y); //
      if (this.visited) {
        noStroke();
        fill(255, 0, 110);
        rect(this.x, this.y, s, s);
      }
    };
    this.checkNeighbors = function () {
      var neighbors = [];
      this.visited = true;
      var top = grid[getIndex(i, j + 1)];
      var right = grid[getIndex(i + 1, j)];
      var bottom = grid[getIndex(i, j - 1)];
      var left = grid[getIndex(i - 1, j)];
      if (top && !top.visited) {
        neighbors.push(top);
      }
      if (right && !right.visited) {
        neighbors.push(right);
      }
      if (bottom && !bottom.visited) {
        neighbors.push(bottom);
      }
      if (left && !left.visited) {
        neighbors.push(left);
      }

      if (neighbors.length > 0) {
        var rand = floor(random(0, neighbors.length));
        return neighbors[rand];
      } else {
        return undefined;
      }
    };
  }
}
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  cols = floor(width / s);
  rows = floor(height / s);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      grid.push(new cell(i, j));
    }
  }
  current = grid[0];
  background(0);
}
function draw() {
  //step 1
  current.visited = true;
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    //step 2
    stack.push(current);
    //step 3
    removeWalls(next, current);
    //step 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  } else {
    end = grid[grid.length - 1];
    noLoop();
  }

  //draw reg
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  //draw stack
  for (let i = 0; i < stack.length; i++) {
    fill(58, 134, 255);
    rect(stack[i].x, stack[i].y, s, s);
  }
  //draw current
  fill(255, 190, 11);
  rect(current.x, current.y, s, s);

  //draw end
  if (end) {
    fill(131, 56, 236);
    rect(end.x, end.y, s, s);
  }
}
