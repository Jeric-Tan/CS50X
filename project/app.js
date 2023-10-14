
// Initialize and start the game

let hand = sort(generate(14));

document.getElementById("start-button").addEventListener("click", function(e) {

    //prevent multiple clicks of button
    e.target.disabled = true;

    //start of turn
    startGame(hand);
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
    console.log(`check is working! Hand: ${hand}`);
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
//add a div per tile
function addTiles(tiles) {
    const tileContainer = document.getElementById('tile-container');

    while (tileContainer.firstChild) {
        tileContainer.removeChild(tileContainer.firstChild);
    }

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const tileElement = document.createElement('button');
        tileElement.className = 'tile';
        tileElement.textContent = tile;
        tileContainer.appendChild(tileElement);
    }
}

//DRAW SECTION
//html for tile drawn
function displayDrawnTile(drawnTile) {
    const tileContainer = document.getElementById('draw-container');
    //display the drawn card
    const tileElement = document.createElement('div');
    tileElement.setAttribute('id', 'drawnTile');
    tileElement.className = 'tile drawnTile';
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
            discard.className = 'discard-button';

            // Add the event listener to button
            discard.addEventListener('click', function() {
                hand = onClickDiscard(hand, discard);
                console.log(`when discard is clicked! Hand: ${hand}`);
                return hand;
            });

            tile.appendChild(discard);

        });

    });
    return hand;
}




function onClickDiscard(hand, discard) {
    console.log(hand);

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
    displayDiscard(newTile);
    console.log(hand);
    return hand;
}

function startGame(hand) {
    //creates html for text
    const text = document.createElement('span');
    text.className = 'drawnTile-text';
    text.textContent = "Drawn Card: ";
    document.getElementById('draw-container').appendChild(text);

    //loads in FIRST draw tile
    let drawTile = generate(1);
    displayDrawnTile(drawTile);

    let num_turns = 0;
    console.log(`start: ${hand}`);

    while (true) {
        num_turns += 1;
        console.log(num_turns);
        //update the hand
        console.log(`updating hand: ${hand}`);
        addTiles(hand);
        console.log(`updating hand: ${hand}`);
        //generate & show random tile


        //creates html for tile drawn

        hand = displayDiscard(sort(hand));
        console.log(`last: ${hand}`);
        console.log(`lastCheck: ${check(hand)}`);
        return check(hand);

        //this creates and infinite loop 
        //if (check(hand)) {
        //  break;
    }

    console.log("u won");

}