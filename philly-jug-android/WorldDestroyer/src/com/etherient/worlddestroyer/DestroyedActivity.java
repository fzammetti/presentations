package com.etherient.worlddestroyer;


import android.app.Activity;
import android.os.Bundle;


/**
 * A secondary activity launched by the first.
 */
public class DestroyedActivity extends Activity {
  
	
  /**
   * Handle create lifecycle event.
   * 
   * @param inSavedInstanceState Saved state of the activity, if any.
   */ 	
  @Override
  public void onCreate(final Bundle inSavedInstanceState) {

    // Restore state, if any, and create UI.
    super.onCreate(inSavedInstanceState);
    setContentView(R.layout.destroyed);  
    
  } // End onCreate().
  
  
} // End class.
