webix.ready(function() {

  webix.ui({
  	container : "main",
		cols : [
  		/* Col 1. */
  		{ width : 200 },
  		/* Col 2. */
  		{ view : "resizer" },
  		/* Col 3. */
  		{ rows : [
  			{ template : "Click it" },
    		{ view : "button", label : "Hello from Webix!",
					click : function() {
					  webix.message({ type : "debug", text : "Hello, hello!" });
					}
    	  }
    	] },
    	/* Col 4. */
    	{ view : "resizer" },
    	/* Col 5. */
  		{ width : 200 }
		]
  });

});
