package com.etherient.nuts;


import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;


public class DBHelper extends SQLiteOpenHelper {

  
  /**
   * Constructor
   * 
   * @param inContext The execution context.
   */
  DBHelper(final Context inContext) {
    
    super(inContext, "MyDatabase", null, 2);
    
  } // End constructor.

  
  /**
   * Ensure our table is available.
   * 
   * @param inDatabase Our database.
   */
  @Override
  public void onCreate(final SQLiteDatabase inDatabase) {
    
    inDatabase.execSQL("CREATE TABLE IF NOT EXISTS myTable (myField TEXT)");
    
  } // End onCreate().


  /**
   * This method is an abstract, so we need an implementation, although it
   * doesn't need to do anything in this case.
   * 
   * @param inDatabase   Our database.
   * @param inOldVersion The old version of the database.
   * @param inNewVersion The new version of the database.
   */
  @Override
  public void onUpgrade(final SQLiteDatabase inDatabase, 
    final int inOldVersion, final int inNewVersion) {
  } // End onUpgrade().
  

  /**
   * Save a value to the database.
   * 
   * @param inValue The value to save.
   */
  public void save(final String inValue) {
    
    // For demo purposes we'll ensure there's always only one record.
    SQLiteDatabase database = getWritableDatabase();
    database.execSQL("DELETE FROM myTable");
    database.execSQL(
      "INSERT INTO myTable (myField) VALUES ('" + inValue + "')"
    );
    
  } // End save().

  
  /**
   * Get the value to the database.
   * 
   * @return The value from the database.
   */
  public String retrieve() {

    SQLiteDatabase database = getReadableDatabase();
    
    // Retrieve all records, all fields, grouping, sorting, etc.
    Cursor cursor = database.query(
      "myTable", null, null, null, null, null, null
    );
    cursor.moveToFirst();
    String value = cursor.getString(0);
    cursor.close();
    return value;
    
  } // End retrieve().
  
  
} // End class.
