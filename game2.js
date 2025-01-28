let set = [];
let validSubsets = [];
let foundSubsets = new Set(); // Store found subsets to prevent duplicates
let points = 0;
let timer = 0;
let interval = null;
let roundPoints = 50; // Points awarded per round
let maxPoints = 50; // Max points to end the game
let subsetsFoundCount = 0; // Track number of correct subsets per round
const subsetsRequired = 5; // Number of subsets required to complete a round

const setDisplay = document.getElementById('set-display');
const checkboxesContainer = document.querySelector('.checkboxes');
const pointsElement = document.getElementById('points');
const timerElement = document.getElementById('time');
const submitButton = document.getElementById('submit');
const subsetsFoundList = document.getElementById('subsets-found-list');

// Function to generate all subsets (excluding the empty set)
function generateSubsets(arr) {
    let subsets = [];
    const totalSubsets = Math.pow(2, arr.length); // 2^n possible subsets

    for (let i = 1; i < totalSubsets; i++) { // Start from 1 to exclude the empty set
        const subset = [];
        for (let j = 0; j < arr.length; j++) {
            if (i & (1 << j)) {
                subset.push(arr[j]);
            }
        }
        subsets.push(subset);
    }

    return subsets;
}

// Function to generate a random set with elements below 15 and no duplicates
function generateRandomSet() {
    // Randomly decide the cardinality of the set (3, 4, or 5)
    const setSize = Math.floor(Math.random() * 3) + 3; // Generates 3, 4, or 5

    // Generate a unique set with the specified size
    let set = new Set();
    while (set.size < setSize) {
        const randomNumber = Math.floor(Math.random() * 15) + 1;
        set.add(randomNumber);
    }
    set = Array.from(set); // Convert the Set to an Array

    validSubsets = generateSubsets(set); // Generate all non-empty subsets
    foundSubsets.clear(); // Reset found subsets for new round
    subsetsFoundCount = 0; // Reset count of correct subsets

    // Display the set
    setDisplay.textContent = `{ ${set.join(', ')} }`;

    // Create the checkboxes for all elements 1-15
    checkboxesContainer.innerHTML = '';
    for (let i = 1; i <= 15; i++) {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${i}"> ${i}`;
        checkboxesContainer.appendChild(label);
    }
}


// Function to check if the selected combination is a valid subset
function checkSubset(selected) {
    selected.sort((a, b) => a - b);
    const subsetKey = selected.join(',');

    return validSubsets.some(subset =>
        subset.length === selected.length && subset.every(val => selected.includes(val))
    ) && !foundSubsets.has(subsetKey);
}

// Function to start the timer with countdown from 60 seconds
function startTimer() {
    if (!interval) {
        timer = 60;
        timerElement.textContent = `${timer} seconds`;

        interval = setInterval(() => {
            timer--;
            timerElement.textContent = `${timer} second${timer !== 1 ? 's' : ''}`;

            if (timer <= 0) {
                clearInterval(interval);
                interval = null;
                showTimeUpMessage();
                resetGame();
            }
        }, 1000);
    }
}

// Function to show the "Time is up!" message
function showTimeUpMessage() {
    document.getElementById("time-up-message").style.display = "block";
    document.getElementById("time-up-backdrop").style.display = "block";
}

// Function to close the "Time is up!" message
function closeTimeUpMessage() {
    document.getElementById("time-up-message").style.display = "none";
    document.getElementById("time-up-backdrop").style.display = "none";
}

// Add event listener for the checkboxes to start the timer when the user interacts
checkboxesContainer.addEventListener('change', startTimer);

// Submit button logic
// Submit button logic with feedback messages below the button
submitButton.addEventListener('click', () => {
    const selected = Array.from(document.querySelectorAll('.checkboxes input:checked'))
        .map(checkbox => parseInt(checkbox.value));

    const subsetKey = selected.join(','); // Store subset as a key

    // Get the feedback message element and place it below submit button
    const feedbackMessage = document.getElementById("feedback-message");

    // Show message just below submit button
    submitButton.insertAdjacentElement("afterend", feedbackMessage);

    // Check if the subset is already found
    if (foundSubsets.has(subsetKey)) {
        feedbackMessage.textContent = "You have already selected this subset!";
        feedbackMessage.style.display = "block";
        return;
    }

    // Check if the selected subset is valid
    if (checkSubset(selected)) {
        foundSubsets.add(subsetKey); // Mark subset as found
        subsetsFoundCount++;

        // Add valid subset to the list
        const listItem = document.createElement('li');
        listItem.textContent = `{ ${selected.join(', ')} }`;
        subsetsFoundList.appendChild(listItem);

        // Clear any previous message
        feedbackMessage.style.display = "none";

        // Check if 5 valid subsets have been found
        if (subsetsFoundCount >= subsetsRequired) {
            endRound();
        }
    } else {
        feedbackMessage.textContent = "Invalid subset! Choose elements from the given set.";
        feedbackMessage.style.display = "block";
    }
});


// End round logic
function endRound() {
    points += roundPoints;
    pointsElement.textContent = `${points}`;

    if (points >= maxPoints) {
        showEndGameMessage();
    } else {
        resetGame();
    }
}

// Function to reset game for the next round
function resetGame() {
    generateRandomSet();
    timer = 0;
    timerElement.textContent = `${timer} seconds`;
    subsetsFoundList.innerHTML = '';

    // Hide any existing dialog messages
    closeEndGameMessage();
    closeTimeUpMessage();
}

// Function to show end game message and switch to a new question
function showEndGameMessage() {
    document.getElementById("end-game-message").style.display = "block";
    document.getElementById("end-game-backdrop").style.display = "block";
    endGame();

    // Switch to a new question after 3 seconds
    setTimeout(() => {
        closeEndGameMessage();
        resetGame();
    }, 3000);
}


// Function to close the end game message
function closeEndGameMessage() {
    document.getElementById("end-game-message").style.display = "none";
    document.getElementById("end-game-backdrop").style.display = "none";
}

// Function to end game
function endGame() {
    clearInterval(interval);
    interval = null;
}

// Initialize game
generateRandomSet();
