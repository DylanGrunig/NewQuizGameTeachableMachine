let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/PJEtr0hrZ/';


let video;
let flippedVideo;
// To store the classification
let label = "";

// All of my Questions
let questions = [
  "Was the first song ever sung in space 'Happy Birthday?' = Yes",
  "Do octopuses have 3 hearts? = Yes",
  "Does it take 8 minutes and 20 seconds for light to travel from the Sun to Earth? = Yes",
  "Is a baby whale called a calf? = Yes",
  "Does a cartographer produce maps? = Yes",
  "Was Sir Arthur Conan Doyle the creator of Sherlock Holmes? = Yes",
  "Is a female kangaroo called a flyer? = Yes",
  "Is Mount Everest located in the Himalayas? = Yes",
  "Is the star the most common symbol used in all national flags around the world? = Yes",
  "Was the first product with a bar code chewing gum? = Yes",
  "Does tea contain more caffeine than coffee and soda? = No",
  "Is Bill Gates the founder of Amazon? = No",
  "Is black the most commonly used color in all national flags around the world? = No",
  "Is AB- the rarest type of blood in humans? = No",
  "Are there more than 28 time zones in the world? = No",
  "Are lungs the largest internal organ in the human body? = No",
  "Are dolphins the fastest species in the world? = No",
  "Was the first iPhone released by Apple in 2006? = No",
  "Is Mars the largest planet in our solar system? = No",
  "In tennis, does the term 'love' mean draw? = No"
];
let questionIndex = 0;

// Background color
let backgroundColor = 0; // Initial background color (black)

// Points
let points = 0;
let highScore = 0;

// Timer
let timer = 30; // Initial timer value in seconds
let timerInterval;
let timerLastUpdate;

// Delaying the questions
let delayStart = 0;
let delayDuration = 2000; // 2 seconds
let nextQuestionDelayStart = 0;
let nextQuestionDelayDuration = 2000; // 2 seconds

// Load the image
let angleImage;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  angleImage = loadImage('Angle.png');
}

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  flippedVideo = ml5.flipImage(video);

  classifier = ml5.imageClassifier(imageModelURL + 'model.json', video, modelLoaded);

  timerLastUpdate = millis();
  timerInterval = setInterval(updateTimer, 1000);

  //RESET BUTTON
  let resetButton = createButton('Reset');
  resetButton.position(500, height + 180);
  resetButton.mousePressed(resetGame);
}

function modelLoaded() {
  console.log('Model Loaded!');
  classifyVideo();
}

function draw() {
  background(backgroundColor);

  image(flippedVideo, 0, 0);

  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height * 0.15);

// Points
  textSize(20);
  fill(0, 0, 255);
  textAlign(RIGHT);
  text("Points: " + points, width - 20, 40);

  //High score
  textSize(20);
  fill(255, 0, 0);
  textAlign(RIGHT);
  text("High Score: " + highScore, width - 20, 70);

  // Timer
  fill(0, 0, 255); // Blue color for timer
  textAlign(LEFT);
  text("Timer: " + timer + "s", 20, 40);




  let currentQuestion = questions[questionIndex];


  if (label === "Closed Fist" && currentQuestion.endsWith("= No") && millis() - delayStart >= delayDuration) {
    backgroundColor = color(0, 255, 0); // Set background to red
    updatePoints(); // Update points when changing colors
    startDelay(nextQuestion); // Start the delay before moving to the next question
  } else if (label === "Open Palm" && currentQuestion.endsWith("= Yes") && millis() - delayStart >= delayDuration) {
    backgroundColor = color(0, 255, 0); // Set background to green
    updatePoints(); // Update points when changing colors
    startDelay(nextQuestion); // Start the delay before moving to the next question
  } else if (label === "Neither" && millis() - delayStart >= delayDuration) {
    backgroundColor = color(0, 255, 0); // Set background to black
    startDelay(nextQuestion); // Start the delay before moving to the next question
  }

  if (millis() - nextQuestionDelayStart < nextQuestionDelayDuration) {
    return; // Exit draw function during the delay
  }

  fill(0, 0, 0, 150);
  rectMode(CENTER);
  rect(width / 2, height / 2, width - 40, 60);

  textSize(24);
  fill(255);
  textAlign(CENTER, CENTER);
  let textX = width / 2;
  let textY = height * 0.5;

  while (textWidth(currentQuestion.split('=')[0].trim()) > width - 40) {
    textSize(textSize() - 1);
  }

  text(currentQuestion.split('=')[0].trim(), textX, textY);

 // Load the image
let angleImage;

function preload() {
  angleImage = loadImage('Angle.png');
}



}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  classifyVideo();
}
//HighScore Update
function updatePoints() {
  points++;
  // Update high score if needed
  if (points > highScore) {
    highScore = points;
  }
}

// Update Countdown
function updateTimer() {
  if (millis() - timerLastUpdate >= 1000 && timer > 0) {
    timer--;
    timerLastUpdate = millis();
  }

  // Endgame
  if (timer === 0) {
    clearInterval(timerInterval);
    noLoop();
  }
}

// Next question
function nextQuestion() {
  questionIndex = Math.floor(Math.random() * questions.length); // Choose a random question
  nextQuestionDelayStart = millis(); // Reset the delay timer for the next question
}

// Update Delays
function startDelay(callback) {
  delayStart = millis();
  setTimeout(callback, delayDuration);
}

// Function to reset the game
function resetGame() {
  timer = 30;
  points = 0;
  timerLastUpdate = millis();
  loop(); // Resume the program
  timerInterval = setInterval(updateTimer, 1000);
}