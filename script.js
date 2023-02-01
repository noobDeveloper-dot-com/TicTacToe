// Modal to insert players name
const PLAYERS_NAME_INPUT_MODAL = document.querySelector(
  "#playerNamesInputModal"
);
//Players Inputs Form
const MODAL_INPUT_FORM = document.querySelector("#players");

//Start button
const START_BUTTON = document.querySelector("#players #start");

//Event handler for the start button
START_BUTTON.addEventListener("click", startGame);

function startGame(ev) {
  ev.preventDefault(); //Prevents the start button from refreshing the page.

  //Get players name
  const PLAYER_X_NAME = document.querySelector("#players #X").value;
  const PLAYER_O_NAME = document.querySelector("#players #O").value;

  //if both players names are entered, start the game!!
  if (PLAYER_X_NAME !== "" && PLAYER_O_NAME !== "") {
    // Pass the players name and fire the gameBoard function to start the game.
    gameBoard(PLAYER_X_NAME, PLAYER_O_NAME);

    //Append the names in the score card
    const PLAYER_X_NAME_IN_SCORECARD = (document.querySelector(
      "#playerXname"
    ).innerText = PLAYER_X_NAME);
    const PLAYER_O_NAME_IN_SCORECARD = (document.querySelector(
      "#playerOname"
    ).innerText = PLAYER_O_NAME);

    //The Modal disappears to the top
    PLAYERS_NAME_INPUT_MODAL.classList.add("disappearFromTheTop");
  } else {
    //if one of the players names or both of them are omitted
    START_BUTTON.classList.add("error");

    //remove the class name from start button within the given time
    setTimeout(removeError, 500);
    function removeError() {
      START_BUTTON.classList.remove("error");
    }
  }
}

//GameBoard

function gameBoard(x_name, o_name) {
  const playerXscore = document.querySelector("#playerXScore");
  const playerOscore = document.querySelector("#playerOScore");
  const winLoseDrawStatus = document.querySelector("#winLoseDrawStatus");
  const boxes = document.querySelectorAll("[data-box]");
  const restart = document.querySelector("#restart");
  const quit = document.querySelector("#quit");

  //Conditions of winning
  const WINNING_COMBO = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //ScoreCard

  let playerXpoints = 0;
  let playerOpoints = 0;

  //This array corresponds with the boxes of the gameBoard
  const squares = Array(9).fill(null);

  // Factory Function
  function Players(name, marker) {
    const playerObj = { marker };

    Object.defineProperty(playerObj, "playerName", {
      get() {
        return name;
      },
      set(value) {
        name = value;
      },
    });

    return playerObj;
  }

  //Create players
  const PLAYER_X = Players(x_name, "X"); //Player X
  const PLAYER_O = Players(o_name, "O"); //Player O

  //By Default X starts the game
  let currentPlayer = PLAYER_X.marker;

  //Events

  boxes.forEach((b) => b.addEventListener("click", boxClicked));
  restart.addEventListener("click", restartClicked);
  quit.addEventListener("click", quitGame);

  //functions

  function boxClicked(ev) {
    let ind = ev.target.dataset.box;

    //if seleted value in "squares" array is null,then overide that value with "currentPlayer" value and then display the current player value in the web page.
    if (squares[ind] === null) {
      squares[ind] = currentPlayer;
      //Adds a class to the selected box.
      ev.target.classList.add(currentPlayer);

      //Once X's turn is over, its O's turn;
      if (currentPlayer === PLAYER_X.marker) {
        currentPlayer = PLAYER_O.marker;
        //And vice versa
      } else if (currentPlayer === PLAYER_O.marker) {
        currentPlayer = PLAYER_X.marker;
      }
    }

    //Who won or draw feature using IIFE
    (function () {
      let result;
      WINNING_COMBO.forEach((arrIndWC) => {
        //arrIndWC means Arrays Inside Winning combo arr
        const [a, b, c] = arrIndWC;
        // Check which player has won
        if (
          squares[a] &&
          squares[a] == squares[b] &&
          squares[a] == squares[c]
        ) {
          boxes.forEach((b) => {
            //The boxes in the gameBoard will be unclickable once the above condition is true
            b.classList.add("unclickable");
          });

          //X won
          if (squares[a] === PLAYER_X.marker) {
            result = `${PLAYER_X.playerName} has won`;
            winLoseDrawStatus.innerText = result;

            //Add a point for PlayerX
            playerXscore.innerText = ++playerXpoints;
          }

          //O won
          if (squares[a] === PLAYER_O.marker) {
            result = `${PLAYER_O.playerName} has won`;
            winLoseDrawStatus.innerText = result;

            //Add a point for PlayerO
            playerOscore.innerText = ++playerOpoints;
          }
        }
      });
      //Draw feature
      if (result === undefined && !squares.some((e) => e === null)) {
        winLoseDrawStatus.innerText = "Its a draw";
      }
    })();
  }

  //Restart the game
  function restartClicked(ev) {
    boxes.forEach((b) => {
      b.classList.remove("X");
      b.classList.remove("O");
      b.classList.remove("unclickable");
    }); //The values in the squares of the gameBoard will reset
    squares.fill(null); // The "squares" array values will be set to null again
    winLoseDrawStatus.innerText = "LET'S PLAY!!";
  }

  //Quit the game, brings you back to the modal
  function quitGame(ev) {
    //clear the board after the modal reappears
    setTimeout(clearBoard, 1000);

    function clearBoard() {
      boxes.forEach((b) => {
        b.classList.remove("X");
        b.classList.remove("O");
        b.classList.remove("unclickable");
      }); //The values on the gameBoard in the webpage will reset
      squares.fill(null);
      winLoseDrawStatus.innerText = "LET'S PLAY!!";

      //Reset ScoreCard
      playerXscore.innerText = playerXpoints = 0;
      playerOscore.innerText = playerOpoints = 0;
    }
    //Reset the current turn of the player back to the default player
    currentPlayer = PLAYER_X.marker;

    //Reset the inputs of the players name in modal
    MODAL_INPUT_FORM.reset();

    //Brings back the modal
    PLAYERS_NAME_INPUT_MODAL.classList.remove("disappearFromTheTop");
  }
}
