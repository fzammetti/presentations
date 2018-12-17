package com.etherient.testbed;


import android.animation.AnimatorListenerAdapter;
import android.animation.ValueAnimator;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.RatingBar;
import android.widget.Toast;


public class TestbedActivity extends Activity {
  
  @Override
  public void onCreate(Bundle savedInstanceState) {
    
    super.onCreate(savedInstanceState);

    setContentView(new MyDrawView(this));    
    
//  setContentView(R.layout.main);
//    
//    ((Button)findViewById(R.id.button1)).setOnClickListener(
//      new OnClickListener() {
//        public void onClick(final View inView) {
//          Intent intent = new Intent(Intent.ACTION_VIEW);
//          Uri u = Uri.parse("http://www.google.com");
//          intent.setData(u);
//          startActivity(intent);
//        }   
//      }
//    );
//  ((Button)findViewById(R.id.button2)).setOnClickListener(
//  new OnClickListener() {
//    public void onClick(final View inView) {
//      final RatingBar rb = (RatingBar)findViewById(R.id.ratingBar1);
//      ValueAnimator animation = ValueAnimator.ofInt(1, 2, 3, 4, 5).setDuration(5000);
//      animation.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
//        @Override
//        public void onAnimationUpdate(ValueAnimator animation) {
//          Log.i("testbed", animation.getAnimatedValue().toString());
//          rb.setNumStars((Integer)animation.getAnimatedValue());  
//        }
//      });
//      animation.start();
//    }   
//  }
//);     
       
  } // End onCreate().

  
  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    MenuInflater inflater = getMenuInflater();
    inflater.inflate(R.menu.mainmenu, menu);
    return true;
  }

  
  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    Toast.makeText(this, "Just a test", Toast.LENGTH_SHORT).show();
    return true;
  }  

	
} // End class.
