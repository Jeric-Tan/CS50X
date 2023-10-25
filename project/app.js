// Initialize and start the game
let hand = ['2🎱','3🎱','4🎱','6🎱','9🎱','1🎋','2🎋','3🎋','4🎋','5🎋','6🎋','6🀄','6🀄','6🀄'];
// let hand = sort(generate(14));
let num_turns = 0;

document.getElementById("start-button").addEventListener("click", function() {

    //prevent multiple clicks of button
    document.getElementById("start-button").hidden = true;
    document.getElementById("restart-button").hidden = false;
    document.getElementById("div-turn").hidden = false;
    document.getElementById("howtoplay").hidden = true;

    document.querySelector('.background').classList.remove("bg-image2");
    document.querySelector('.background').classList.add("bg-image1");

    //start of turn
    startGame(hand);
});

document.getElementById("howtoplay").addEventListener("click", function() {
    window.location.href = "instructions.html";
});
//resets game
document.getElementById("restart-button").addEventListener("click", function() {
    // Restart the game when button is clicked
    location.reload(true);
});

/// START OF GAME LOGIC
//random integer
function randInt(i) {
    return Math.floor(Math.random() * i) + 1;
}

//generate n tiles
function generate(n) {
    const suit = ['🎱' , '🎋' , '🀄'];
    const tiles = []
    for (let i = 0; i < n; i++) {
        let tile = randInt(9) + suit[Math.floor(Math.random() * 3)];
        tiles.push(tile);
    }
    return tiles;
}
//sort hand
function sort(hand) {
    const a = [];
    const b = [];
    const c = [];

    for (let i = 0; i < hand.length; i++) {
      if (/🎱/.test(hand[i])) {
        a.push(hand[i]);
      } else if (/🎋/.test(hand[i])) {
        b.push(hand[i]);
      } else if (/🀄/.test(hand[i])) {
        c.push(hand[i]);
      } else {
        break;
      }
    }

    // Sort each group and combine them
    hand = a.sort().concat(b.sort(), c.sort());

    return hand;
}


//Win condition
function check(hand) {
    console.log(`CHECKED HAND: ${hand}`);
    let no_sets = 0;
    let no_pairs = 0;

    const set = {};
    hand.forEach(element => {
        set[element] = (set[element] || 0) + 1;
    })

    //consecutives
    for (let i = 0; i < Object.keys(set).length - 2; i++) {

        if (
            parseInt(Object.keys(set)[i][0]) === parseInt(Object.keys(set)[i+1][0]) - 1 &&
            parseInt(Object.keys(set)[i][0]) === parseInt(Object.keys(set)[i+2][0]) - 2 &&
            Object.keys(set)[i][1] === Object.keys(set)[i+1][1] &&
            Object.keys(set)[i][1] === Object.keys(set)[i+2][1]
        ) {
            if (set[Object.keys(set)[i]] > 0 && set[Object.keys(set)[i+1]] > 0 && set[Object.keys(set)[i+2]] > 0) {
                no_sets += 1;
                set[Object.keys(set)[i]] -= 1;
                set[Object.keys(set)[i+1]] -= 1;
                set[Object.keys(set)[i+2]] -= 1;
            }
        }
    }

    //triplets
    for (const key in set) {
        if (set[key] >= 3) {
            set[key] -= 3;
            no_sets += 1;
            //console.log('SET FOUND');
        }
    }
    //pairs
    for (const key in set) {
        if (no_sets == 4 && set[key] == 2) {
            no_pairs += 1;
        }
    }
    //win condition
    if (no_sets == 4 && no_pairs == 1) {
        return true;
    }

    return false;
    }
/// END OF GAME LOGIC


/// START OF FORMATTING
//ADDING TILES
//add HTML for a div per tile
function addTiles(tiles) {
    const tileContainer = document.getElementById('tile-container');

    while (tileContainer.firstChild) {
        tileContainer.removeChild(tileContainer.firstChild);
    }

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const tileElement = document.createElement('button');
        tileElement.className = 'tile  border-white rounded btn-success overflow-x-auto';
        tileElement.textContent = tile;
        tileContainer.appendChild(tileElement);
    }
}

//DRAW SECTION
//html for tile drawn
function displayDrawnTile(drawnTile) {
    const tileContainer = document.getElementById('draw-container');
    //display the drawn card
    const tileElement = document.createElement('button');
    tileElement.setAttribute('id', 'drawnTile');
    tileElement.className = 'tile drawnTile border-white rounded';
    tileElement.textContent = drawnTile;
    tileContainer.appendChild(tileElement);

}


//DISCARD SECTION
function displayDiscard(hand) {
    const tilesClass = document.querySelectorAll('.tile');

    //removes pre-existing discard button children
    function removeDiscardButtons() {
        tilesClass.forEach(function(tile) {
            const discardButton = tile.querySelector('.discard-button');
            if (discardButton) {
                discardButton.remove();
            }
        });
    }

    //on each tile click create the discard button and eventlistener for that button
    tilesClass.forEach(function(tile) {
        tile.addEventListener('click', function() {
            removeDiscardButtons();
            // Create discard button
            const discard = document.createElement('button');
            discard.textContent = 'Discard?';
            discard.className = 'discard-button border-white rounded';

            // Add the event listener to button
            discard.addEventListener('click', function() {
                hand = onClickDiscard(hand, discard);
                console.log(`AFTER DISCARDING A CARD HAND: ${hand}`);
                return hand;
            });

            tile.appendChild(discard);

        });

    });
    return hand;
}

function onClickDiscard(hand, discard) {

    //when discarding a HAND tile
    if (!discard.parentElement.classList.contains('drawnTile')) {
        const drawnTile = document.getElementById('drawnTile').textContent;
        const discardTile = discard.parentElement.firstChild.textContent;

        //adds the DRAWN tile to hand
        hand.push(drawnTile);
        //removes the HAND tile
        let firstOcc = true;
        hand = hand.filter(item => {
            if (item === discardTile && firstOcc) {
                firstOcc = false;
                return false;
            }
            return true;
        });

        discard.parentElement.remove();

    }
    //after each discard, draw and display a random card
    document.getElementById('drawnTile').remove();
    const newTile = generate(1);
    displayDrawnTile(newTile);
    hand = sort(hand);
    addTiles(hand);
    displayDiscard(hand);
    num_turns += 1;
    //edit the turn count
    document.getElementById('turn-count').textContent = `Turns: ${num_turns}`;

    let isWin = check(hand);
    if (isWin == true) {
        console.log('u won');
        whenWin();
    }
    console.log(check(hand));
    console.log(`Turn: ${num_turns}`);



    return hand;
}

function startGame(hand) {
    //creates html for text
    const text = document.createElement('span');
    text.className = 'drawnTile-text fs-5 fw-semibold';
    text.textContent = "Drawn Tile: ";
    document.getElementById('draw-container').appendChild(text);

    //loads in FIRST draw tile
    //let drawTile = generate(1);
    let drawTile = '9🎱';
    displayDrawnTile(drawTile);

    let num_turns = 0;
    console.log(`start: ${hand}`);

    addTiles(hand);
    hand = displayDiscard(sort(hand));

}

function whenWin() {
    console.log('sup')
    //create hmtl text
    const winTextTurn = document.createElement('div');
    winTextTurn.className = 'win-text-turn fs-3';
    winTextTurn.textContent = `Congrats you have won in ${num_turns} turns!`;
    //document.getElementById('game-container').appendChild(winTextTurn);

    const winTextHand = document.createElement('div');
    winTextHand.className = 'win-text-turn fs-3';
    winTextHand.textContent = "Your winning hand was:";
    //document.getElementById('game-container').appendChild(winTextHand);

    const gameDiv = document.getElementById('game-container');
    const turnDiv = document.getElementById('div-turn');
    const drawDiv = document.getElementById('draw-container');

    gameDiv.replaceChild(winTextTurn, turnDiv);
    gameDiv.replaceChild(winTextHand, drawDiv);

    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(function(tile) {
        tile.disabled = true;
    });

    //show winning hand

}