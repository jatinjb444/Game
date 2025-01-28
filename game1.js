let totalPairs = 5; // The player wins after 5 pairs
let createdPairs = new Set();
let points = 0;
let pairsEntered = 0;
let timer;
let timeRemaining = 60;
let setA = new Set();
let setB = new Set();
let timerRunning = false;

// Function to generate random sets A and B with no duplicates
function generateRandomSets() {
  setA.clear();
  setB.clear();

  while (setA.size < 3) {
    setA.add(Math.floor(Math.random() * 10) + 1);
  }

  while (setB.size < 3) {
    const value = Math.floor(Math.random() * 10) + 1;
    if (!setA.has(value)) {
      setB.add(value);
    }
  }

  createdPairs.clear(); // Reset the created pairs for a new round
}

// Function to generate choice elements
function generateChoices(set, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  set.forEach((element) => {
    const radio = document.createElement('div');
    radio.classList.add('pair');
    radio.innerHTML = `<input type="checkbox" name="${containerId}" value="${element}" onclick="startTimer()"> ${element}`;
    container.appendChild(radio);
  });
}

// Function to start the timer
function startTimer() {
  if (timerRunning) return; // Prevent multiple timers from starting
  timerRunning = true;

  const timerDiv = document.getElementById('timer');
  timerDiv.innerText = `Time Remaining: ${timeRemaining} seconds`;

  timer = setInterval(() => {
    timeRemaining--;
    timerDiv.innerText = `Time Remaining: ${timeRemaining} seconds`;

    if (timeRemaining <= 0) {
      clearInterval(timer);
      timerRunning = false;
      showMessage(`Time's up! Your final score is: ${points}`);
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timer);
  timerRunning = false;
}

// Function to show a message in the game container
function showMessage(message) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerText = message;
  messageDiv.style.display = 'block'; // Make the message visible by changing the display
}

// Function to handle pair submission
function submitPair() {
  const selectedA = Array.from(document.querySelectorAll('input[name="choicesA"]:checked')).map(input => input.value);
  const selectedB = Array.from(document.querySelectorAll('input[name="choicesB"]:checked')).map(input => input.value);
  const resultDiv = document.getElementById('result');
  const progressDiv = document.getElementById('progress');
  const pairHistoryList = document.getElementById('pairHistory');

  // Check if exactly one element is selected from each set
  if (selectedA.length !== 1 || selectedB.length !== 1) {
    resultDiv.innerText = 'You must select exactly one element from each set!';
    resultDiv.style.color = 'red';
    return;
  }

  if (selectedA.some(value => selectedB.includes(value))) {
    resultDiv.innerText = 'Invalid pair! You cannot select the same value in both sets.';
    resultDiv.style.color = 'orange';
    return;
  }

  const pair = `(${selectedA.join(', ')}, ${selectedB.join(', ')})`;

  if (createdPairs.has(pair)) {
    resultDiv.innerText = 'This pair has already been selected!';
    resultDiv.style.color = 'red';
    return;
  }

  createdPairs.add(pair);
  pairsEntered++;

  resultDiv.innerText = `Valid pair! ${pair} added. (${pairsEntered}/${totalPairs})`;
  resultDiv.style.color = 'green';

  const listItem = document.createElement('li');
  listItem.innerText = pair;
  pairHistoryList.appendChild(listItem);

  const progress = (pairsEntered / totalPairs) * 100;
  progressDiv.style.width = `${progress}%`;

  // Update points area
  document.getElementById('points').innerText = `Points: ${points}`;

  // Check if the player has made 5 pairs
  if (pairsEntered === totalPairs) {
    points += 50; // Award 50 points for completing a round
    document.getElementById('points').innerText = `Points: ${points}`; // Update points for the new round

    if (points >= 200) {
      showMessage(`Congratulations! You've won the game with ${points} points!`);
      resetGame();
      return;
    }

    showMessage(`You completed the round! Your score: ${points}`);
    resetForNextQuestion();
  }
}

// Function to reset for the next question
function resetForNextQuestion() {
  pairsEntered = 0;
  timeRemaining = 60; // Reset timer for the next round
  stopTimer(); // Ensure the timer stops before restarting
  timerRunning = false;
  generateRandomSets();
  generateChoices(setA, 'choicesA');
  generateChoices(setB, 'choicesB');
  document.getElementById('result').innerText = '';
  document.getElementById('progress').style.width = '0%';
  document.getElementById('pairHistory').innerHTML = ''; // Clear previous pairs
}

// Function to reset the entire game
function resetGame() {
  pairsEntered = 0;
  points = 0;
  timeRemaining = 60;
  stopTimer();
  timerRunning = false;
  generateRandomSets();
  generateChoices(setA, 'choicesA');
  generateChoices(setB, 'choicesB');
  document.getElementById('result').innerText = '';
  document.getElementById('progress').style.width = '0%';
  document.getElementById('pairHistory').innerHTML = '';
  document.getElementById('points').innerText = `Points: ${points}`;
}

// Function to end the game and redirect to homepage
function endGame() {
  // Redirect to homepage
  window.location.href = '/'; // Replace '/' with your homepage URL
}

generateRandomSets();
generateChoices(setA, 'choicesA');
generateChoices(setB, 'choicesB');
document.getElementById('points').innerText = `Points: ${points}`; // Initial points display
