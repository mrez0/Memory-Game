startGame();

document.getElementsByClassName('start-again-btn').addEventListener('click', function (event) {
    startGame();
});

function startGame() {
    const setting = setGameSettings();
    let cards = createCards(setting.numberCards);
    cards = shuffle(cards);
    displayCards(setting.canvasClass, cards);
    handleClickEvents(setting.canvasClass);
}

function setGameSettings() {
    const settings = {
        numberCards: 8, //Later, we can let the user choose the number of cards to show in the grid, i.e. difficulty
        canvasClass: 'canvas'
    };

    return settings;
}

function createCards(numberCards) {
    let cards = [];

    for (let x = 0; x < numberCards; x++) {
        //Creating 2 div elements with same number on each
        cards.push(createSinglCard(x));
        cards.push(createSinglCard(x));
    }

    return cards;
}

function createSinglCard(number) {
    let card = document.createElement('div');
    card.number = number + 1; //Numbers on cards start with 1 not 0
    card.textContent = ' ';
    card.classList.add('card');
    return card;
}

function displayCards(canvasClass, cards) {
    const canvas = document.getElementsByClassName(canvasClass)[0];
    let virtualDom = document.createDocumentFragment();
    for( let card of cards ) {
        virtualDom.appendChild(card);
    }
    canvas.innerHTML = '';
    canvas.appendChild(virtualDom);
}

function handleClickEvents(canvasClass) {
    const canvas = document.getElementsByClassName(canvasClass)[0];
    let flippedCards = 0;
    let clickCount = 0;

    canvas.addEventListener('click', function (event) {
        //If in progress of old event, return
        if( clickCount ) {
            return;
        }

        //return if click not emitted from a card
        if( event.target.tagName != 'DIV' || ! event.target.classList.contains('card') ) {
            return;
        }

        //return if card was clicked before
        if( event.target.classList.contains('flip') ) {
            return;
        }

        clickCount = 1;

        flipCard(event.target);
        ++flippedCards;

        //Check cards after transiton finish
        event.target.addEventListener('transitionend', function () {
            if( flippedCards > 1 ) {
                if( cardsMatching() ) {
                    disableCards();

                    if( gameWin() ) {
                        showSuccessMessage();
                    }

                } else {
                    flipCardsDown();
                }

                flippedCards = 0;
            }
            clickCount = 0;
        });
    });
}

function flipCard(card) {
    card.classList.add('flip');
    card.textContent = card.number;
}

function cardsMatching() {
    let flippedCards = document.getElementsByClassName('flip');
    let val1 = flippedCards[0].innerHTML;
    let val2 = flippedCards[1].innerHTML;

    return val1 === val2;
}

function disableCards() {
    let [card1, card2] = document.getElementsByClassName('flip');
    card1.classList.remove('flip');
    card1.classList.remove('card');
    card1.classList.add('disable');
    card1.textContent = ' ';

    card2.classList.remove('flip');
    card2.classList.remove('card');
    card2.classList.add('disable');
    card2.textContent = ' ';
}

function flipCardsDown() {
    let [card1, card2] = document.getElementsByClassName('flip');
    card1.classList.remove('flip');
    card1.textContent = ' ';
    card2.classList.remove('flip');
    card2.textContent = ' ';
}

function gameWin() {
    return document.getElementsByClassName('card').length == 0;
}

function showSuccessMessage() {
    let canvas = document.getElementsByClassName('canvas')[0];

    let message =   `<div class="success-message">
                        <h2>Congratulations!!!</h2>
                        <p>You won the game</p>
                        <button class="start-again-btn">Start again</button>
                    </div>`;

    canvas.innerHTML = message;
}

//Shuffle array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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