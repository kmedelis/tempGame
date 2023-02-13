var start;
var end;
var w,h;
var stop = false;
const rectangleSize = 20;
const gridSize = 30;
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

const baseGridColor = "#007500"

var grid = new Array(gridSize);