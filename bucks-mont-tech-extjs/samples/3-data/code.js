/**
 * The raw data that backs our Stores.
 */
var rawData = [
  { firstName : "John", lastName : "Sheridan", age : 42, rank : "Captain" },
  { firstName : "Susan", lastName : "Ivanova", age : 36, leaf : true,
    rank : "Commander"
  },
  { firstName : "Michael", lastName : "Garibaldi", age : 44 },
  { firstName : "Zac", lastName : "Allan", age : 33, leaf : true },
  { firstName : "Marcus", lastName : "Cole", age : 27, leaf : true },
  { firstName : "Stephen", lastName : "Franklin", age : 39 },
  { firstName : "Lyta", lastName : "Alexander", age : 39, leaf : true },
  { firstName : "Londo", lastName : "Mollari", age : 63},
  { firstName : "Alex", lastName : "Morden", age : 51}
];
// Add text field for display in DataView.
for (var i = 0; i < rawData.length; i++) {
  rawData[i].text = rawData[i].firstName + " " + rawData[i].lastName;
}
// Create hierarchy for use in Tree.
rawData[0].children = [ rawData[1] ];
rawData[2].children = [ rawData[3], rawData[4] ];
rawData[5].children = [ rawData[6] ];


/**
 * Data model to represent a person.  Note that some raw data fields are
 * ignored, which is fine.
 */
Ext.define("personModel", {
  extend : "Ext.data.Model",
  fields : [
    { name : "text", type : "string" },
    { name : "firstName", type : "string" },
    { name : "lastName", type : "string" },
    { name : "age", type : "number" },
    { name : "rank", type : "string", defaultValue : "Unknown" }
  ]
});


/**
 * Data store that backs the Grid, DataView and Chart.
 */
var commonStore = Ext.create(
  "Ext.data.Store", {
    model : "personModel", data : rawData,
    sorters : [
      { property : "lastName", direction : "ascending" },
      { property : "age", direction : "descending" }
    ]
  }
);


/**
 * Data store that backs the Tree.
 */
var treeStore = Ext.create("Ext.data.TreeStore", {
  root : { text : "Staff",
    children : [ rawData[0], rawData[2], rawData[5] ]
  }
});


/**
 * Execute code when the DOM is ready.
 */
Ext.onReady(function() {

  // Create our UI.
  Ext.create("Ext.container.Viewport", { layout : "border", items : [

    /* Grid. */
    { region : "center", layout : "card", id : "centerArea",
      title : "Babylon 5 Command Staff",
      dockedItems : [
        { xtype : "toolbar", dock : "bottom",
          items: [
            { text : "Show As Grid",
              handler : function() {
                Ext.getCmp("centerArea").getLayout().setActiveItem(0);
              }
            },
            { text : "Show As Tree",
              handler : function() {
                Ext.getCmp("centerArea").getLayout().setActiveItem(1);
              }
            },
            { text : "Show As DataView",
              handler : function() {
                Ext.getCmp("centerArea").getLayout().setActiveItem(2);
              }
            },
            { text : "Show As Chart",
              handler : function() {
                Ext.getCmp("centerArea").getLayout().setActiveItem(3);
              }
            }
          ]
        }
      ],
      items : [

        /* Grid. */
        { xtype : "grid", store : commonStore,
          features : [ { ftype : "grouping" } ],
          columns : [
            { header : "First Name", width : 120, dataIndex : "firstName",
              groupable : false
            },
            { header : "Last Name", width : 120, dataIndex : "lastName",
              groupable : false
            },
            { header : "Age", width : 90, dataIndex : "age",
              groupable : false
            },
            { header : "Rank", width : 120, dataIndex : "rank",
              sortable : false
            }
          ],
          dockedItems : [
            { xtype : "toolbar", dock : "top",
              items: [
                { text : "Filter Out Old Dudes",
                  handler : function() {
                    commonStore.filterBy(function(inRecord) {
                      return inRecord.get("age") < 50;
                    });
                  }
                }
              ]
            }
          ]
        },

        /* Tree. */
        { xtype : "treepanel", store : treeStore },

        /* DataView. */
        { xtype : "dataview", store : commonStore, autoScroll : true,
          itemSelector : "div.thumb-wrap",
          tpl : new Ext.XTemplate(
            '<tpl for=".">',
            '<div style="margin:10px;" class="thumb-wrap">',
            '<img src="{lastName}.jpg" />',
            '<br/><span>{text}</span>',
            '</div>',
            '</tpl>'
          )
        },

        /* Chart. */
        { xtype : "cartesian", store : commonStore,
          axes : [
            { type : "numeric", position : "left", title : "Age" },
            { type : "category", position : "bottom", title : "Name" }
          ],
          series : { type : "bar", xField : "text", yField : "age" }
        }

      ]
    } /* End center. */

  ]});

}); /* End onReady(). */
