var start;
var end;
var w,h;
var stop = false;
var walkingInBattle = false;
var team1Color = "#FFA500";
var team2Color = "#A020F0";
var inBattle;
var armyQue;
var turn = 0;

const userInfo = document.getElementById('userInfo');

const mainGridSize = 30;
const canvas = document.getElementById("myCanvas");
const playerInfoDiv = document.getElementById('playerInfo');
const context = canvas.getContext("2d");
const rectangleSize = canvas.width / mainGridSize;

const battleGridSize = 15;
const canvasBattle = document.getElementById('canvasBattle');
const battleInfoDiv = document.getElementById('battleInfo');
const battleContext = canvasBattle.getContext("2d");
const rectangleSizeBattle = canvasBattle.width / battleGridSize;


const baseGridColor = "#007500"