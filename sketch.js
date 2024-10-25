let bubbles = [];
let temperatureData = [];
let holdupData = [];
let vaporFlowData = [];
let timeData = [];
let trays = 0;
let liquidLevelData = [];
let timeSeries = [];
let trayCount = [];
let timeIndex = 0;
let headerUnits = [];
let vaporUnits = [];
let temperatureUnits = [];

function preload(){

}

function setup() {
  createCanvas(400, 400);
  frameRate(3);

}

function draw() {

  background(220);


  liquidLevelData = window.liquidLevelData || [];
  timeSeries = window.liquidLevelDataTimeSeries || [];
  trayCount = window.liquidLevelDataTrayCount || 0; // Assuming this is a number
  temperatureData = window.trayTempData || [];
  vaporFlowData = window.vapourFlowData || [];
  headerUnits = window.liquidLevelDataHeaderUnits || [];
  vaporUnits = window.vapourFlowDataHeaderUnits || [];
  temperatureUnits = window.trayTempDataHeaderUnits || [];


  trays = trayCount; // Set trays to the correct count


  // Print the first value to the console (for testing)
  // Check if we have data to display
  if (liquidLevelData.length === 0 || temperatureData.length === 0) {
    console.warn("Liquid level or temperature data is empty.");
    return;
  }

  // Check if timeIndex exceeds available data
  if (timeIndex >= liquidLevelData.length) {
    timeIndex = 0; // Reset to 0 if we exceed the length
  }

  // Print the current time value and data for debugging
  let currentTime = timeSeries[timeIndex]; // Get the current time value
  let currentVaporFlow = vaporFlowData[timeIndex] || [];
  let currentTemperature = temperatureData[timeIndex] || [];

  console.log(`Time: ${currentTime}`);
  console.log(`Vapour Flow: ${currentVaporFlow}`);
  console.log(`Temperature: ${currentTemperature}`);
  console.log(`vapourUnits${vaporUnits[1]}`)

  // Display the time value on the canvas
  fill(0); // Set text color to black
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Time: ${currentTime} ${headerUnits[0] || ''}`, 10, 10);


  // Print the current time frame for debugging
  console.log(`Time Index: ${timeIndex}`);
  console.log(`Liquid Level Entry:`, liquidLevelData[timeIndex]);
  console.log(`Temperature Entry:`, temperatureData[timeIndex]);
  console.log(`Time series units:`, headerUnits[0]);
  console.log(typeof headerUnits);
  console.log(Array.isArray(headerUnits));
  console.log((headerUnits));

  //noStroke(); // Disables the stroke
  stroke(0);
  //drawing the distillation column
  noFill();

  //fill(255, 0, 0); // Set fill color to red
  arc(width/2, height/8, width/5, height/10, PI, 2*PI);
  arc(width/2, 7*height/8, width/5, height/10, 0, PI);
  
  line(width/2-width/10, height/8, width/2-width/10, 7*height/8);
  line(width/2+width/10, height/8, width/2+width/10, 7*height/8);

  // Draw trays and their corresponding vapor flow data
  let traySpacing = (3 * height / 4) / trays; // Calculate tray spacing

  for (let i = trayCount; i > 0; i--) {
    let tempHeight = traySpacing * i + (3 * height / 32);
    let trayIndex = i - 1; // Adjust for zero-based index

    // Draw the tray line
    line(width / 2 - width / 10, tempHeight, width / 2 + width / 10, tempHeight);

    // Display the vapor flow data next to each tray
    fill(0); // Black text color
    textSize(12);
    textAlign(RIGHT, CENTER);
    let vaporValue = currentVaporFlow[trayIndex] || 0;
    text(`Vapor Flow: ${vaporValue} ${vaporUnits[1]}`, width / 2 - width / 8, tempHeight);

    textAlign(LEFT, CENTER);
    let tempValue = currentTemperature[trayIndex] || 0;
    text(`Tray Temperature: ${tempValue} ${temperatureUnits[1]}`, width / 2 + width / 8, tempHeight);
  }


  //Drawing liquid hold up and temperature
  let maxTemp = Math.max(...temperatureData.flat());
  let minTemp = Math.min(...temperatureData.flat());

  console.log(maxTemp);
 
  for (let i = trayCount; i > 0; i--) {
    let tempHeight = traySpacing * i + (3 * height / 32);
    let trayIndex = i - 1;

    let liquidLevel = liquidLevelData[timeIndex][trayIndex] || 0;
    let trayTemperature = temperatureData[timeIndex][trayIndex] || minTemp;

    if (liquidLevel > 0) {
      let tempColor = map(trayTemperature, minTemp, maxTemp, 0, 255);
      fill(tempColor, 0, 255 - tempColor);

      rect(
        width / 2 - width / 10,
        tempHeight - liquidLevel,
        width / 5,
        liquidLevel
      );
    } else {
      console.warn(`Liquid level for tray ${trayIndex} is not positive or undefined: ${liquidLevel}`);
    }
  }

  if(frameCount % 10 ===0){
    let b = new Bubble(random(width/2-width/12,width/2+width/12),random(height/2,7*height/8), random(1,5));
    bubbles.push(b);
  }

  for(let i = bubbles.length-1; i>=0; i--){
    bubbles[i].move();
    bubbles[i].display();

    if(bubbles[i].isFinished()){
      bubbles.splice(i,1);
    }
  }

  timeIndex++;
}

class Bubble {
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r =r;
    this.opacity =255;
  }

  move(){
    this.y -=2;
    this.opacity-=3;
  }
  
  display(){
    noStroke();
    fill(255, this.opacity);
    ellipse(this.x, this.y, this.r*2);
  }

  isFinished(){
    return this.opacity <= 0;
  }
}
