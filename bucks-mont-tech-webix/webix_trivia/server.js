const app = require("http").createServer(handler);
const fs = require("fs");
const io = require("socket.io")(app);
const lodash = require("lodash");
const url = require("url");


const port = 80;
app.listen(port);


// Collection of player game data objects keyed by playerID.
const players = { };

// Is a game currently in progress?.
let gameInProgress = false;

// The questions for the game.
let questions = null;

// The current question in play.
let question = null;

// The condensed version of the current question that goes to the players (sans answers and info that could be used
// to cheat.
let questionForPlayers = null;

// The server-local time the current question began.
let questionStartTime = null;

// The number of questions asked during the current game.
let numberAsked = 0;


/**
 * Basic server event handler.  Just serves content out of the public directory for GET requests only.
 */
function handler(request, response) {

  try {

    console.log("handler()", request.method, request.url);

    if (request.method === "GET") {

      // Parse the incoming URL to get the filename portion.
      const parsedURL = url.parse(request.url);
      let filename = parsedURL.pathname;

      // Assure that we always have a non-null, trimmed filename with no starting forward-slash.
      if (filename === null) {
        filename = "";
      }
      filename = filename.trim();
      if (filename.startsWith("/")) {
        filename = filename.substring(1);
      }

      // If no specified filename then they get the index.html file.
      if (filename === "") {
        filename = "index.html";
      }

      // Construct the final full path.
      filename = `./public/${filename}`;

      // Determine content type based on extension, with a default of text/plain.
      const mimeTypes = {
        "css" : "text/css", "eot" : "application/vnd.ms-fontobject", "html" : "text/html", "ico" : "image/x-icon",
        "js" : "text/javascript", "map" : "application/x-navimap", "png" : "image/png", "svg" : "image/svg+xml",
        "swf" : "application/x-shockwave-flash", "ts" : "application/x-typescript", "ttf" : "application/x-font-ttf",
        "txt" : "text/plain", "woff" : "application/x-font-woff", "woff2" : "application/font-woff2"
      };
      const lastDot = filename.lastIndexOf(".");
      let extension = "";
      if (lastDot !== -1 && lastDot < filename.length) {
        extension = filename.substring(lastDot + 1);
      }
      let contentType = mimeTypes[extension];
      if (!contentType) {
        contentType = "text/plain";
      }

      // Read the file and send the result to the player, or an error response if the file can't be read for any reason.
      fs.readFile(filename, "binary",
        (inError, inData) => {
          if (inError) {
            response.writeHead(500, { "Content-Type" : "text/plain", "Content-Length" : 5 });
            response.end("Error", "binary");
          } else {
            response.writeHead(200, { "Content-Type" : contentType, "Content-Length" : inData.length });
            response.end(inData, "binary");
          }
        }
      );

    } /* End HTTP method check. */

  // Handle any unexpected problems, ensuring the server doesn't go down.
  } catch (inException) {
    console.log(inException);
  }

} /* End handler(). */


/**
 * Get a new gameData object.
 */
function newGameData() {

  console.log("newGameData()");

  return { right : 0, wrong : 0, totalTime : 0, fastest : 999999999, slowest : 0, average : 0, points : 0,
    answered : 0, answeredCurrentQuestion : false, playerName : null
  };

} /* End newGameData(). */


/**
 * Recalculate the leaderboard and return the new state.
 */
function calculateLeaderboard() {

  console.log("calculateLeaderboard()");

  // Get our players into an array.
  const playersArray = [ ];
  for (const playerID in players) {
    if (players.hasOwnProperty(playerID)) {
      const player = players[playerID];
      playersArray.push({ playerID : playerID, playerName : player.playerName, points : player.points });
    }
  }

  // Now sort that array based on points.
  playersArray.sort((inA, inB) => {
    const pointsA = inA.points;
    const pointsB = inB.points;
    if (pointsA > pointsB) {
      return -1;
    } else if (pointsA < pointsB) {
      return 1;
    } else {
      return 0;
    }
  });

  return playersArray;

} /* End calculateLeaderboard(). */


// noinspection JSUnresolvedFunction
/**
 * Handle the socket connection event.  All other events must be hooked up inside this.
 */
io.on("connection", socket => {


  console.log("connection");


  // ------------------------------------------------------------------------------------------------------------------
  // Player message handlers.
  // ------------------------------------------------------------------------------------------------------------------


  /**
   * When a player first connects, request it's playerID.
   */
  socket.emit("connected", { });


  /**
   * Once connected, the player calls this to validate them.  This really just adds them to the players collection and
   * generates a playerID, sending it back to the player, along with the current gameDate object for them.
   */
  socket.on("validatePlayer", inData => {

    try {

      console.log("validatePlayer", inData);

      // Construct the object that will be the response.
      const responseObject = { gameInProgress : gameInProgress, question : questionForPlayers,
        playerID : inData.playerID, gameData : newGameData(), asked : numberAsked, leaderboard : calculateLeaderboard()
      };
      responseObject.gameData.playerName = inData.playerName;

      if (!inData.playerID || !players[inData.playerID]) {
        // If there's no playerID or it's not a known ID, then treat this as a new player.  First, give them an ID.
        responseObject.playerID = `pi_${new Date().getTime()}`;
        // Now, make sure their name is unique.  If for some reason the player didn't pass in a name, then default it
        // to avoid errors (this condition really shouldn't be possible, but we'll be defensive anyway).
        if (!inData.playerName) {
          inData.playerName = "Player";
        }
        for (const playerID in players) {
          if (players.hasOwnProperty(playerID)) {
            if (inData.playerName === players[playerID].playerName) {
              responseObject.gameData.playerName += `_${new Date().getTime()}`;
            }
          }
        }
        // Finally, save their gameData object.
        players[responseObject.playerID] = responseObject.gameData;
      } else {
        // Otherwise, give them back the current game data.
        responseObject.gameData = players[inData.playerID];
      }

      socket.emit("validatePlayer", responseObject);

    // Handle any unexpected problems, ensuring the server doesn't go down.
    } catch (inException) {
      console.log(inException);
    }

  }); /* End validatePlayer handler. */


  /**
   * Triggered when the player clicks the Submit button to submit their answer.
   */
  socket.on("submitAnswer", inData => {

    try {

      console.log("submitAnswer", inData);

      // Only do anything if we know this client.  Nobody gets to sneak in!
      const gameData = players[inData.playerID];
      if (gameData) {

        let correct = false;

        // Set the flag so if the player reloads the page they don't answer this question again.  Also bump up the count
        // of how many they've answered.
        gameData.answeredCurrentQuestion = true;
        gameData.answered++;

        if (question.answer === inData.answer) {

          // They got it right, so bump up their right count, but also reduce their wrong count, since that was
          // incremented when the question began.
          players[inData.playerID].right++;
          players[inData.playerID].wrong--;

          // See how long it took and update the time-related values.
          const time = new Date().getTime() - questionStartTime;
          gameData.totalTime = gameData.totalTime + time;
          if (time > gameData.slowest) {
            gameData.slowest = time;
          }
          if (time < gameData.fastest) {
            gameData.fastest = time;
          }
          gameData.average = Math.trunc(gameData.totalTime / numberAsked);

          // Calculate the points to add.  This is based on a max amount of time allowed to answer.  For example, 15
          // seconds means they start of getting 60 points for a correct answer (maxTimeAllowed*4).  But then, for each
          // quarter second taken to answer (which is where the 4 comes from) we subtract 1 point, capping the loss at
          // the max points they could get.  So, in the end, if they take more than maxTimeAllowed seconds to answer
          // then they'll get no points, otherwise they'll get something less than or equal to maxTimeAllowed*4.
          // However, it's a bit unfair to take ALL their points, so at the end we give them 10 points regardless of
          // how long they took to answer.
          const maxTimeAllowed = 15;
          gameData.points = gameData.points + (maxTimeAllowed * 4);
          gameData.points = gameData.points - Math.min(Math.max(Math.trunc(time / 250), 0), (maxTimeAllowed * 4));
          gameData.points = gameData.points + 10;

          correct = true;

        }

        // Send the player the outcome, and tell all players to update the leaderboard.
        socket.emit("answerOutcome", { correct : correct, gameData : gameData, asked : numberAsked,
          leaderboard : calculateLeaderboard()
        });

      } /* End gameData existence check. */

    // Handle any unexpected problems, ensuring the server doesn't go down.
    } catch (inException) {
      console.log(inException);
    }

  }); /* End submitAnswer handler. */


  /**
   * Allow the user to change their settings.
   */
  socket.on("updateSettings", inData => {

    try {

      console.log("updateSettings", inData);

      // Save the new name once we find the player in the collection.
      if (inData.playerID && inData.playerName) {
        for (const playerID in players) {
          if (players.hasOwnProperty(playerID)) {
            if (inData.playerID === playerID) {
              players[playerID].playerName = inData.playerName;
            }
          }
        }
        socket.emit("updateSettings", { playerName : inData.playerName });
      }

    // Handle any unexpected problems, ensuring the server doesn't go down.
    } catch (inException) {
      console.log(inException);
    }

  }); /* End updateSettings handler. */


  // ------------------------------------------------------------------------------------------------------------------
  // Admin message handlers.
  // ------------------------------------------------------------------------------------------------------------------


  /**
   * Triggered when the admin clicks the New Game button to start a new game.
   */
  socket.on("newGame", () => {

    try {

      console.log("newGame");

      // Reset game tracking variables
      question = null;
      questionForPlayers = null;
      numberAsked = 0;
      gameInProgress = true;

      // Read in the questions file.  Have to do this at the start of every game because each call to nextQuestion()
      // removes a question from the array.
      // noinspection JSUnresolvedVariable
      questions = (JSON.parse(fs.readFileSync("questions.json", "utf8"))).questions;

      // Reset all current players to a have a new gameData object.  Remember that we'll be overwriting the gameData
      // object, which includes the player's name, so we'll need to capture that first and carry it over.
      for (const playerID in players) {
        if (players.hasOwnProperty(playerID)) {
          const playerName = players[playerID].playerName;
          players[playerID] = newGameData();
          players[playerID].playerName = playerName;
        }
      }

      // Tell all connected players that a new game is beginning.
      const responseObject = { gameInProgress : gameInProgress, question : null, playerID : null,
        gameData : newGameData(), asked : numberAsked, leaderboard : calculateLeaderboard()
      };
      const gd = newGameData();
      gd.asked = 0;
      // noinspection JSUnresolvedVariable
      socket.broadcast.emit("newGame", responseObject);

      // Finally, update the admin about the number of questions asked and remaining.
      socket.emit("updateStats", {
        stats : { asked : numberAsked, remaining : questions.length },
        leaderboard : calculateLeaderboard()
      });

    // Handle any unexpected problems, ensuring the server doesn't go down.
    } catch (inException) {
      console.log(inException);
    }

  }); /* End newGame handler. */


  /**
   * Triggered when the admin clicks the Next Question button to show a new question.  All connected players are told
   * what the question is.
   */
  socket.on("nextQuestion", () => {

    try {

      console.log("nextQuestion");

      // Show a message if the admin tried to send a question but there's no game in progress.
      if (!gameInProgress) {

        socket.emit("showMessage", { message : "There is no game in progress" });

      // Tell the admin when we've run out of questions so they can end the game.
      } else if (questions.length === 0) {

        socket.emit("showMessage", { message : "There are no more questions" });

      } else {

        // Reset the flag telling us if a player has already answered the current question (primarily needed so that if
        // the player reloads the page, we don't show them the question again).  Also, bump up their wrong count.  This
        // will be overridden if they get it right of course, but this way we count questions that haven't been answered
        // in time as wrong too.
        for (const playerID in players) {
          if (players.hasOwnProperty(playerID)) {
            players[playerID].answeredCurrentQuestion = false;
            players[playerID].wrong++;
          }
        }

        // Randomly choose a question and remove it from the questions array so it doesn't get chosen twice.
        let choice = Math.floor(Math.random() * questions.length);
        question = questions.splice(choice, 1)[0];

        // Construct a question object for the players.  This consists of the question and 6 possible answers, chosen at
        // random, and including the correct choice.
        questionForPlayers = { question : question.question, answers : [ ] };
        // Clone the decoys array so we can "reduce" it as we chose answers.
        // noinspection JSUnresolvedVariable
        const decoys = question.decoys.slice(0);
        for (let i = 0; i < 5; i++) {
          let choice = Math.floor(Math.random() * decoys.length);
          questionForPlayers.answers.push(decoys.splice(choice, 1)[0]);
        }

        // Don't forget the correct answer!
        questionForPlayers.answers.push(question.answer);

        // Now, to ensure the correct answer isn't always last, randomize the answers.
        questionForPlayers.answers = lodash.shuffle(questionForPlayers.answers);

        // Count off how many questions have been asked (since we can't tell this from the number of items in the
        // questions array because we reduce it with each question asked).
        numberAsked++;

        // Record the start time of this question.
        questionStartTime = new Date().getTime();

        // Tell all players that it's time for a question.
        // noinspection JSUnresolvedVariable
        socket.broadcast.emit("nextQuestion", questionForPlayers);

        // Finally, update the admin about the number of questions asked and remaining.
        socket.emit("updateStats", {
          stats : { asked : numberAsked, remaining : questions.length },
          leaderboard : calculateLeaderboard()
        });

      }

    // Handle any unexpected problems, ensuring the server doesn't go down.
    } catch (inException) {
      console.log(inException);
    }

  }); /* End nextQuestion handler. */


  /**
   * Triggered when the admin clicks the End Game button to show a new question.
   */
  socket.on("endGame", () => {

    try {

      console.log("endGame");

      // Show a message if the admin tried to end the game, but there's no game in progress.
      if (!gameInProgress) {
        socket.emit("showMessage", { message : "There is no game in progress" });
      }

      const leaderboard = calculateLeaderboard();

      // Tell all the players about the end of the game.
      // noinspection JSUnresolvedVariable
      socket.broadcast.emit("endGame", { leaderboard : leaderboard });

      // Update the admin about the final standings
      socket.emit("endGame", {
        stats : { asked : numberAsked, remaining : questions.length },
        leaderboard : calculateLeaderboard()
      });

      // Reset game variables.
      gameInProgress = false;
      questions = null;
      question = null;
      questionForPlayers = null;
      questionStartTime = null;
      numberAsked = 0;
      for (const playerID in players) {
        if (players.hasOwnProperty(playerID)) {
          const playerName = players[playerID].playerName;
          players[playerID] = newGameData();
          players[playerID].playerName = playerName;
        }
      }

    // Handle any unexpected problems, ensuring the server doesn't go down.
    } catch (inException) {
      console.log(inException);
    }

  }); /* End endGame handler. */


  /**
   * Service a request from the admin to update stats.  This happens when the admin page is loaded or reloaded.
   */
  socket.on("updateStats", () => {

    try {

      console.log("updateStats");

      // Show a message if the admin tried to end the game, but there's no game in progress.
      if (!gameInProgress) {
        socket.emit("showMessage", { message : "There is no game in progress" });
      } else {
        socket.emit("updateStats", {
          stats : { asked : numberAsked, remaining : questions.length },
          leaderboard : calculateLeaderboard()
        });
      }

    // Handle any unexpected problems, ensuring the server doesn't go down.
    } catch (inException) {
      console.log(inException);
    }

  }); /* End endGame handler. */


}); /* End connection event handler. */


console.log(`Server ready on port ${port}`);
