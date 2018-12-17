/**
 * Namespace for this tab.
 */
Ext.namespace("uiStyles");


/**
 * Get the UI config object for this tab.
 */
uiStyles.getConfig = function() {
  return {
    title : "UI Styles",
    listeners : { activate : function(inPanel) { } },
    items : [
      { xtype : "form", width : 400, padding : 10, border : false,
        labelWidth : 150,
        items: [
          { xtype : "checkbox", fieldLabel : "Wrap Lines",
            boxLabel : "", anchor : "100%"
          },
          { xtype : "checkbox", fieldLabel : "Line Change Indicator",
            boxLabel : "", anchor : "100%"
          },
          { xtype : "checkbox", fieldLabel : "Brace Matching",
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
