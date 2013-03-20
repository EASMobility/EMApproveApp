package com.ea.em.erp.prpoexpense;

/**
 * @author Venktesh Maudgalya
 */

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;

import org.apache.log4j.Logger;

// Using jettison JSON library
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.sql.SQLException;
import javax.sql.DataSource;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

@Path("/erpWfAction")
public class ERPWorkflowAction {

	private final static Logger log = Logger.getLogger(ERPWorkflowAction.class.getName()); 

	// Support POST request only i.e., GET is not supported
	@POST
	@Consumes("application/json")
	@Produces("application/json")
	public JSONObject invokeERPWorkflowActionSP(JSONObject reqJson) throws JSONException {
		Connection conn = null;
		DataSource dataSource = null;
		CallableStatement pstmt = null;
		JSONObject resJson = null;

		JSONObject reqParams = (JSONObject) reqJson.get("ApproveRejectReq");

		try {
			try {
				// Uses tomcat jdbc connection pooling
				Context initContext = new InitialContext();
				Context envContext = (Context) initContext.lookup("java:/comp/env");
				dataSource = (DataSource) envContext.lookup("jdbc/erpdb");
				try {
					conn = dataSource.getConnection();
				} catch (SQLException se) {
					log.info(se.getErrorCode() + "," + se.getMessage());
					
					resJson = createResponse(reqParams.getString("TID"), "601", se.getMessage());				
					return resJson;
				}
			} catch (NamingException ne) {
				ne.printStackTrace();
				resJson = createResponse(reqParams.getString("TID"), "601", ne.getMessage());				
				return resJson;
			}

			pstmt = conn.prepareCall("{call XXEA_MOBILITY_ACTION_API(?,?,?,?,?,?,?,?,?,?)}");
			pstmt.setString(1, reqParams.getString("DOCUMENTTYPE"));
			pstmt.setInt(2, Integer.parseInt(reqParams.getString("NID")));
			pstmt.setString(3, reqParams.getString("RESPONDERID"));
			pstmt.setString(4, reqParams.getString("ACTION"));
			pstmt.setString(5, reqParams.getString("ACTIONDATE"));
			pstmt.setString(6, reqParams.getString("NOTE"));
			pstmt.setString(7, reqParams.getString("DEVICEID"));
			pstmt.setString(8, reqParams.getString("FWDTOUSER"));
			pstmt.registerOutParameter(9, Types.VARCHAR);
			pstmt.registerOutParameter(10, Types.VARCHAR);
			log.info(pstmt);
			pstmt.executeUpdate();

			if (pstmt.getString(9).equals("S")) {
				resJson = createResponse(reqParams.getString("TID"), "200", pstmt.getString(10));
			} else if (pstmt.getString(9).equals("F")) {
				resJson = createResponse(reqParams.getString("TID"), "601", pstmt.getString(10));
			}
		} catch (SQLException se) {
			log.info(se.getErrorCode() + "," + se.getMessage());
			resJson = createResponse(reqParams.getString("TID"), "601", se.getMessage());
		} finally {
			/*
			 * Exceptions in this section deal with server cleanup so shouldn't be returned to the caller
			 */
			try {
				if (pstmt != null)
					pstmt.close();
			} catch (SQLException se) {
				log.info(se.getErrorCode() + "," + se.getMessage());
			}
			try {
				if (conn != null)
					conn.close();
			} catch (SQLException se) {
				log.info(se.getErrorCode() + "," + se.getMessage());
			}
		}

		return resJson;
	}
	
	// Create JSON response object
	private JSONObject createResponse(String tid, String code, String description) throws JSONException {
		JSONObject resJson = new JSONObject();
		JSONObject tidStatusJson = new JSONObject();
		JSONObject statusJson = new JSONObject();
		
		statusJson.put("Code", code);
		statusJson.put("Description", description);
		tidStatusJson.put("TID", tid);
		tidStatusJson.put("Status", statusJson);
		resJson.put("ApproveRejectRes", tidStatusJson);
		
		return resJson;
	}
}