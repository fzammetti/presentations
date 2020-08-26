package app;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;

@RemoteProxy
public class WordsOfWisdom {

  @RemoteMethod
  public String getWisdom(String inName, HttpServletRequest inRequest) throws
    ServletException, IOException {
      inRequest.setAttribute("userName", inName);
    return WebContextFactory.get().forwardToString("/wisdom.jsp");
  }

}
