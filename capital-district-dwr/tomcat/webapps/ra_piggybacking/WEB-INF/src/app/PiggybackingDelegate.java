package app;

import org.directwebremoting.ui.dwr.Util;

public class PiggybackingDelegate {

  private static boolean firstRequestDone = false;

  public String remoteMethod() {
    if (firstRequestDone) {
      Util.setValue("divPiggybackResponse",
        "I tagged along!", true);
    }
    firstRequestDone = true;
    return "I was expected";
  }

}
