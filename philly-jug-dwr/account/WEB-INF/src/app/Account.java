package app;

public class Account {

  private String acctNumber;
  private String shareholder;
  private Integer balance;

  public void setAcctNumber(String acctNumber) {
    this.acctNumber = acctNumber;
  }

  public String getAcctNumber() {
    return this.acctNumber;
  }

  public void setShareholder(String shareholder) {
    this.shareholder = shareholder;
  }

  public String getShareholder() {
    return this.shareholder;
  }

  public void setBalance(Integer balance) {
    this.balance = balance;
  }

  public Integer getBalance() {
    return this.balance;
  }

}
