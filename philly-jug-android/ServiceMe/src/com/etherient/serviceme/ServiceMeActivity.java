package com.etherient.serviceme;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import com.etherient.serviceme.R;


/**
 * Main activity for this application.
 */
public class ServiceMeActivity extends Activity implements OnClickListener {

		
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
    
    // Hook button UI events using this class as the event handler.
    ((Button)findViewById(R.id.button1)).setOnClickListener(this);
    ((Button)findViewById(R.id.button2)).setOnClickListener(this);
    
  } // End onCreate().
  
  
  /**
   * Handle any hooked onClick events from any UI widget in the layout here.
   * 
   * @param inView The View (aka UI widget) that triggered the event.
   */   
  @Override
  public void onClick(final View inView) {
     
    switch (inView.getId()) {
      case R.id.button1:  
        startService(new Intent(this, MyService.class));
      break;
      case R.id.button2:
        stopService(new Intent(this, MyService.class));
      break;
    }
    
  } // End onClick().
  
  
} // End class.
