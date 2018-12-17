Ext.namespace("app");


Ext.onReady(function() {

  new Ext.Viewport({
    layout : "border", id : "mainLayout",
    items : [
      { region : "north", height : 56,
        items : [
          { xtype : "toolbar", border : false, id : "mainMenubar",
            items : [
              { text : "File",
                menu : {
                  items : [
                    { text : "New File" },
                    { text : "Load File" },
                    { text : "Save File" }
                  ]
                }
              },
              { text : "Edit",
                menu : {
                  items : [
                    { text : "Preferences" }
                  ]
                }
              },
              { text : "Help",
                menu : {
                  items : [
                    { text : "About This App" }
                  ]
                }
              },
            ]
          },
          { xtype : "toolbar", border : false, id : "mainToolbar",
            defaults : {
              handler : function(inButton) { app.toolbarClick(inButton.getId()); }
            },
            items : [
              { xtype : "tbspacer" },
              { xtype : "button", text : "Show Welcome Module",
                id : "global_welcome", icon : "img/tbWelcome.gif",
              },
              { xtype : "tbspacer" }, { xtype : "tbspacer" },
              { xtype : "tbspacer" }, { xtype : "tbspacer" },
              { xtype : "button", text : "Show Preferences Module",
                id : "global_preferences", icon : "img/tbPrefs.gif",
              },
              { xtype : "tbspacer" }, { xtype : "tbspacer" },
              { xtype : "tbspacer" }, { xtype : "tbspacer" },
              { xtype : "button", text : "Do Something In Current Module",
                id : "current_showAlert", icon : "img/tbSearch.gif",
              }
            ]
          }
        ]
      },
      { region : "center", layout : "fit", border : false, id : "mainContent" }
    ]
  });

  app.switchModule("welcome");

});


/**
 * Map of loaded modules.  Each element here is an object, keyed by module ID,
 * with three attributes:
 *   - modIFrame ...... Reference to the module's iFrame.
 *   - modDoc ......... Reference to the module's document object.
 *   - modController .. Reference to the module's controller object.
 */
app.loadedModules = { };


/**
 * The ID of the current module.
 */
app.currentModID = null;


/**
 * Changes to another module within the app.
 *
 * @param inModID The ID of the module to switch to.
 */
app.switchModule = function (inModID) {

  // Mask page while we work.
  Ext.getCmp("mainLayout").getEl().mask("Please wait, switching module...");

  // Disable all toolbar items except global items.
  Ext.getCmp("mainToolbar").items.each(function(inItem) {
    if (inItem.getId().indexOf("global_") == -1) {
      inItem.setDisabled(true);
    }
  });

  // Hide the module currently being viewed.
  if (app.currentModID) {
    app.loadedModules[app.currentModID].modController.hide();
    app.loadedModules[app.currentModID].modIFrame.hide();
  }

  if (app.loadedModules[inModID]) {

    // Module is already loaded, just show it.
    app.showModule(inModID, false);

  } else {

    // Module isn't loaded yet, go ahead and do that now.
    var iFrame = document.createElement("iframe");
    iFrame.setAttribute("id", "if_" + inModID);
    iFrame.setAttribute("name", "if_" + inModID);
    iFrame.frameBorder = "0";
    iFrame.style.width = "100%";
    iFrame.style.height = "99%";
    iFrame.style.position = "absolute";
    iFrame.style.left = "0px";
    iFrame.style.top = "6px";
    iFrame.src = "modules/" + inModID + "/main.htm";
    Ext.get("mainContent").appendChild(iFrame);

  }

}; // End switchModule().


/**
 * Callback called by a module onReady.
 *
 * @param inModID The ID of the module that was loaded.
 */
app.moduleLoaded = function(inModID) {

  app.showModule(inModID, true);

}; // End moduleLoaded().


/**
 * Called to show a module that has been loaded.
 *
 * @param inModID  ID of module to show.
 * @param inLoaded True if this is called right after a module was just
 *                 loaded, false otherwise.
 */
app.showModule = function(inModID, inLoaded) {

    // Record this as the current module.
    app.currentModID = inModID;

    // Add an object for this module into the collection of loaded modules.
    app.loadedModules[inModID] = {
      modIFrame : null, modDoc : null, modController : null
    };

    // Get reference to iFrame and show it.
    app.loadedModules[inModID].modIFrame = Ext.get("if_" + app.currentModID);

    // Get reference to document.
    var domIFrame = Ext.getDom("if_" + app.currentModID);
    app.loadedModules[app.currentModID].modDoc =
      domIFrame.document || domIFrame.contentWindow.document;

    // Get reference to module controller.
    app.loadedModules[app.currentModID].modController =
      app.loadedModules[app.currentModID].modDoc.moduleController

    // Call init() on module controller if module was just loaded.
    if (inLoaded) {
      app.loadedModules[app.currentModID].modController.init();
    }

    // Call show() on module controller.
    app.loadedModules[app.currentModID].modController.show();

    // Show the module and unmask page, we're done.
    app.loadedModules[inModID].modIFrame.show();
    Ext.getCmp("mainLayout").getEl().unmask();

}; // End showModule().


/**
 * Enables a given toolbar item.
 *
 * @param inID The ID of the item to enable.
 */
app.enableToolbarItem = function(inID) {

  Ext.getCmp(inID).setDisabled(false);

}; // End enableToolbarItem().


/**
 * Common function called when any toolbar button is clicked.
 *
 * @param inID The ID of the clicked button.
 */
app.toolbarClick = function(inID) {

  var parts = inID.split("_");

  // The functions called by a toolbar button can either be "global", that is,
  // a member of this app object, or "current", which means a members of the
  // current module's view controller.
  switch (parts[0]) {
    case "global":
      app[inID]();
    break;
    case "current":
      app.loadedModules[app.currentModID].modController.globalToolbar(parts[1]);
    break;
  }


}; // End toolbarClick().


/**
 * Function called with the welcome toolbar button is clicked.
 */
app.global_welcome = function() {

  app.switchModule("welcome");

}; // End global_welcome().


/**
 * Function called with the preferences toolbar button is clicked.
 */
app.global_preferences = function() {

  app.switchModule("preferences");

}; // End global_preferences().
