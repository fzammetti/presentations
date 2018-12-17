/**
 * Namespace for this tab.
 */
Ext.namespace("editorText");


/**
 * Get the UI config object for this tab.
 */
editorText.getConfig = function() {
  return {
    border : false, listeners : { activate : function(inPanel) { } },
    items : [
      { xtype : "form", width : 400, padding : 10, border : false,
        labelWidth : 150,
        items: [
          { xtype : "sliderfield", value : 40, fieldLabel : "Font Size",
            anchor : "100%"
          },
          { xtype : "combo", fieldLabel : "Font", anchor : "100%",
            mode : "local",
            store : [ "Arial", "Helvetica", "Sans Serif" ]
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
