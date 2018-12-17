package app;

public class Processor {

  public Account getAccount(SearchVO searchVO) {

    Account account = new Account();
    account.setAcctNumber(searchVO.getAcctNumber());
    account.setShareholder("Tapping, Amanda");
    account.setBalance(new Integer(25986));
    return account;

  }

}
