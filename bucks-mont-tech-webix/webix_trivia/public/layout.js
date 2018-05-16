/**
 * Define the sidemenu component.
 */
webixTrivia.sidemenu = {

  view : "sidemenu", id : "sidemenu", width : 200, position : "left", css : "cssSideMenu",
  state : (inState) => {
    // Move and resize the sidemenu so it is below the header and the remaining length of the screen.
    const headerHeight = $$("header").$height;
    inState.top = headerHeight;
    inState.height -= headerHeight;
  },
  body : {
    rows : [
      { view : "list", scroll : true, select : false, type : { height : 40 },
        template : `<span class="webix_icon fa-#icon#"></span> #value#`, click : webixTrivia.sideMenuItemClick,
        data : [
          { id : "game", value : "Game", icon : "trophy" },
          { id : "info", value : "Info", icon : "info-circle" },
          { id : "settings", value : "Settings", icon : "cog" },
          { id : "about", value : "About", icon : "question" }
        ]
      }
    ]
  }

}; /* End sidemenu. */


/**
 * Define the main app layout.
 */
webixTrivia.layout= { id : "baseLayout", rows : [

  /* ########## Header. ########## */
  { view : "toolbar", id : "header",
    elements : [
      { view: "icon", icon: "bars", click : webixTrivia.hamburgerClick },
      { id : "headerLabel", view: "label", label : "Welcome!" }
    ]
  }, /* End Header. * /

  /* ########## Multiview. ########## */
  { view : "multiview", id : "multiview", animate : { type : "flip", subtype : "horizontal" },
    css : { padding : "10px" },
    cells : [

      /* ===== Game. ===== */
      { view : "multiview", id : "game", borderless : true,
        cells : [

          /* -- Welcome screen. -- */
          { id : "welcome", borderless : true,
            rows : [
              { },
              { cols : [
                  { },
                  { type : "clean", width : 440, height : 380,
                    template : "<img src=\"logo.png\" width=\"380\" height=\"280\">"
                  },
                  { }
              ] },
              { }
            ]
          }, /* End Welcome screen. */

          /* -- Leaderboard screen. -- */
          { id : "leaderboard", template : "leaderboard", borderless : true,
            rows : [
              { view : "label", align : "center", css : { "font-size":"20pt!important", "font-weight" : "bold" },
                label : "Current Leaderboard", height : 80 },
              { id : "leaderboardList", height : 200, view : "list", select : false, data : [ ],
                template : (inPlayer) => {
                  const you = inPlayer.playerID === webixTrivia.playerID;
                  return `${you ? "<div style=\"font-weight:bold;\">" : ""}
                    ${inPlayer.playerName} - ${inPlayer.points} points
                    ${you ? "(YOU!)" : ""}${you ? "</div>" : ""}`;
                }
              },
              { height : 80 },
              { height : 100,
                cols : [
                  { width : 20 },
                  { id : "awaiting", view : "label", align : "center", css : "spinText",
                  	label : "Awaiting&nbsp;question"
                  },
                  { width : 40 }
                ]
              }
            ]
          }, /* End Leaderboard screen. */

          /* -- Question screen. -- */
          { id : "question", template : "question", borderless : true,
            /* Question. */
            rows : [
              { height : 20 },
              { cols : [
                  { width : 10 },
                  { id : "questionQuestion", view : "template", height : 100, borderless : true,
                    css : {
                      "font-weight" : "bold", "color" : "#ff0000!important", "font-size" : "16pt!important",
                      "text-align" : "center"
                    }
                  },
                  { width : 24 }
              ] },
              /* Spacer. */
              { height : 20 },
              /* Answers. */
              { cols : [
                  { width : 10 },
                  { rows : [
                    { view : "button", height : 50, id : "answer0", click : webixTrivia.answerButtonClick },
                    { view : "button", height : 50, id : "answer1", click : webixTrivia.answerButtonClick },
                    { view : "button", height : 50, id : "answer2", click : webixTrivia.answerButtonClick },
                    { view : "button", height : 50, id : "answer3", click : webixTrivia.answerButtonClick },
                    { view : "button", height : 50, id : "answer4", click : webixTrivia.answerButtonClick },
                    { view : "button", height : 50, id : "answer5", click : webixTrivia.answerButtonClick }
                  ] },
                  { width : 24 }
              ] },
              /* Spacer. */
              { },
              /* Submit button. */
              { cols : [
                  { width : 10 },
                  { rows : [
                    { view : "button", height : 50, value : "Submit Answer", type : "form",
                      click : webixTrivia.submitAnswerButtonClick
                    }
                  ] },
                  { width : 24 }
              ] },
              { height : 20 }
            ]
          }, /* End Question screen. */

          /* -- Outcome screen. -- */
          { id : "outcome", template : "outcome", borderless : true
          } /* End Outcome screen. */

        ] /* End Game cells. */

      }, /* End Game. */

      /* ===== Info. ===== */
      { id : "info", view : "scrollview", body : {
        cols : [
          { rows : [
            { view : "fieldset", label : "Identification",
              body : { view : "form", borderless : true, id : "infoIdentificationForm",
                elementsConfig : { view : "text", readonly : true, labelPosition : "top" },
                elements : [
                  { label : "Player ID", name : "playerID" }
                ]
              }
            },
            { height : 10 },
            { view : "fieldset", label : "Current Game",
              body : { view : "form", borderless : true, id : "infoCurrentGameForm",
                elementsConfig : { view : "text", readonly : true, labelPosition : "top" },
                elements : [
                  { label : "Asked", name : "asked" },
                  { label : "Answered", name : "answered" },
                  { label : "Points", name : "points" },
                  { label : "Right", name : "right" },
                  { label : "Wrong", name : "wrong" },
                  { label : "Total Time", name : "totalTime" },
                  { label : "Slowest", name : "slowest" },
                  { label : "Fastest", name : "fastest" },
                  { label : "Average", name : "average" }
                ]
              }
            },
          ] },
          { width : 20 }
        ]
        } }, /* End Info. */

      /* ===== Settings. ===== */
      { id : "settings", cols : [
        { rows : [
          { view : "form", borderless : true, id : "settingsForm",
            elementsConfig : { view : "text", labelPosition : "top" },
            elements : [
              { label : "Name", name : "playerName" },
              { view : "spacer", height : 20 },
              { view : "button", label : "Update", height : 50, click : webixTrivia.settingsUpdateButtonClick }
            ]
          },
          { }
        ] },
        { width : 20 }
      ] }, /* End Settings. */

      /* ===== About. ===== */
      { id : "about",
        cols : [
          { },
          { rows : [
              { },
              { css : "aboutScreenLine", type : "clean", template : "Webix Trivia" },
              { css : "aboutScreenLine", type : "clean", template : "v1.0" },
              { css : "aboutScreenLine", type : "clean",
                template : "Created for the May 17, 2018 Bucks-Mont Technology meetup"
              },
              { css : "aboutScreenLine", type : "clean", template : "by Frank W. Zammetti" },
              { }
          ] },
          { }
        ]
      } /* End About. */

    ] /* End Multiview cells. */
  } /* End Multiview. */

] }; /* End layout. */
