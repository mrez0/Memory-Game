startGame();

function startGame() {
    const numberCards = setGameSettings();
    let cards = createCards( numberCards );
    cards = shuffle( cards );
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

//Shuffle array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }