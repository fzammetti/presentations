myApp.masterLayout = {
  rows : [
  	/* Row 1. */
  	{ template : "Bucks-Mont Technology", height : 200 },
  	/* Row 2. */
  	{ cols : [
  		/* Col 1. */
  		{ width : 200 },
  		/* Col 2. */
  		{ view : "resizer" },
  		/* Col 3. */
  		{ rows : [
  			{ template : "Click it" },
    		{ view : "button", label : "Hello from Webix!",
					click : myApp.buttonClick
    	  }
    	] },
    	/* Col 4. */
    	{ view : "resizer" },
    	/* Col 5. */
  		{ width : 200 }
  	] },
  	/* Row 3. */
  	{ template : "Frank Zammetti", height : 200 }
 ]
};
