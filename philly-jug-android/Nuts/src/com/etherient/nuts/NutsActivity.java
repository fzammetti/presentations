package com.etherient.nuts;


import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;


/**
 * Main activity for this application.
 */
public class NutsActivity extends Activity {
  
  
  /**
   * Cached references to the two EditText widgets.
   */
  private EditText txtProperty;
  private EditText txtDatabase;
  
  
  /**
   * Handle create lifecycle event.
   * 
   * @param inSavedInstanceState Saved state of the activity, if any.
   */  
  @Override
  public void onCreate(Bundle savedInstanceState) {

    // Restore state, if any, and create UI.    
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
    
    // Cache references to EditText widgets we just created.
    this.txtProperty = (EditText)findViewById(R.id.txtProperty);
    this.txtDatabase = (EditText)findViewById(R.id.txtDatabase);
    
    // Restore the stored property value, if any.
    SharedPreferences settings = getPreferences(MODE_PRIVATE);
    String propValue = settings.getString("myProperty", "--Enter a value--"); 
    this.txtProperty.setText(propValue);    
    
    // Hook event handler up to the Save Property button.
    ((Button)findViewById(R.id.btnSaveProperty)).setOnClickListener(
      this.btnSavePropertyHandler
    );    

    // Hook event handler up to the Save To Database button.
    ((Button)findViewById(R.id.btnSaveToDatabase)).setOnClickListener(
      btnSaveToDBHandler
    );        

    // Hook event handler up to the Retrieve From Database button.
    ((Button)findViewById(R.id.btnRetrieveFromDatabase)).setOnClickListener(
      btnRetrieveFromDBHandler
    );    
    
  } // End onCreate().
  
  
  /**
   * Click handler for the Save Property button.
   */
  private OnClickListener btnSavePropertyHandler = new OnClickListener() {
    public void onClick(final View inView) {
      
      // Store the value of the first EditText as myProperty.
      SharedPreferences settings = getPreferences(MODE_PRIVATE);
      SharedPreferences.Editor editor = settings.edit();
      editor.putString("myProperty",
        NutsActivity.this.txtProperty.getText().toString()
      );
      editor.commit();
      
      // Alert that we're done.
      Toast.makeText(
        NutsActivity.this, "Property Saved", Toast.LENGTH_LONG
      ).show();
      
    }   
  };
  
  
  /**
   * Click handler for the Save To Database button.
   */
  private OnClickListener btnSaveToDBHandler = new OnClickListener() {
    public void onClick(final View inView) {
      
      // The real work is done in the save() method of our DBHelper.
      DBHelper dbHelper = new DBHelper(NutsActivity.this);
      dbHelper.save(NutsActivity.this.txtDatabase.getText().toString());
      
      // Alert that we're done.
      Toast.makeText(
        NutsActivity.this, "Saved To Database", Toast.LENGTH_LONG
      ).show();          
      
    }   
  };
  
  
  /**
   * Click handler for the Retrieve From Database button.
   */
  private OnClickListener btnRetrieveFromDBHandler = new OnClickListener() {
    public void onClick(final View inView) {
      
      // Get the value, convert to a CharSequence and populate EditText.
      DBHelper dbHelper = new DBHelper(NutsActivity.this);
      String storedValue = dbHelper.retrieve();          
      CharSequence cs = storedValue.subSequence(0, storedValue.length());
      NutsActivity.this.txtDatabase.setText(cs);
      
    }   
  };
  
  
} // End class.
