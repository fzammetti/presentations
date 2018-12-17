package app;

import org.directwebremoting.ui.dwr.Util;

public class BackgroundThread extends Thread {

  private int count = 0;

  public void run() {
    while (true) {
      Util.setValue("divRAResponse",
        "Count: " + count, true);
      count = count + 1;
      try {
        sleep(1000);
      } catch (Exception e) { }
    }
  }

}
