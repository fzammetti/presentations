package com.etherient.meatier;


import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebView;
import android.widget.Button;


/**
 * Main activity for this application.
 */
public class MeatierActivity extends Activity {
	
	
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
    ((Button)findViewById(R.id.button2)).setOnClickListener(
    	new OnClickListener() {
    	  public void onClick(final View inView) {
    	    WebView webView = (WebView)findViewById(R.id.webView1);     
    	    webView.loadUrl("http://www.google.com");
        }	  
      }
    );
    
  } // End onCreate().
  
  
} // End class.
