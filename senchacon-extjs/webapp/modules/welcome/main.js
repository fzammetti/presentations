Ext.namespace("moduleController");
document.moduleController = moduleController;
Ext.onReady(function() {
  parent.app.moduleLoaded("welcome");
});


/**
 * Called when the module is first loaded.
 */
moduleController.init = function() {
}; // End init().


/**
 * Called every time the module is shown (even the first time).
 */
moduleController.show = function() {
}; // End show().


/**
 * Called every time the module is hidden (i.e., switching to another module)
 * but NOT if the module is force-reloaded.
 */
moduleController.hide = function() {
}; // End hide().


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
}; // End globalToolbar().
