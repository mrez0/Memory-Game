startGame();

function startGame() {
    const numberCards = setGameSettings();
    let cards = createCards( numberCards );
    shuffleCards( cards );
    displayCards( placeholder, cards );
    handleClickEvents();
}

function setGameSettings() {
    //Later, we can let the user choose the number of cards to
    // show in the grid, i.e. difficulty
    const numberCards = 8;
    return numberCards;
}