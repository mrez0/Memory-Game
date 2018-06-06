startGame();

function startGame() {
    setGameSettings();
    let cards = createCards();
    shuffleCards( cards );
    displayCards( placeholder, cards );
    handleClickEvents();
}