// sketch.js – Rock Icon – כולל שלב עם מסך סיום וסאונד מחיאות כפיים

let bgHome, bgLevel1, bgEnd, guitarImg, startBtnImg, amazingImg, nextBtnImg;
let red, green, blue, orange;
let redDark, redLight, redSound;
let greenDark, greenLight, greenSound;
let blueDark, blueLight, blueSound;
let orangeDark, orangeLight, orangeSound, orangeSound2, redSound2;
let homeBtnImg, level2BtnImg;
let bgMusic, clickSound, clapSound;

let gameState = "home";
let buttons = [];
let sequence = [];
let userInput = [];
let showAmazing = false;
let nextBtnScale = 1;
let startBtnScale = 1;
let playingSequence = false;
let waitingForUser = false;
let currentStep = 0;
let homeBtnScale = 1;

function preload() {
  bgHome = loadImage("assets/bg-opening-frame.png");
  bgLevel1 = loadImage("assets/level-1-bg.png");
  bgEnd = loadImage("assets/closing-frame.png");
  guitarImg = loadImage("assets/ראש גיטרה.png");
  startBtnImg = loadImage("assets/start-button.png");
  amazingImg = loadImage("assets/amazing-screen.png");
  nextBtnImg = loadImage("assets/next-button.png");
  homeBtnImg = loadImage("assets/home-button.png");
  level2BtnImg = loadImage("assets/level-2-button.png");

  redDark = loadImage("assets/red-button-dark.png");
  redLight = loadImage("assets/red-button-light.png");
  redSound = loadSound("assets/note-1.mp3");
  redSound2 = loadSound("assets/note-6.mp3");

  greenDark = loadImage("assets/green-button-dark.png");
  greenLight = loadImage("assets/green-button-light.png");
  greenSound = loadSound("assets/note-2.mp3");

  blueDark = loadImage("assets/blue-button-dark.png");
  blueLight = loadImage("assets/blue-button-light.png");
  blueSound = loadSound("assets/note-3-.mp3");

  orangeDark = loadImage("assets/orange-button-dark.png");
  orangeLight = loadImage("assets/orange-button-light.png");
  orangeSound = loadSound("assets/note-4.mp3");
  orangeSound2 = loadSound("assets/note-5.mp3");

  bgMusic = loadSound("assets/opening.mp3");
  clickSound = loadSound("assets/click.mp3");
  clapSound = loadSound("assets/cheering.mp3");
}

function setup() {
  createCanvas(402, 874);
  imageMode(CENTER);
  bgMusic.loop();
}

function setupLevel1() {
  buttons = [];
  red = new SimonButton(200, 540, redDark, redLight, redSound);
  green = new SimonButton(200, 685, greenDark, greenLight, greenSound);
  blue = new SimonButton(200, 615, blueDark, blueLight, blueSound);
  orange = new SimonButton(197, 755, orangeDark, orangeLight, orangeSound);
  orange.imgLight = orangeLight;

  buttons.push(red);
  buttons.push(blue);
  buttons.push(green);
  buttons.push(orange);

  sequence = [
    [red],
    [red, green],
    [red, green, blue],
    [red, green, blue, orange],
    [red, green, blue, orange, orange],
    [red, green, blue, orange, orange, red]
  ];

  currentStep = 0;
  userInput = [];
  showAmazing = false;
  waitingForUser = false;
  setTimeout(() => playSequence(), 500);
}

function draw() {
  background(0);

  if (gameState === "home") {
    image(bgHome, width / 2, height / 2, width, height);
    let btnW = 242 * startBtnScale;
    let btnH = startBtnImg.height * (btnW / startBtnImg.width);
    image(startBtnImg, width / 2, 600, btnW, btnH);
  } else if (gameState === "level1") {
    image(bgLevel1, width / 2, height / 2, width, height);
    image(guitarImg, width / 2, 480, 330, 750);
    for (let btn of buttons) btn.display();
  } else if (gameState === "end") {
    image(bgEnd, width / 2, height / 2, width, height);
    image(homeBtnImg, width / 2 - 90, 750, 110 * homeBtnScale, 110 * homeBtnScale);
    image(level2BtnImg, width / 2 + 90, 750, 110, 110);
  }

  if (showAmazing) {
    image(amazingImg, width / 2, height / 2, width, height);
    let btnW = nextBtnImg.width * nextBtnScale;
    let btnH = nextBtnImg.height * nextBtnScale;
    image(nextBtnImg, width / 2, height - 300, btnW, btnH);
  }
}

function mousePressed() {
  if (gameState === "home") {
    let btnW = 242;
    let btnH = startBtnImg.height * (btnW / startBtnImg.width);
    if (overStartButton(width / 2, 600, btnW, btnH)) {
      startBtnScale = 1.2;
      setTimeout(() => {
        startBtnScale = 1;
        clickSound.play();
        bgMusic.stop();
        gameState = "level1";
        setupLevel1();
      }, 150);
    }
  } else if (gameState === "level1" && !playingSequence && !showAmazing && waitingForUser) {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].isHovered()) {
        userInput.push(buttons[i]);
        buttons[i].activate(userInput.length - 1);
        checkSequence();
        break;
      }
    }
  } else if (showAmazing) {
    let btnW = nextBtnImg.width * nextBtnScale;
    let btnH = nextBtnImg.height * nextBtnScale;
    let btnX = width / 2;
    let btnY = height - 300;
    if (mouseX > btnX - btnW / 2 && mouseX < btnX + btnW / 2 && mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2) {
      nextBtnScale = 1.1;
      setTimeout(() => {
        nextBtnScale = 1;
        showAmazing = false;
        userInput = [];
        currentStep++;
        if (currentStep < sequence.length) {
          setTimeout(() => playSequence(), 500);
        } else {
          gameState = "end";
          setTimeout(() => clapSound.play(), 500);
        }
      }, 200);
    }
  } else if (gameState === "end") {
    let bx = width / 2 - 90;
    let by = 750;
    let bs = 110;
    if (mouseX > bx - bs / 2 && mouseX < bx + bs / 2 && mouseY > by - bs / 2 && mouseY < by + bs / 2) {
      homeBtnScale = 1.1;
      setTimeout(() => {
        homeBtnScale = 1;
        gameState = "home";
        bgMusic.loop();
      }, 150);
    }
  }
}

function overStartButton(x, y, w, h) {
  return mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;
}

function checkSequence() {
  let expected = sequence[currentStep];
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] !== expected[i]) {
      userInput = [];
      return;
    }
  }
  if (userInput.length === expected.length) {
    showAmazing = true;
    waitingForUser = false;
  }
}

function playSequence() {
  playingSequence = true;
  waitingForUser = false;
  let i = 0;
  let seq = sequence[currentStep];
  function playNext() {
    if (i >= seq.length) {
      playingSequence = false;
      waitingForUser = true;
      return;
    }
    seq[i].activate(i);
    i++;
    setTimeout(playNext, 1000);
  }
  playNext();
}

class SimonButton {
  constructor(x, y, imgDark, imgLight, sound = null) {
    this.x = x;
    this.y = y;
    this.imgDark = imgDark;
    this.imgLight = imgLight;
    this.sound = sound;
    this.active = false;
  }

  display() {
    image(this.active ? this.imgLight : this.imgDark, this.x, this.y);
  }

  isHovered() {
    let w = this.imgDark.width;
    let h = this.imgDark.height;
    return mouseX > this.x - w / 2 && mouseX < this.x + w / 2 && mouseY > this.y - h / 2 && mouseY < this.y + h / 2;
  }

  activate(index = -1) {
    this.active = true;
    if (this.imgLight) {
      if (this === orange && sequence[currentStep].length >= 5 && index === sequence[currentStep].lastIndexOf(this)) {
        orangeSound2.play();
      } else if (this === red && sequence[currentStep].length >= 6 && index === sequence[currentStep].lastIndexOf(this)) {
        redSound2.play();
      } else {
        this.sound.play();
      }
    }
    setTimeout(() => {
      this.active = false;
    }, 500);
  }
}


