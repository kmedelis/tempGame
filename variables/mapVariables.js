var start;
var end;
var w,h;
var stop = false;
const rectangleSize = 20;
const gridSize = 30;
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const canvasBattle = document.getElementById('canvasBattle');
const battleContext = canvasBattle.getContext("2d");

const baseGridColor = "#007500"