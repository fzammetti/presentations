/**
 * A Model that represents a feed.  Persistently saves to LocalStorage using
 * a localstorage proxy.
 */
Ext.define("Feed", {
  fields : [ "title", "description", "url" ],
  extend : "Ext.data.Model",
  proxy : { type : "localstorage", id  : "feeds" }
});


/**
 * A Model that represents an article.
 */
Ext.define("Article", {
  fields : [ "title", "content", "published", "link", "author" ],
  extend : "Ext.data.Model"
});


/**
 * A Store that holds our list of feeds.
 */
var feedsStore = Ext.create("Ext.data.Store", {
  model : "Feed",
  sorters : [
    { property : "title", direction : "ascending",
      /* Need to transform the title to sort properly (otherwise caps */
      /* sort before lower-case and we'll get a list that's not */
      /* ordered properly. */
      transform : function(inVal) {
        return inVal.toLowerCase();
      }
    }
  ]
});


/**
 * Store containing the articles of the currently selected feed, if any.
 */
var articlesStore = Ext.create("Ext.data.Store", { model : "Article" });


/**
 * Execute code when the DOM is ready.
 */
Ext.onReady(function() {

  // Initialize quicktips for tooltips on grid cells.
  Ext.tip.QuickTipManager.init();

  // Load existing feeds.
  feedsStore.load();

  // Create our UI.
  Ext.create("Ext.container.Viewport", {
    id : "mainViewport", layout : "border",
    items : [

      /* Header. */
      { region : "north", height : 66, title : " ", header : false,
        html : "<h1>&nbsp;ExtJS RSS Reader</h1>"
      }, /* End header. */

      /* Feeds pane. */
      { region : "west", width : 300, collapsible : true, resizable : true,
        split : true, title : "Feeds", layout : "fit",
        items : [
          { xtype : "grid", store : feedsStore, hideHeaders : true,
            listeners : { itemClick : feedClickHandler },
            viewConfig : { overItemCls : "cssRowHover" },
            id : "feedsGrid",
            columns : [
              { dataIndex : "title", flex : 1,
                /* Render a tooltip for this feed. */
                renderer : function(inValue, inMetaData, inRecord) {
                  inMetaData.tdAttr = "data-qtip=\"" +
                    inRecord.get("description") + "<br><br>" +
                    inRecord.get("url") + "\"";
                  return inValue;
                }
              }
            ]
          }
        ],
        dockedItems : [
          { xtype : "toolbar", dock : "top", ui : "footer",
            items: [
              { text : "Add Feed", icon : "icoAddFeed.png",
                id : "btnAddFeed", handler : addFeed },
              { text : "Delete Feed", icon : "icoDeleteFeed.png",
                disabled : true, id : "btnDeleteFeed", handler : deleteFeed
              },
              { text : "Delete ALL Feeds", icon : "icoDeleteAllFeeds.png",
                id : "btnDeleteAllFeeds", handler : btnDeleteAllFeedsHandler
              }
            ]
          }
        ]
      }, /* End west. */

      /* Articles pane. */
      { region : "center", layout : "border", title : " ", header : false,
        items : [
          { region : "west", width : 400, collapsible : true, resizable : true,
            split : true, layout : "fit", autoScroll : true,
            title : "Articles", bodyStyle : "padding:10px;",
            id : "articlesList",
            items : [
              { xtype : "dataview",  store : articlesStore,
                overItemCls : "cssRowHover",
                itemSelector : "div.thumb-wrap",
                /* Template for an article item in the DataView.  Note the */
                /* use of date formatting. */
                tpl : new Ext.XTemplate(
                  '<tpl for=".">',
                    '<div class="thumb-wrap {[xindex % 2 === 0 ? ' +
                    '"cssAltRow" : "cssNormalRow"]}">',
                      '<div class="cssArticleTitle">{title}</div>',
                      '<div class="cssArticleInfo">',
                        '{published:date("m/d/Y h:ia")} by {author}',
                      '</div>',
                    '</div>',
                  '</tpl>'
                ),
                listeners : { itemClick : articleClickHandler }
              }
            ]
          },
          /* Articles get displayed in an iFrame.  While ExtJS has an */
          /* iFrame component, it's still an UX (User eXtension) so I */
          /* decided not to use it in favor of something simpler. */
          { region : "center", title : "Article", id : "articleContent",
            html : "<iframe id=\"articleIFrame\" " +
              "style=\"border:none;\" width=\"100%\" height=\"100%\">"
          }
        ]
      } /* End center. */

    ]
  });


}); /* End onReady(). */


/**
 * Handles clicks on the Add Feed button on the Feeds pane.
 */
function addFeed() {

  /* Show our window for adding a feed. */
  Ext.create("Ext.window.Window", {
    title : "Add Feed", width : 620, modal : true, resizable : false,
    listeners : {
      show : function() {
        Ext.getCmp("addFeedTitle").focus();
      }
    },
    items : [
      { bodyStyle : "padding:8px;", xtype : "form",
        fieldDefaults : {
          labelWidth : 80, labelClsExtra : "bold x-unselectable",
          labelSeparator : "", msgTarget : "side"
        },
        items : [
          { xtype : "textfield", fieldLabel : "Title",
            allowBlank : false, width : 80 + 260, maxLength : 20,
            enforceMaxLength : true, name : "title", id : "addFeedTitle",
            emptyText : "required"
          },
          { xtype : "textfield", fieldLabel : "Description",
            allowBlank : false, width : 80 + 500, maxLength : 100,
            enforceMaxLength : true, name : "description",
            emptyText : "required"
          },
          { xtype : "textfield", fieldLabel : "URL",
            allowBlank : false, width : 80 + 500, maxLength : 100,
            enforceMaxLength : true, name : "url", vtype : "url",
            emptyText : "required"
          }
        ],
        dockedItems: [
          { xtype : "toolbar", dock : "bottom", ui : "footer",
            items : [
              { xtype : "button", text : "Cancel",
                icon : "icoAddFeedCancel.png",
                handler : btnAddFeedCancel
              },
              "->",
              /* Binding the button to the form provides automatic */
              /* enable/disable based on form validity in realtime. */
              { xtype : "button", text : "Add", disabled : true,
                formBind : true, icon : "icoAddFeedSave.png",
                handler : btnAddFeedSave
              }
            ]
          }
        ]
      }
    ]
  }).show(Ext.getCmp("btnAddFeed"));

} /* End addFeed(). */


/**
 * Handle clicks on the Cancel button on the Add Feed window.
 */
function btnAddFeedCancel() {

  // Hide the window so that we get a close animation, then actually close it.
  this.up("window").hide(Ext.getCmp("btnAddFeed"), function() {
    this.close();
  });

} /* End btnAddFeedCancel(). */


/**
 * Handle clicks on the Save button on the Add Feed window.
 */
function btnAddFeedSave() {

  // Form is valid, go ahead and add this feed to the store, being sure to sync
  // with LocalStorage.
  feedsStore.add(this.up("form").getValues());
  feedsStore.sync();

  // Close the window, which the Cancel button handler does for us, but we
  // have to give it the right context for it to work.
  Ext.Function.bind(btnAddFeedCancel,this)();

} /* End btnAddFeedSave(). */


/**
 * Handles clicks on the Delete Feed button on the Feeds pane.
 */
function deleteFeed() {

  // Confirm they really want to do this.
  var currentFeed =
    Ext.getCmp("feedsGrid").getSelectionModel().getSelection()[0];
  Ext.MessageBox.show({
    animateTarget : Ext.getCmp("btnDeleteFeed").getEl(),
    buttons : Ext.MessageBox.YESNO, defaultFocus : "no",
    closable : false, icon : Ext.MessageBox.WARNING,
    title : "Delete Feed",
    message : "Are you sure you want to delete the feed \"" +
      currentFeed.get("title") + "\"?",
    fn : function(inButtonID) {
      if (inButtonID.toLowerCase() === "yes") {
        // Yessir, good to go, remove the feed from the Store and sync
        // LocalStorage.
        feedsStore.remove(currentFeed);
        feedsStore.sync();
        // Also clean up the UI.
        articlesStore.removeAll();
        Ext.getCmp("btnDeleteFeed").disable();
        Ext.getCmp("articlesList").setTitle("Articles");
        Ext.getCmp("articleContent").setTitle("Article");
        Ext.get("articleIFrame").set({ src : "about:blank" });
      }
    }
  });

} /* End deleteFeed(). */


/**
 * Handles clicks on the Delete ALL Feeds button on the Feeds pane.
 */
function btnDeleteAllFeedsHandler() {

  // Confirm they really want to do this.
  Ext.MessageBox.show({
    animateTarget : Ext.getCmp("btnDeleteAllFeeds").getEl(),
    buttons : Ext.MessageBox.YESNO, defaultFocus : "no",
    closable : false, icon : Ext.MessageBox.WARNING,
    title : "Delete ALL Feeds",
    message : "Are you sure you want to delete ALL feeds?",
    fn : function(inButtonID) {
      if (inButtonID.toLowerCase() === "yes") {
        // Yessir, good to go, remove all from the Store and sync LocalStorage.
        feedsStore.removeAll();
        feedsStore.sync();
        // Also clean up the UI.
        articlesStore.removeAll();
        Ext.getCmp("btnDeleteFeed").disable();
        Ext.getCmp("articlesList").setTitle("Articles");
        Ext.getCmp("articleContent").setTitle("Article");
        Ext.get("articleIFrame").set({ src : "about:blank" });
      }
    }
  });

} /* End deleteAllFeeds(). */


/**
 * Handles clicks on rows in the Feeds list.
 *
 * @param inGrid   The Feeds list Grid.
 * @param inRecord The selected Record associated with the selected feed.
 */
function feedClickHandler(inGrid, inRecord) {

  // Mask the UI while we do our work here.
  Ext.getCmp("mainViewport").mask("Please wait, reading feed...");

  // Construct the URL to our proxy server including the URL of the feed to
  // retrieve articles for.
  var currentFeed =
    Ext.getCmp("feedsGrid").getSelectionModel().getSelection()[0];
  var requestURL = "http://localhost:8080?" +
    Ext.Object.toQueryString({ feedURL : currentFeed.get("url") });

  // Call our proxy server to get a list of articles.  Note the cors and
  // userDefaultXhrHeader options, which are needed to allow for cross-domain
  // AJAX requests (in conjunction with the appropriate header set on the part
  // of the server).
  Ext.Ajax.request({
    url : requestURL, cors : true, useDefaultXhrHeader : false,
    success : function(inResponse) {
      // Decode the JSON response, the list of articles and load them into the
      // articlesStore.
      articlesStore.loadData(Ext.decode(inResponse.responseText));
      // Enable the Delete Feed button.
      Ext.getCmp("btnDeleteFeed").enable();
      // Set the title of the articles list.
      Ext.getCmp("articlesList").setTitle(
        "Articles - " + currentFeed.get("title")
      );
      // Finally, unmask the UI so the user can continue.
      Ext.getCmp("mainViewport").unmask();
    },
    failure : function (inResponse) {
      // We'll do some very poor error handling: make sure the UI is unmasked
      // and then just pop an alert and display whatever error we got back from
      // the server.  Not very elegant, but sufficient for our needs.
      Ext.getCmp("mainViewport").unmask();
      Ext.MessageBox.alert(
        "Failure retrieving articles", inResponse.responseText
      );
    }
  });

} /* End feedClickHandler(). */


/**
 * Handles clicks on items in the Articles list.
 *
 * @param inDataView The Articles list DataView.
 * @param inRecord   The selected Record associated with the selected article.
 */
function articleClickHandler(inDataView, inRecord) {

  // Clear the iFrame and mask the UI.
  Ext.get("articleIFrame").set({ src : "about:blank" });
  Ext.getCmp("mainViewport").mask("Please wait, loading article...");

  // Set title for the article content pane.
  Ext.getCmp("articleContent").setTitle(
    inRecord.get("title") + " (" +
    Ext.util.Format.date(inRecord.get("published"), "m/d/Y h:ia") + " by " +
    inRecord.get("author") + ")"
  );

  // We want to be alerted when the article finishes loading so we can unmask
  // the UI.
  Ext.get("articleIFrame").set({
    onload : "Ext.getCmp('mainViewport').unmask();"
  });

  // Finally, load the article's URL into the iFrame.
  Ext.get("articleIFrame").set({ src : inRecord.get("link") });

} /* End articleClickHandler(). */
