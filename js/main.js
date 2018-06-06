startGame();

function startGame() {
    setGameSettings();
    var cards = createCards();
    shuffleCards( cards );
    displayCards( placeholder, cards );
    handleClickEvents();
}