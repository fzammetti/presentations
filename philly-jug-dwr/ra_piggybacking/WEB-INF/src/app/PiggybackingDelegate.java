package app;

import org.directwebremoting.ui.dwr.Util;

public class PiggybackingDelegate {

  public String remoteMethod() {
    Util.setValue("divPiggybackResponse",
      "I tagged along!", true);
    return "I was expected";
  }

}
