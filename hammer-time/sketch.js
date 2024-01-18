let nails = [];
let step = 0;

let song;
let nailPlace;
let nailHammerHit;

let handImg;
let nailImg;
let hammerImg;

let handX = -30;
let handY = -40;
let isHandPlacing = false;

let hammerAngle = 0;
let isSpacePressed = false;

let remix;
let FPS = 60;


class Nail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.status = 0; // 0: normal, 1: success
  }

  update() {
    this.x += 4.5;
  }

  display() {
    switch (this.status) {
      case 0:
        image(nailImg, this.x, this.y, 38, 96);
        break;

      case 1:
        image(nailImg, this.x, this.y + 85, 38, 96);
        break;

      default:
        image(nailImg, this.x, this.y, 38, 96);
        break;
    }
  }
}

function preload() {
  song = loadSound("assets/song.mp3");
  nailPlace = loadSound("assets/SFX_NailPlace.mp3");
  nailHammerHit = loadSound("assets/SFX_NailHammerHit.mp3");

  handImg = loadImage("assets/hand.png");
  nailImg = loadImage("assets/nail.png");
  hammerImg = loadImage("assets/hammer.png");
  
  remix = loadJSON('assets/remix.json');
}

function setup() {
  createCanvas(800, 500);
  frameRate(FPS);
  rectMode(CENTER);
  imageMode(CENTER);
  
  for (let i = remix.entities.length - 1; i >= 0 ; i--) {
    if (!remix.entities[i].hasOwnProperty("datamodel") || remix.entities[i].datamodel !== "hammerTime/nail") {
      remix.entities.splice(i, 1);
    }
  }

  song.play();
}


function draw() {
  background(220, 221, 198);

  push();
  strokeWeight(3);
  stroke(80);
  line(0, 395, 800, 395);
  pop();

  // Place notes
  ct = song.currentTime();

  if (step === nails.length && step < remix.entities.length && ct > remix.entities[step].beat / (remix.tempoChanges[0].dynamicData.tempo / FPS)) {
    isHandPlacing = true;

    setTimeout(function () {
      nailPlace.play();
      nails.push(new Nail(80, 348));
    }, 25);

    step++;
  }
  
  // Hand
  if (isHandPlacing) {
    handX += 25;
    handY += 25;
    
    if (handX > 140) {
      isHandPlacing = false;
    }
  } else {
    handX -= 25;
    handY -= 25;
    
    if (handX < -30) {
      handX = -30;
      handY = -40;
    } 
  }
  
  image(handImg, handX, handY, 1024, 500);

  // Hammer
  if (isSpacePressed && hammerAngle > -PI / 2) {
    for (let nail of nails) {
      if (nail.status === 0 && nail.x > 550 && nail.x < 600) {
        setTimeout(function () {
          nailHammerHit.play();
          nail.status = 1;
        }, 25);
      }
    }

    hammerAngle -= PI / 15;

    if (hammerAngle < 0) {
      isSpacePressed = false;
    }
  } else if (!isSpacePressed && hammerAngle < PI / 2) {
    hammerAngle += PI / 15;
  }

  push();
  translate(1024, 300);
  rotate(hammerAngle);
  image(hammerImg, 0, 0, 1024, 1000);
  pop();
  
  // Debug
  // line(550, 0, 550, 500);
  // line(600, 0, 600, 500);

  // Nails
  for (let nail of nails) {
    // line(nail.x, 0, nail.x, 500);
    nail.update();
    nail.display();
  }
}

function keyPressed() {
  if (key === " ") {
    isSpacePressed = true;
  }
}
