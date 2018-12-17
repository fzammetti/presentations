package com.etherient.serviceme;


import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;


/**
 * A simple service to fill up our logs (see it live via adb logcat)
 */
public class MyService extends Service {
  
	
  // A Timer object to do our work.
  private Timer timer = new Timer();
	
	
  /**
   * Used for allowing binding to this service.  In this case, clients cannot
   * bind to the service, so null is returned.
   * 
   * @param  inIntent The Intent used to bind to this service.
   * @return          An IBinder through which clients can call on the service.
   */
  @Override
  public IBinder onBind(final Intent inIntent) {
	  
    return null;
    
  } // End on Bind().
	
  
  /**
   * Called when the service is first created.  
   */
  @Override
  public void onCreate() {
	  
    Toast.makeText(this, "My Service Created", Toast.LENGTH_LONG).show();
    
  } // End onCreate().

  
  /**
   * Called when the service is stopped.  
   */
  @Override
  public void onDestroy() {
	  
    this.timer.cancel();
    Toast.makeText(this, "My Service Stopped", Toast.LENGTH_LONG).show();
    
  } // End onDestroy().
	
  
  /**
   * Called when the service is started.
   * 
   * @param  inIntent  The Intent used to start the service.
   * @param  inFlags   Additional information about the start request.
   * @param  inStartID A unique value representing the specific start request.
   * @return           Value to tell the system about the services' start
   *                   state and how to handle it.
   */
  @Override
  public int onStartCommand(final Intent inIntent, final int inFlags,  
    final int inStartID) {
	  
    this.timer.scheduleAtFixedRate(
  	  new TimerTask() {
    		public void run() {
    		  Log.i("activity", Long.toString(new Date().getTime()));
    		}
      }, 0, 1000
    );	    
    
    return Service.START_STICKY;
	  
  } // End onStart().
    
    
} // End class.
