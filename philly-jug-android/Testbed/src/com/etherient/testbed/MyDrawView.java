package com.etherient.testbed;


import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.View;


public class MyDrawView extends View {

  
  public MyDrawView(Context context) {
    super(context);
  }

  
  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    Paint paint = new Paint();
    paint.setColor(Color.GREEN);
    paint.setTextSize(25);
    paint.setAntiAlias(true);
    canvas.drawText("Hello World", 5, 30, paint); 
  }  

  
}