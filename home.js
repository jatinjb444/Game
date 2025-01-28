// Show the selected game and hide others
function startGame(gameId) {
  // Hide the main menu
  document.getElementById('mainMenu').classList.add('hidden');

  // Hide all game containers
  const gameContainers = document.querySelectorAll('.game-container');
  gameContainers.forEach(container => container.classList.add('hidden'));

  // Show the selected game
  const selectedGame = document.getElementById(`${gameId}Container`);
  if (selectedGame) {
    selectedGame.classList.remove('hidden');
  }
}

// Return to the main menu
function returnToMenu() {
  // Hide all game containers
  const gameContainers = document.querySelectorAll('.game-container');
  gameContainers.forEach(container => container.classList.add('hidden'));

  // Show the main menu
  document.getElementById('mainMenu').classList.remove('hidden');
}
