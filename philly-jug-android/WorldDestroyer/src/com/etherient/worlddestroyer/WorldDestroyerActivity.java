package com.etherient.worlddestroyer;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;


/**
 * Main activity for this application.
 */
public class WorldDestroyerActivity extends Activity {
	  
	
  /**
   * Handle create lifecycle event.
   * 
   * @param inSavedInstanceState Saved state of the activity, if any.
   */  
  @Override
  public void onCreate(final Bundle inSavedInstanceState) {

    // Restore state, if any, and create UI.
    super.onCreate(inSavedInstanceState);
    setContentView(R.layout.main);

    // Hook event handlers up to the buttons.
    Button button1 = (Button)findViewById(R.id.button1);
    button1.setOnClickListener(button1Listener);
    Button button2 = (Button)findViewById(R.id.button2);
    button2.setOnClickListener(button2Listener);   
    
  } // End onCreate().
  
  
  /**
   * The onClick event handler for the first button.
   */ 
  private OnClickListener button1Listener = new OnClickListener() {
    public void onClick(final View inView) {
      startActivity(new Intent(
        WorldDestroyerActivity.this, DestroyedActivity.class
      ));
    }
  };
  

  /**
   * The onClick event handler for the second button.
   */   
  private OnClickListener button2Listener = new OnClickListener() {
    public void onClick(final View inView) {
      startActivity(new Intent(Intent.ACTION_VIEW));
    }
  };
  
  
} // End class.
