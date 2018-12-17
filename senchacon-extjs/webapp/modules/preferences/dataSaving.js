/**
 * Namespace for this tab.
 */
Ext.namespace("dataSaving");


/**
 * Get the UI config object for this tab.
 */
dataSaving.getConfig = function() {
  return [
    { html : "Coming soon!", border : false, padding : 10 }
  ]
};


/**
 * Subscribe for notfication of show message.
 */
parent.app.subscribe("preferences", "show",
  function(inPayload) {
  }
);
