package app;

public class HelloHuman {

  public String sayHelloNice(String inName) {
    return "Hello, " + inName + ", I'm happy to see you!";
  }

  public String sayHelloCold(String inName) {
    return "What's up, " + inName + "?  Not that I care.";
  }

  public String sayHelloMean(String inName) {
    return "Go to hell, " + inName + ", and tell the devil I said hi!";
  }

  public String notAllowed(String inName) {
    return "This shouldn't be callable";
  }

}
