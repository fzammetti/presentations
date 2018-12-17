/**
 * Data model to represent a person.
 */
Ext.define("gridModel", {
  extend : "Ext.data.Model",
  fields : [
    { name : "firstName", type : "string" },
    { name : "lastName", type : "string" },
    { name : "age", type : "number" }
  ]
});


/**
 * Data store that backs the grid.
 */
var gridStore = Ext.create(
  "Ext.data.Store",
  { model : "gridModel" }
);


/**
 * Load initial grid data.
 */
var gridData = [
  { firstName : "John", lastName : "Sheridan" },
  { firstName : "Michael", lastName : "Garibaldi" }
];
gridStore.loadData(gridData);


/**
 * Execute code when the DOM is ready.
 */
Ext.onReady(function() {

  // Create our UI.
  Ext.create("Ext.container.Viewport", { layout : "border", items : [

    /* Header. */
    { region : "north", height : 50, title : "", bodyCls : "cssHeader",
      html : "Welcome to the second example!"
    }, /* End header. */

    /* Sidebar. */
    { region : "west", width : 200, collapsible : true, layout : "vbox",
      resizable : true, bodyStyle : "padding-left:10px;",
      defaults : { style : "margin-top:20px;" },
      items : [
        { xtype : "button", text : "About Us" },
        { xtype : "button", text : "Products" },
        { xtype : "button", text : "Contact Us" }
      ]
    }, /* End west. */

    /* Grid. */
    { region : "center", layout : "fit",
      items : [
        { xtype : "grid", store : gridStore, title : "Babylon 5 Command Staff",
          columns : [
            { header : "First Name", width : 120, dataIndex : "firstName" },
            { header : "Last Name", width : 120, dataIndex : "lastName" },
            { header : "Age", width : 90, dataIndex : "age" }
          ],
          dockedItems : [
            { xtype : "toolbar", dock : "top",
              items: [
                { text : "Add Records", handler : addRecords }
              ]
            }
          ]
        }
      ]
    } /* End center. */

  ]});

}); /* End onReady(). */


/**
 * Add some additional records to the grid on-the-fly.
 */
function addRecords() {

  var gridData = [
    { firstName : "Susan", lastName : "Ivanova", age : 36 },
    { firstName : "Stephen", lastName : "Franklin", age : 39 }
  ];
  gridStore.loadData(gridData, true);

} /* End addRecords(). */
