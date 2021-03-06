let setting = {
    numberCards: 8, //Later, we can let the user choose the number of cards to show in the grid, i.e. difficulty
    canvasClass: 'canvas',
    userRating: 5
};

let numberMoves = 0;
let timer = null;
let timeElapsed = 0;

setupGame();
setEventHandlers();

function setupGame() {
    let cards = createCards(setting.numberCards);
    cards = shuffle(cards);
    displayCards(setting.canvasClass, cards);
    startTimer();
}

function setEventHandlers() {
    //restart button handler
    document.getElementsByClassName('restart-btn')[0].addEventListener('click', function () {
        let answer = confirm('Are you sure you want to restart the game?');
        if( answer ) {
            clearStats();
            setupGame();
        }
    });

    handleGameEvents(setting.canvasClass);
}

function startTimer() {
    timer = setInterval(function () {
        timeElapsed++;
        document.getElementsByClassName('timer')[0].innerHTML = timeElapsed;
    }, 1000);
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
    canvas.innerHTML = '';
    let virtualDom = document.createDocumentFragment();
    for( let card of cards ) {
        virtualDom.appendChild(card);
    }

    canvas.appendChild(virtualDom);
}

function handleGameEvents(canvasClass) {
    const canvas = document.getElementsByClassName(canvasClass)[0];

    //We are setting these variables in canvas DOM element because we need them later in 'clearStats' function to reset them back to defaults
    canvas.flippedCards = 0;     //counter to number of flipped cards
    canvas.inClickEvent = false; //flag if we are in a click event

    canvas.addEventListener('click', function (event) {
        //return if:
        //  in progress of previous click event,
        //  or click not emitted from a card,
        //  or user clicked on an already flipped card
        if (!checkClickSource(canvas.inClickEvent, event)) {
            return;
        }

        canvas.inClickEvent = true;
        numberMoves++; //increment number of user moves

        flipCard(event.target);
        canvas.flippedCards += 1;

        calculateUserRating();
        updateNumberMoves();
    });

    //Check cards after end of flip animation
    canvas.addEventListener('transitionend', function () {
        //ensure 2 cards are flipped in order to compare numbers
        if( canvas.flippedCards > 1 ) {
            if( cardsMatching() ) {
                disableCards();

                // Check if all cards are matched and user wins
                if( gameWin() ) {
                    showSuccessMessage();
                }
            } else {
                flipCardsDown();
            }

            canvas.flippedCards = 0;
        }
        canvas.inClickEvent = false;
    });
}

function checkClickSource(inClickEvent, event) {
    //return false if in progress of previous click event
    if (inClickEvent) {
        return false;
    }

    //return false if click not emitted from a card
    if (event.target.tagName != 'DIV' || !event.target.classList.contains('card')) {
        return false;
    }

    //return false if user clicked on an already flipped card
    if (event.target.classList.contains('flip')) {
        return false;
    }

    //else, return true
    return true;
}

function updateNumberMoves() {
    document.getElementsByClassName('moves')[0].innerHTML = numberMoves;
}

function calculateUserRating() {
    let deduction = Math.floor( numberMoves / ( setting.numberCards * 3 ) );
    let newRating = setting.userRating - deduction;
    newRating = newRating > 0 ? newRating : 1;

    let starsEl = document.getElementsByClassName('stars')[0];
    starsEl.style.backgroundPositionY = 43 * newRating + 'px';
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
    stopTimer();
    let canvas = document.getElementsByClassName('canvas')[0];

    let message =   `<div class="success-message">
                        <h2>Congratulations!!!</h2>
                        <p>You won the game</p>
                        <p>You took <span class="success-time">${document.getElementsByClassName('timer')[0].textContent} seconds</span> to complete the game</p>
                        <p>Rating: <span class="success-stars stars"></span></p>
                        <button class="start-again-btn">Start again</button>
                    </div>`;

    canvas.innerHTML = message;
    document.getElementsByClassName('success-stars')[0].style.backgroundPositionY = document.getElementById('main-rating').style.backgroundPositionY;
    document.getElementsByClassName('start-again-btn')[0].addEventListener('click', function (event) {
        clearStats();
        setupGame();
    });
}

function clearStats() {
    stopTimer();
    numberMoves = 0;
    timeElapsed = 0;
    timer = null;
    document.getElementById('main-rating').style.backgroundPositionY = '0px';
    document.getElementsByClassName('timer')[0].textContent = 0;
    document.getElementsByClassName('moves')[0].textContent = 0;

    let canvas = document.getElementsByClassName('canvas')[0];
    canvas.flippedCards = 0;
    canvas.inClickEvent = false;
}

function stopTimer() {
    clearInterval(timer);
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