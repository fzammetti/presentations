package com.etherient.goodbyeworld;


import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;


/**
 * Main activity for this application.
 */
public class GoodbyeWorldActivity extends Activity {

  
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
    
    // Hook event handler up to the button.
    Button button = (Button)findViewById(R.id.myButton);
    button.setOnClickListener(mButtonListener);
    
  } // End onCreate().

  
  /**
   * The onClick event handler for the button.
   */
  private OnClickListener mButtonListener = new OnClickListener() {
    public void onClick(final View inView) {
      TextView textView = (TextView)findViewById(R.id.myTextView);
      textView.setText("Goodbye, cruel world!");
    }
  };
  
    
} // End class.
