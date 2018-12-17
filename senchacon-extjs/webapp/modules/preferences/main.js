Ext.namespace("moduleController");
document.moduleController = moduleController;
Ext.onReady(function() {
  parent.app.moduleLoaded("preferences");
});


/**
 * Called when the module is first loaded.
 */
moduleController.init = function() {

  new Ext.Viewport({
    layout : "fit", id : "mainLayout", border : false,
    items : [
      { xtype : "tabpanel", activeItem : 0, plain : true,
        defaults : {
          listeners : {
            activate : function(inPanel) {
              moduleController.loadTab(inPanel);
            }
          }
        },
        items : [
          /* User Interface - Colors */
          uiColors.getConfig(),
          /* User Interface - Styles */
          uiStyles.getConfig(),
          /* Editor - Text */
          { title : "Editor Text", id : "editorText", border : false },
          /* Editor - Auto Save */
          { title : "Auto Save", id : "autoSave", border : false },
          /* Data - Loading */
          { title : "Data Loading", id : "dataLoading", border : false },
          /* Data - Saving */
          { title : "Data Saving", id : "dataSaving", border : false }
        ]
      }
    ]
  });

}; // End init().


/**
 * Called every time the module is shown (even the first time).
 */
moduleController.show = function() {

  parent.app.publish("preferences", "show", null);
  parent.app.enableToolbarItem("current_showAlert");

}; // End show().


/**
 * Called every time the module is hidden (i.e., switching to another module)
 * but NOT if the module is force-reloaded.
 */
moduleController.hide = function() {
}; // End hide().


/**
 * Loads the contents for a given tab and populates it, if not done already.
 *
 * @param inPanel A reference to the Panel (tab) being loaded.
 */
moduleController.loadTab = function(inPanel) {

  if (inPanel.items.length == 0) {
    Ext.getCmp("mainLayout").getEl().mask("Please wait, loading tab...");
    Ext.Ajax.request({
      url : inPanel.id + ".js",
      params : { tabID : inPanel.id },
      success : function(inResponse, inOpts) {
        eval(inResponse.responseText);
        inPanel.add(eval(inOpts.params.tabID).getConfig());
        inPanel.doLayout();
        Ext.getCmp("mainLayout").getEl().unmask();
      }
    });
  }

}; // End loadTab().


/**
 * Called when a global menu item is clicked that is targetted to the
 * current module.
 *
 * @param inID The ID of the clicked item.
 */
moduleController.globalMenu = function(inID) {
}; // End globalMenu().


/**
 * Called when a global toolbar button is clicked that is targetted to the
 * current module.
 *
 * @param inID The ID of the clicked button.
 */
moduleController.globalToolbar = function(inID) {

  if (inID == "showAlert") {
    Ext.MessageBox.show({ title : "Hello!", msg : "Thanks for clicking!" });
  }

}; // End globalToolbar().
