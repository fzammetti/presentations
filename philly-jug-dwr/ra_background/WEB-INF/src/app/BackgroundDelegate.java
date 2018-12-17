package app;

import org.directwebremoting.Browser;
import org.directwebremoting.ui.dwr.Util;

public class BackgroundDelegate {

  public void dummyMethod() {
    BackgroundThread bt = new BackgroundThread();
    bt.setDaemon(true);
    Browser.withCurrentPage(bt);
  }

}
