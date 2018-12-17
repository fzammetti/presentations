/**
 * Data model to represent a person.
 */
Ext.define("gridModel", {
  extend : "Ext.data.Model",
  fields : [
    { name : "firstName" },
    { name : "lastName" },
    { name : "age" }
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
 * Execute code when the DOM is ready (nothing to do in this case).
 */
Ext.onReady(function() {

  console.log("onReady()");

}); /* End onReady(). */


/**
 * Add the grid to the DOM when the link is clicked.
 */
function showGrid() {

  // Load some data into the data store.
  var gridData = [
    { firstName : "John", lastName : "Sheridan", age : 42 },
    { firstName : "Michael", lastName : "Garibaldi", age : 44 }
  ];
  gridStore.loadData(gridData);

  // Instantiate a grid widget and add it to the content div.
  new Ext.grid.GridPanel({
    store : gridStore,
    renderTo : Ext.getDom("content"),
    width : 400, height : 300,
    title : "Babylon 5 Command Staff",
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
  });

} /* End showGrid(). */


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
