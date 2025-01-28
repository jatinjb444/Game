let currentPuzzle = 1;
let timer;
let timeLeft = 30;
let gameOver = false; // Track if the game is over

// Set data
const universalSet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
const encryptedSet = new Set(['A', 'B', 'C', 'E', 'G', 'J', 'K', 'M', 'N', 'P', 'Q', 'S']);
const removedSet = new Set(['B', 'C', 'J', 'K', 'Q']);
const knownSet = new Set(['A', 'G', 'L', 'M', 'S', 'T', 'U']);
const hiddenSymbols = ['X', 'Y', 'Z'];

// Puzzle solutions
let puzzle1Solution = ['A', 'E', 'G', 'M', 'N', 'P', 'S'];
let puzzle2Solution = ['A', 'G', 'M', 'S'];
let finalSolution = ['A', 'G', 'M', 'S', 'X', 'Y', 'Z'];

// Start Timer
function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            displayMessage('Time\'s up! Try again.');
            resetPuzzle();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('time').textContent = timeLeft;
}

// Puzzle Check
function checkPuzzle(puzzleNum) {
    if (gameOver) return; // Skip checking if the game is over

    let input;
    let messageId = `message${puzzleNum}`;  // Dynamically set the correct message container for each puzzle
    if (puzzleNum === 1) {
        input = document.getElementById('relevant-set-input').value.split(' ').map(x => x.toUpperCase());
        if (arraysEqual(input, puzzle1Solution)) {
            displayMessage('Correct! You\'ve unlocked the Relevant Set (R).', puzzleNum);
            document.getElementById('puzzle1').classList.add('hidden');
            document.getElementById('puzzle2').classList.remove('hidden');
            document.getElementById('puzzle2-relevant-set').textContent = input.join(' ');
        } else {
            displayMessage('Incorrect solution. Try again!', puzzleNum);
        }
    } else if (puzzleNum === 2) {
        input = document.getElementById('validated-set-input').value.split(' ').map(x => x.toUpperCase());
        if (arraysEqual(input, puzzle2Solution)) {
            displayMessage('Correct! You\'ve validated the components.', puzzleNum);
            document.getElementById('puzzle2').classList.add('hidden');
            document.getElementById('puzzle3').classList.remove('hidden');
            document.getElementById('puzzle3-validated-set').textContent = input.join(' ');
        } else {
            displayMessage('Incorrect solution. Try again!', puzzleNum);
        }
    } else if (puzzleNum === 3) {
        input = document.getElementById('final-set-input').value.split(' ').map(x => x.toUpperCase());
        if (arraysEqual(input, finalSolution)) {
            displayMessage('Congratulations! You\'ve unlocked the formula: AGMSXYZ. Your score is 50!', puzzleNum);
            clearInterval(timer); // Stop the timer
            gameOver = true; // Game over flag is set
            disableAllButtons(); // Disable all buttons after game over
            document.getElementById('final-message').classList.remove('hidden');
            document.getElementById('game-container').innerHTML += `
                <div class="end-screen">
                    <h2>Game Over!</h2>
                    <p>Time taken: ${30 - timeLeft} seconds</p>
                </div>
            `;
        } else {
            displayMessage('Incorrect solution. Try again!', puzzleNum);
        }
    }
}

function showHint(puzzleNum) {
    if (gameOver) return; // Prevent hint if game is over
    document.getElementById(`hint${puzzleNum}`).style.display = 'block';
}

function displayMessage(message, puzzleNum) {
    const messageId = `message${puzzleNum}`;
    document.getElementById(messageId).textContent = message;
    document.getElementById(messageId).style.display = 'block';
}

function resetPuzzle() {
    currentPuzzle = 1;
    gameOver = false; // Reset the game over flag
    document.getElementById('game-container').innerHTML = `
        <header>
            <h1>Set Cipher</h1>
            <div class="timer">Time: <span id="time">30</span>s</div>
        </header>
        <div class="case-info">
            <h2>Case: Unlocking the Formula</h2>
            <div class="universal-set">
                <h3>Universal Set (U)</h3>
                <div class="set-display" id="universal-set">
                    A B C D E F G H I J K L M N O P Q R S T
                </div>
            </div>
        </div>
    `;
    startTimer(); // Restart the game with a timer
}

// Helper function to compare arrays
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

// Detect typing in relevant set input to start timer
document.getElementById('relevant-set-input').addEventListener('input', function() {
    // Start the timer automatically when typing starts in Puzzle 1
    if (timeLeft === 30 && !gameOver) {
        startTimer();
    }
});

// Disable all buttons and inputs
function disableAllButtons() {
    const buttons = document.querySelectorAll('button, input[type="text"]');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// End Game Button
document.getElementById('end-game-button').addEventListener('click', function() {
    if (!gameOver) {
        clearInterval(timer); // Stop the timer
        gameOver = true; // Mark the game as over
        displayMessage('Game Over! You ended the game early.', 0); // Display a message
        disableAllButtons(); // Disable all buttons
        window.location.href = 'index.html'
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Adding Event Listeners for Buttons:
    // Puzzle 1 buttons
    document.getElementById('puzzle1-submit').addEventListener('click', function() {
        checkPuzzle(1);
    });
    document.getElementById('puzzle1-hint').addEventListener('click', function() {
        showHint(1);
    });

    // Puzzle 2 buttons
    document.getElementById('puzzle2-submit').addEventListener('click', function() {
        checkPuzzle(2);
    });
    document.getElementById('puzzle2-hint').addEventListener('click', function() {
        showHint(2);
    });

    // Puzzle 3 buttons
    document.getElementById('puzzle3-submit').addEventListener('click', function() {
        checkPuzzle(3);
    });
    document.getElementById('puzzle3-hint').addEventListener('click', function() {
        showHint(3);
    });
});
