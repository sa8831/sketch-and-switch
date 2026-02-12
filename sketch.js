let port;
let connectButton, disconnectButton, finishButton, startButton, saveButton, statusText;
let xPos = 0;
let yPos = 0;
let drawingEnabled = false;
let isConnected = false;
let prevX, prevY;
let lastButtonState = 0;
let started = false;
let tutorialShown = false;
let currentColor;
let studentImg;
let tutorialButton;

function preload() {
  studentImg = loadImage("Shamsa.PNG");
}

function setup() {
  createCanvas(1280, 720); // Fixed landscape size
  background("#F5F5DC");

  port = createSerial();
  currentColor = color(random(255), random(255), random(255));

  startButton = createButton("Start");
  styleButton(startButton);
  positionCenter(startButton, 0, 60);
  startButton.mousePressed(() => {
    startButton.hide();
    tutorialShown = true;
    showTutorialScreen();
  });

  statusText = createP("Status: Not connected");
  statusText.position(10, 10);
  statusText.hide();
}

function styleButton(btn) {
  btn.style("background-color", "#CF877D");
  btn.style("color", "black");
  btn.style("border-radius", "10px");
  btn.style("padding", "10px 15px");
  btn.style("font-size", "14px");
  btn.style("border", "none");
}

function positionCenter(btn, offsetX, offsetY) {
  btn.position((width - btn.size().width) / 2 + offsetX, (height - btn.size().height) / 2 + offsetY);
}

function showTutorialScreen() {
  clear();
  background("#F5F5DC");
  textAlign(CENTER);
  fill("#a8423d");
  textSize(32);
  text("Welcome to Sketch & Switch!", width / 2, 80);

  textSize(20);
  fill(0);
  text(
    "Disclaimer:\nThe blue knobs may be difficult at first, so twist them slowly and gently.\n" +
    "The one on the right moves ↑↓, and the one on the left moves ←→",
    width / 2, 160
  );

  text(
    "Instructions:\n1. Press 'Connect' to connect to your drawing device\n2. Twist knobs to move\n" +
    "3. Press the button on the board to change color (it will be randomized)\n" +
    "4. When finishing the drawing, click 'Finish Drawing' to clear it,\n" +
    "   or click 'Save as PNG' to download your art.\n\n💡 Tip: Clockwise = ↑ or →, CounterClockwise = ↓ or ←",
    width / 2, 320
  );

  tutorialButton = createButton("Start Drawing");
  styleButton(tutorialButton);
  tutorialButton.position(width / 2 - 70, height - 100);
  tutorialButton.mousePressed(() => {
    tutorialButton.remove();
    clear();
    background(255);
    started = true;
    setupDrawingUI();
  });
}

function setupDrawingUI() {
  connectButton = createButton("Connect");
  connectButton.mousePressed(() => {
    if (!port.opened()) {
      port.open("Arduino", 115200); // High baud rate for smoother data
    }
  });
  styleButton(connectButton);

  disconnectButton = createButton("Disconnect");
  disconnectButton.mousePressed(() => {
    if (port.opened()) {
      port.close();
    }
  });
  styleButton(disconnectButton);

  finishButton = createButton("Finish Drawing");
  finishButton.mousePressed(() => {
    background(255);
    drawingEnabled = false;
  });
  styleButton(finishButton);

  saveButton = createButton("Save as PNG");
  saveButton.mousePressed(() => {
    saveCanvas("drawing", "png");
  });
  styleButton(saveButton);

  positionUI();
  statusText.show();
}

function positionUI() {
  let baseX = width / 2 - 250;
  let y = 10;
  connectButton.position(baseX, y);
  disconnectButton.position(baseX + 130, y);
  finishButton.position(baseX + 260, y);
  saveButton.position(baseX + 420, y);
}

function draw() {
  if (!started) {
    if (!tutorialShown) {
      background("#F5F5DC");
      textAlign(CENTER, CENTER);
      textSize(48);
      fill("#a8423d");
      text("Sketch & Switch!", width / 2, height / 2 - 100);

      textSize(24);
      fill(0);
      text("Press Start to Begin", width / 2, height / 2 - 40);

      imageMode(CENTER);
      image(studentImg, width / 4, height / 2 - 30, studentImg.width / 3, studentImg.height / 3);
    }
    return;
  }

  if (port.opened()) {
    isConnected = true;
    statusText.html("Status: Connected");

    // Only read once per frame
    let data = port.readUntil("\n");
    if (data && data.trim().length > 0) {
      processSerial(data.trim());
    }
  } else {
    isConnected = false;
    statusText.html("Status: Not connected");
  }

  if (!drawingEnabled && isConnected) {
    fill(currentColor);
    noStroke();
    ellipse(xPos, yPos, 6, 6);
  }
}

function processSerial(data) {
  let parts = data.split(",");
  if (parts.length !== 3) return;

  let xVal = int(parts[0]);
  let yVal = int(parts[1]);
  let btn = int(parts[2]);

  if (isNaN(xVal) || isNaN(yVal) || isNaN(btn)) return;

  xPos = map(xVal, 0, 1023, 0, width);
  yPos = map(yVal, 0, 1023, 0, height);

  if (btn === 1 && lastButtonState === 0) {
    drawingEnabled = !drawingEnabled;
    currentColor = color(random(255), random(255), random(255));
    prevX = xPos;
    prevY = yPos;
  }

  if (drawingEnabled) {
    stroke(currentColor);
    strokeWeight(2);
    line(prevX, prevY, xPos, yPos);
    prevX = xPos;
    prevY = yPos;
  }

  lastButtonState = btn;
}
