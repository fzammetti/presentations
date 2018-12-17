/**
 * Namespace for this tab.
 */
Ext.namespace("uiColors");


/**
 * Get the UI config object for this tab.
 */
uiColors.getConfig = function() {
  return {
    title : "UI Colors",
    listeners : { activate : function(inPanel) { } },
    items : [
      { xtype : "form", width : 400, padding : 10, border : false,
        labelWidth : 150,
        items: [
          { xtype : "combo", fieldLabel : "Background Color",
            anchor : "100%",  mode : "local",
            store : [ "aaa", "bbb" ]
          },
          { xtype : "combo", fieldLabel : "Text Color", anchor : "100%",
            mode : "local",
            store : [ "aaa", "bbb" ]
          },
          { xtype : "checkbox", fieldLabel : "Highlight Current Line",
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
