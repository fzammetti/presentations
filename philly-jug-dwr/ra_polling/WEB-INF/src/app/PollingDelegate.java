package app;

import java.util.Date;
import org.directwebremoting.ui.dwr.Util;

public class PollingDelegate {

  public void dummyMethod() {
    Util.setValue("divRAResponse", new Date(), true);
  }

}
