/**
 * App singleton.
 */
const myApp = {


	/**
	 * The layout config object, filled in from second_app_layout.js.
	 */
	layout : null,


	/**
	 * Build the UI and do any other necessary startup tasks.
	 */
	start : function() {

  	webix.ui(myApp.masterLayout);

	}, /* End start(). */


	/**
	 * Handle click of the button.
	 */
	buttonClick : function() {

		webix.message({ type : "debug", text : "Hello, hello!" });

	} /* End buttonClick(). */


}; /* End myApp. */


webix.ready(myApp.start);
