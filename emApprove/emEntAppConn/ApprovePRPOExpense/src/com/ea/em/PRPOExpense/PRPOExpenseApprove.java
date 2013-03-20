package com.ea.em.PRPOExpense;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class PRPOExpenseApprove {

	@Override
	public String toString() {
		return "PRPOExpenseApprove [xRetCodeText=" + xRetCodeText
				+ ", xRetMsg=" + xRetMsg + ", tId=" + tId + "]";
	}
	private String xRetCodeText;
	private String xRetMsg;
	private String tId;
	
	public String gettId() {
		return tId;
	}
	public void settId(String tId) {
		this.tId = tId;
	}
	public String getxRetCodeText() {
		return xRetCodeText;
	}
	public void setxRetCodeText(String xRetCodeText) {
		this.xRetCodeText = xRetCodeText;
	}
	public String getxRetMsg() {
		return xRetMsg;
	}
	public void setxRetMsg(String xRetMsg) {
		this.xRetMsg = xRetMsg;
	}
	
	

}

	
	
	