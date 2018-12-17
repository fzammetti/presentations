Ext.onReady(function() {
  Ext.create("Ext.container.Viewport", getViewportConfig());
  store1.loadData(generateData(6, 20));
});


window.generateData = function(n, floor){
  var data = [ ];
  floor = (!floor && floor !== 0) ? 20 : floor;
  for (var i = 0; i < (n || 12); i++) {
    data.push({
      name : Ext.Date.monthNames[i % 12],
      data1 : Math.floor(Math.max((Math.random() * 100), floor)),
      data2 : Math.floor(Math.max((Math.random() * 100), floor)),
      data3 : Math.floor(Math.max((Math.random() * 100), floor)),
      data4 : Math.floor(Math.max((Math.random() * 100), floor)),
      data5 : Math.floor(Math.max((Math.random() * 100), floor)),
      data6 : Math.floor(Math.max((Math.random() * 100), floor)),
      data7 : Math.floor(Math.max((Math.random() * 100), floor)),
      data8 : Math.floor(Math.max((Math.random() * 100), floor)),
      data9 : Math.floor(Math.max((Math.random() * 100), floor))
    });
  }
  return data;
};


var store = Ext.create("Ext.data.JsonStore", {
  fields : [ "year", "comedy", "action", "drama", "thriller" ],
  data : [
    { year : 2005, comedy : 34000000, action : 23890000, drama : 18450000,
      thriller : 20060000
    },
    { year : 2006, comedy : 56703000, action : 38900000, drama : 12650000,
      thriller : 21000000
    },
    { year : 2007, comedy : 42100000, action : 50410000, drama : 25780000,
      thriller : 23040000
    },
    { year : 2008, comedy : 38910000, action : 56070000, drama : 24810000,
      thriller : 26940000
    }
  ]
});
window.store1 = Ext.create("Ext.data.JsonStore", {
  fields : ["name", "data1", "data2", "data3", "data4", "data5", "data6",
    "data7", "data9", "data9"
  ],
  data : generateData()
});
window.store3 = Ext.create("Ext.data.JsonStore", {
  fields : ["name", "data1", "data2", "data3", "data4", "data5", "data6",
    "data7", "data9", "data9"
  ],
  data : generateData()
});
window.store4 = Ext.create("Ext.data.JsonStore", {
  fields : ["name", "data1", "data2", "data3", "data4", "data5", "data6",
    "data7", "data9", "data9"
  ],
  data : generateData()
});
window.store5 = Ext.create("Ext.data.JsonStore", {
  fields : ["name", "data1", "data2", "data3", "data4", "data5", "data6",
    "data7", "data9", "data9"
  ],
  data : generateData()
});


var pieChart = Ext.create("Ext.chart.Chart", {
  xtype : "chart", animate : true, store : store1, shadow : true,
  legend : { position : "right" }, insetPadding : 60, theme : "Base:gradients",
  series : [
    { type : "pie", field : "data1", showInLegend : true, donut : false,
      tips : {
        trackMouse : true, width : 140, height : 28,
        renderer : function(inStoreItem) {
          var total = 0;
          store1.each(function(inRec) {
            total += inRec.get("data1");
          });
          this.setTitle(
            inStoreItem.get("name") + ": " +
            Math.round(inStoreItem.get("data1") / total * 100) + "%"
          );
        }
      },
      highlight : { segment : { margin : 20 } },
      label : {
        field : "name", display : "rotate", contrast : true, font : "18px Arial"
      }
    }
  ]
});


var barChart = Ext.create("Ext.chart.Chart", {
  animate : true, shadow : true, store : store, legend : { position : "right" },
  axes : [
    { type : "Numeric", position : "bottom", grid : true,
      fields : [ "comedy", "action", "drama", "thriller" ], title : false,
      label : {
        renderer : function(inVal) {
          return String(inVal).replace(/(.)00000$/, ".$1M");
        }
      }
    },
    { type : "Category", position : "left", fields : [ "year" ], title : false }
  ],
  series : [
    { type : "bar", axis : "bottom", gutter : 80, xField : "year",
      yField : [ "comedy", "action", "drama", "thriller" ], stacked : true,
      tips : {
        trackMouse : true, width : 65, height : 28,
        renderer : function(inStoreItem, inItem) {
          this.setTitle(String(inItem.value[1] / 1000000) + "M");
        }
      }
    }
  ]
});


var areaChart = Ext.create("Ext.chart.Chart", {
  style : "background:#fff", animate : true, store : store1,
  legend : { position : "bottom" },
  axes : [
    { type : "Numeric", position : "left", title : "Number of Hits",
      fields : [
        "data1", "data2", "data3", "data4", "data5", "data6", "data7"
      ],
      grid : {
        odd : {
          opacity : 1, fill : "#ddd", stroke : "#bbb", "stroke-width" : 1
        }
      },
      minimum : 0, adjustMinimumByMajorUnit : 0
    },
    { type : "Category", position : "bottom", fields : [ "name" ],
      title : "Month of the Year", grid : true,
      label : { rotate : { degrees : 315 } }
    }
  ],
  series : [
    { type : "area", highlight : false, axis : "left", xField : "name",
      yField : [
        "data1", "data2", "data3", "data4", "data5", "data6", "data7"
      ],
      style : { opacity : 0.93 }
    }
  ]
});


var lineChart = Ext.create("Ext.chart.Chart", {
  style : "background:#fff", animate : true, store : store1, shadow : true,
  theme : "Category1", legend : { position : "right" },
  axes : [
    { type : "Numeric", minimum : 0, position : "left",
      fields : [ "data1", "data2", "data3" ],
      title : "Number of Hits", minorTickSteps : 1,
      grid : {
        odd : {
          opacity : 1, fill : "#ddd", stroke : "#bbb", "stroke-width" : 0.5
        }
      }
    },
    { type : "Category", position : "bottom", fields : [ "name" ],
      title : "Month of the Year"
    }
  ],
  series : [
    { type : "line", highlight : { size : 7, radius : 7 },
      axis : "left", xField : "name", yField : "data1",
      markerConfig : {
        type : "cross", size : 4, radius : 4, "stroke-width" : 0
      }
    },
    { type : "line", highlight : { size : 7, radius : 7 },
      axis : "left", smooth : true, xField : "name", yField : "data2",
      markerConfig : {
        type : "circle", size : 4, radius : 4, "stroke-width" : 0
      }
    },
    { type : "line", highlight : { size : 7, radius : 7 }, axis : "left",
      smooth : true, fill : true, xField : "name", yField : "data3",
      markerConfig : {
        type : "circle", size : 4, radius : 4, "stroke-width" : 0
      }
    }
  ]
});


var seriesConfig = function(inField) {
  return {
    type : "radar", xField : "name", yField : inField, showInLegend : true,
    showMarkers : true, markerConfig : { radius : 5, size : 5 },
    tips : {
      trackMouse : true, width : 100, height : 28,
      renderer : function(inStoreItem) {
        this.setTitle(
          inStoreItem.get("name") + ": " + inStoreItem.get(inField)
        );
      }
    },
    style : { "stroke-width" : 2, fill : "none" }
  }
};
var radarChart = Ext.create("Ext.chart.Chart", {
  style : "background:#fff", theme : "Category2", animate : true,
  store : store1, insetPadding : 20, legend : { position : "right" },
  axes : [
    { type : "Radial", position : "radial", label : { display : true } }
  ],
  series : [
    seriesConfig("data1"), seriesConfig("data2"), seriesConfig("data3")
  ]
});


function getViewportConfig() { return(

  { border : 0, layout : "border",
    items : [

      { region : "north", height : 60,
        title : "Note: this example uses ExtJS 4.2.1 due to some " +
          "compatibility issues with the latest version",
        items : [
          { xtype : "button", text : "Pie chart", style : "margin-right:10px;",
            handler : function() {
              Ext.getCmp("centerCard").getLayout().setActiveItem(1);
            }
          },
          { xtype : "button", text : "Bar chart", style : "margin-right:10px;",
            handler : function() {
              Ext.getCmp("centerCard").getLayout().setActiveItem(2);
            }
          },
          { xtype : "button", text : "Area chart", style : "margin-right:10px;",
            handler : function() {
              Ext.getCmp("centerCard").getLayout().setActiveItem(3);
            }
          },
          { xtype : "button", text : "Line chart", style : "margin-right:10px;",
            handler : function() {
              Ext.getCmp("centerCard").getLayout().setActiveItem(4);
            }
          },
          { xtype : "button", text : "Radar chart", style : "margin-right:10px;",
            handler : function() {
              Ext.getCmp("centerCard").getLayout().setActiveItem(5);
            }
          }
        ]
      },

      { region : "center", layout : "card", id : "centerCard",
        items : [
          { html : "&nbsp;" },
          pieChart, barChart, areaChart, lineChart, radarChart
        ]
      }

    ]
  }

);}
