package com.ea.em.PRPOExpense;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import com.ea.em.PRPOExpense.PRPOExpenseApprove;

public class PRPOExpenseStoredProcedure {

	public PRPOExpenseApprove PRApproveRequest(String T_ID, String P_DOCUMENT_TYPE, int P_NID, String P_RESPONDER_ID, 
			String P_ACTION, String P_ACTION_DATE, String P_NOTE, 
			String P_DEVICE_ID, String P_FWD_TO_USER) throws SQLException{
	int ret_code;
	Connection conn = null;
	DataSource dataSource;
	CallableStatement pstmt = null;
	PRPOExpenseApprove approve = new PRPOExpenseApprove();
	try {
	
		try {
		// Get DataSource
			Context initContext  = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:/comp/env");
			dataSource = (DataSource)envContext.lookup("jdbc/erpdb");
			conn = dataSource.getConnection();             
		} catch (NamingException e) {
		e.printStackTrace();
		}
		pstmt = conn.prepareCall("{call XXEA_MOBILITY_ACTION_API(?,?,?,?,?,?,?,?,?,?)}");
		pstmt.setString(1, P_DOCUMENT_TYPE);
		pstmt.setInt(2, P_NID);
		pstmt.setString(3,P_RESPONDER_ID);
		pstmt.setString(4,P_ACTION);
		pstmt.setString(5,P_ACTION_DATE);
		pstmt.setString(6,P_NOTE);
		pstmt.setString(7,P_DEVICE_ID);
		pstmt.setString(8,P_FWD_TO_USER);
		pstmt.registerOutParameter(9, Types.VARCHAR);
		pstmt.registerOutParameter(10, Types.VARCHAR);
		System.out.println(pstmt);
		pstmt.executeUpdate();
		
		String x_ret_code = pstmt.getString(9);
		String x_ret_msg = pstmt.getString(10);
		
		if(x_ret_code.equals("S")){
		approve.setxRetCodeText("200");
		}
		else if(x_ret_code.equals("F")){
		approve.setxRetCodeText("601");
		}
		approve.setxRetMsg(x_ret_msg);
		approve.settId(T_ID);
		
		}catch (SQLException e) {
		ret_code = e.getErrorCode();
		System.out.println(ret_code + e.getMessage()); 

		}finally{
		if (pstmt != null) 
			pstmt.close();
		if (conn != null){
			conn.close();
		}
		}
		return approve;
		
		}
	

	
	
}
