var start;
var end;
var w,h;
var stop = false;
const rectangleSize = 15;
const gridSize = 30;
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

const baseGridColor = "#007500"
const baseWallColor = undefined;

var grid = new Array(gridSize);