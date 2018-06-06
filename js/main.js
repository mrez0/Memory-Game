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

function createCards(numberCards) {
    let cards = [];

    for( let x = 0; x < numberCards; x++ ) {
        let card = document.createElement('div');
        card.textContent = x + 1; //Numbers on cards start with 1 not 0
        cards.push(card);
        cards.push(card);
    }

    return cards;
}