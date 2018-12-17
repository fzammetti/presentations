/**
 * Namespace for this tab.
 */
Ext.namespace("autoSave");


/**
 * Get the UI config object for this tab.
 */
autoSave.getConfig = function() {
  return {
    border : false, listeners : { activate : function(inPanel) { } },
    items : [
      { xtype : "form", width : 400, padding : 10, border : false,
        labelWidth : 150,
        items: [
          { xtype : "textfield", fieldLabel : "Time Between Saves",
            anchor : "100%"
          },
          { xtype : "checkbox", fieldLabel : "Save Unnamed Files",
            boxLabel : "", anchor : "100%"
          }
        ]
      }
    ]
  };
};


/**
 * Subscribe for notfication of show message.
 */
parent.app.subscribe("preferences", "show",
  function(inPayload) {
  }
);
