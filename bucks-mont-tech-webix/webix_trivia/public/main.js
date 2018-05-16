/**
 * Core code of the app lives in this singleton.
 */
const webixTrivia = {


  // Our Socket.io connection to the server.
  socket : null,

  // The unique ID of this player.
  playerID : localStorage.getItem("playerID"),

  // The name of this player.
  playerName : localStorage.getItem("playerName"),

  // The currently selected answer
  selectedAnswer : "",

  // The currently showing right or wrong answer alert, if any.
  alert : null,


  /**
   * Start the app up.  Builds the UI, hooks up communication with the server and generally kicks things off.
   */
  startup : () => {

    // Remove the loading text.
    webix.html.remove(webix.toNode("divLoading"));

    // Construct the UI and mask it.
    webix.ui(webixTrivia.sidemenu);
    webix.ui(webixTrivia.layout);
    webix.extend($$("baseLayout"), webix.ProgressBar);
    webixTrivia.maskUI();

    // A function that will be called either if this isn't a new player or after they've entered their name.
    const startupPart2 = () => {
      // Open a socket.io-based connection to the server.
      // noinspection JSUnresolvedFunction
      webixTrivia.socket = io(`${window.location.protocol}//${window.location.hostname}`);
      // Hook socket handler events.
      webixTrivia.socket.on("connected", webixTrivia.connected);
      webixTrivia.socket.on("validatePlayer", webixTrivia.validatePlayer);
      webixTrivia.socket.on("newGame", webixTrivia.newGame);
      webixTrivia.socket.on("nextQuestion", webixTrivia.nextQuestion);
      webixTrivia.socket.on("answerOutcome", webixTrivia.answerOutcome);
      webixTrivia.socket.on("endGame", webixTrivia.endGame);
      webixTrivia.socket.on("updateSettings", webixTrivia.updateSettings);
      // Populate the Info form.
      $$("infoIdentificationForm").setValues({ playerID : webixTrivia.playerID });
      // Unmask the UI and we're good to go.
      webixTrivia.unmaskUI();
    }; /* End startupPart2(). */

    // If this is a new player, ask them for their name.
    if (webixTrivia.playerID === null) {

      // Construct a new window and show it.
      const win = webix.ui({
        view : "window", move : false, width : 260, modal : true,
        position : "center", resize : false, id : "playerNameWindow", toFront : true,
        fullscreen : false, head : "Hello, new player!",
        body : { height : 140, rows : [
          { borderless : true, height : 30, template : "Please enter your name",
            css : { "text-align" : "center", "padding-top" : "10px", "padding-bottom" : "10px" }
          },
          { view : "text", id : "playerName", css : { "padding-bottom" : "10px" } },
          { view : "button", label : "Ok",
            click : () => {
              const enteredName = $$("playerName").getValue();
              // Don't proceed unless they actually entered something.
              if (enteredName !== null && enteredName.trim() !== "" && enteredName.length > 1) {
                webixTrivia.playerName = enteredName;
                $$("playerNameWindow").close();
                startupPart2();
              }
            }
          }
        ] }
      });
      win.show();

    } else {
      // Nope, not a new player, just start up the app now.
      startupPart2();
    }

  }, /* End startup(). */


  // ------------------------------------------------------------------------------------------------------------------
  // UI event handlers.
  // ------------------------------------------------------------------------------------------------------------------


  /**
   * Handle clicks on the hamburger icon.
   */
  hamburgerClick : () => {

    const sidemenu = $$("sidemenu");
    if (sidemenu.isVisible()) {
      sidemenu.hide();
    } else {
      sidemenu.show();
    }

  }, /* End hamburgerClick(). */


  /**
   * Handle clicks on sidemenu items.
   *
   * @param inItem The value of the item clicked.
   */
  sideMenuItemClick : (inItem) => {

    $$("sidemenu").hide();
    $$(inItem).show();

  }, /* End sideMenuItemClick(). */


  /**
   * Handle clicks on answer buttons.
   */
  answerButtonClick : function() {

    // Reset the state of all buttons to the default, except for the clicked one, make that one red (danger type).
    for (let i = 0; i < 6; i++) {
      const btn = $$(`answer${i}`);
      if (this === btn) {
        this.config.type = "danger";
      } else {
        btn.config.type = "";
      }
      btn.refresh();
    }

    // And of course, record the selected answer.
    webixTrivia.selectedAnswer = this.getValue();

  }, /* End answerButtonClick(). */


  /**
   * Handle clicks on the Submit Answer button.
   */
  submitAnswerButtonClick : function() {

    // Make sure they selected an answer.
    if (webixTrivia.selectedAnswer === "") {
      webix.message({ text : "Please select an answer", type : "error" });
    } else {
      // They did, so alert the server.
      webixTrivia.socket.emit("submitAnswer", { playerID : webixTrivia.playerID, answer : webixTrivia.selectedAnswer });
    }

  }, /* End submitAnswerButtonClick(). */


  /**
   * Handles clicks on the Update button on the Settings screen.
   */
  settingsUpdateButtonClick : function() {

    const enteredName = $$("settingsForm").getValues().playerName;
    if (enteredName !== null && enteredName.trim() !== "" && enteredName.length > 1) {
      webixTrivia.playerName = enteredName;
      webixTrivia.socket.emit("updateSettings", { playerID : webixTrivia.playerID, playerName : enteredName });
    }

  }, /* End settingsUpdateButtonClick(). */


  // ------------------------------------------------------------------------------------------------------------------
  // Socket message handlers.
  // ------------------------------------------------------------------------------------------------------------------


  /**
   * Handles connected messages from the server.
   */
  connected : function() {

    // Ask the server to validate the playerID.
    webixTrivia.socket.emit("validatePlayer", { playerID : webixTrivia.playerID, playerName : webixTrivia.playerName });

  }, /* End connected(). */


  /**
   * Handles validatePlayer messages from the server.
   *
   * @param inData The data object from the server.
   */
  validatePlayer : function(inData) {

    // Record the playerID and playerName, both transiently and durably.  Also, set it on the settings form.
    webixTrivia.playerID = inData.playerID;
    webixTrivia.playerName = inData.gameData.playerName;
    localStorage.setItem("playerID", webixTrivia.playerID);
    localStorage.setItem("playerName", inData.gameData.playerName);
    $$("settingsForm").setValues(inData.gameData);

    if (inData.gameInProgress) {

      // A game is in progress.  First things first: update the game info.
      inData.gameData.asked = inData.asked;
      $$("infoCurrentGameForm").setValues(inData.gameData);

      // Update the leaderboard.
      $$("leaderboardList").clearAll();
      $$("leaderboardList").parse(inData.leaderboard);

      if (inData.question && inData.gameData.answeredCurrentQuestion === false) {
        // There's currently a question in play AND this player hasn't answered it yet, so show it.
        webixTrivia.nextQuestion(inData.question);
      } else {
        // Show the leaderboard screen.
        $$("game").show();
        $$("leaderboard").show();
      }

    }

  }, /* End validatePlayer(). */


  /**
   * Handles newGame messages from the server.
   *
   * @param inData The data object from the server.
   */
  newGame : function(inData) {

    // Hide the previous alert, if any.
    webixTrivia.hideAlert();

    // Update the game info and leaderboard.
    inData.gameData.asked = inData.asked;
    $$("leaderboardList").clearAll();
    $$("leaderboardList").parse(inData.leaderboard);
    $$("infoCurrentGameForm").setValues(inData.gameData);

    // Show the leaderboard screen.
    $$("awaiting").show();
    $$("game").show();
    $$("leaderboard").show();

  }, /* End newGame(). */


  /**
   * Handles nextQuestion messages from the server.
   *
   * @param inData The data object from the server.
   */
  nextQuestion : function(inData) {

    // Hide the previous alert, if any.
    webixTrivia.hideAlert();

    // Make sure we start out with no selected answer.
    webixTrivia.selectedAnswer = "";

    // Show the question.
    $$("questionQuestion").setHTML(inData.question);

    // Populate the answers and reset their state.
    for (let i = 0; i < 6; i++) {
      const btn = $$(`answer${i}`);
      btn.setValue(inData.answers[i]);
      btn.config.type = "";
      btn.refresh();
    }

    // Show the question screen.
    $$("game").show();
    $$("question").show();

  }, /* End nextQuestion(). */


  /**
   * Handles answerOutcome messages from the server.
   *
   * @param inData The data object from the server.
   */
  answerOutcome : function(inData) {

    // Determine which message and message style to show.
    let title = "Sorry!";
    let msg = "That's not correct :(";
    let type = "wrongAlert";
    if (inData.correct) {
      title = "Hooray!";
      msg = "You got it right :)";
      type = "rightAlert";
    }

    // Update the game info.
    inData.gameData.asked = inData.asked;
    $$("infoCurrentGameForm").setValues(inData.gameData);

    // Show the leaderboard and an alert telling the player the result.
    $$("leaderboardList").clearAll();
    $$("leaderboardList").parse(inData.leaderboard);
    $$("game").show();
    $$("leaderboard").show();
    webixTrivia.alert = webix.alert({ title : title, text : msg, type : type,
      callback : () => { webixTrivia.alert = null }
    });

  }, /* End answerOutcome(). */


  /**
   * Handles endGame messages from the server.
   *
   * @param inData The data object from the server.
   */
  endGame : function(inData) {

    // Hide the previous alert, if any.
    webixTrivia.hideAlert();

    // Show the final leaderboard.
    $$("leaderboardList").clearAll();
    $$("leaderboardList").parse(inData.leaderboard);
    $$("awaiting").hide();
    $$("game").show();
    $$("leaderboard").show();

    if (inData.leaderboard[0].playerID === webixTrivia.playerID) {

      // They were the overall winner, pat 'em on the back!
      webixTrivia.alert = webix.alert({
        type : "customInfo", title : "Game over", text : "Congratulations! You were the winner!",
        callback : () => { webixTrivia.alert = null }
      });

    } else {

      // Nope, didn't quite pull off tge wun, so figure out what place they finished in and the appropriate text to
      // show.  We have to find their index in the array, and then attach an appropriate ordinal suffix to it.
      let place = "";
      let index = inData.leaderboard.findIndex((inPlayer) => inPlayer.playerID === webixTrivia.playerID);
      index++;
      const j = index % 10;
      const k = index % 100;
      if (j === 1 && k !== 11) {
        place = `${index}st`;
      } else if (j === 2 && k !== 12) {
        place = `${index}nd`;
      } else if (j === 3 && k !== 13) {
        place = `${index}rd`;
      } else {
        place = `${index}th`;
      }
      webixTrivia.alert = webix.alert({
        type : "info", title : "Game over", text : `You came in ${place} place`,
        callback : () => { webixTrivia.alert = null }
      });

    }

  }, /* End endGame(). */


  /**
   * Called when the player updates settings.
   *
   * @param inData The data object from the server.
   */
  updateSettings : function(inData) {

    localStorage.setItem("playerName", inData.playerName);
    webix.message({ type : "error", text : "Settings updated" });

  }, /* End updateSettings(). */


  // ------------------------------------------------------------------------------------------------------------------
  // Utility methods.
  // ------------------------------------------------------------------------------------------------------------------


  /**
   * Mask the entire UI.
   */
  maskUI : () => {

    const baseLayout = $$("baseLayout");
    baseLayout.disable();
    baseLayout.showProgress({ type : "icon" });

  }, /* End maskUI(). */


  /**
   * Unmasks the entire UI.
   */
  unmaskUI : () => {

    const baseLayout = $$("baseLayout");
    baseLayout.enable();
    baseLayout.hideProgress();

  }, /* End unmaskUI(). */


  /**
   * Hide currently showing alert, if any.
   */
  hideAlert : () => {

    if (webixTrivia.alert) {
      webix.modalbox.hide(webixTrivia.alert);
      webixTrivia.alert = null;
    }

  } /* End hideAlert(). */


}; /* End webixTrivia. */


webix.ready(webixTrivia.startup);
