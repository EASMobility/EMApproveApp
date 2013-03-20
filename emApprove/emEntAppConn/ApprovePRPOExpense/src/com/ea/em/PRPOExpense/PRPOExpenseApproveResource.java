package com.ea.em.PRPOExpense;

import java.sql.SQLException;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import com.ea.em.PRPOExpense.PRPOExpenseApprove;
import com.ea.em.PRPOExpense.PRPOExpenseStoredProcedure;

@Path("/")
	public class PRPOExpenseApproveResource {
		PRPOExpenseStoredProcedure storedProc = new PRPOExpenseStoredProcedure();
		
		@POST 
		@Consumes(MediaType.APPLICATION_JSON)
		@Produces(MediaType.APPLICATION_JSON)
		public JSONObject callPRDetails(JSONObject reqJson) throws SQLException {
			PRPOExpenseApprove res = null;
			JSONObject resJson = null;
			String reqString = reqJson.toString();
			try {
				JSONObject jsonObject = new JSONObject(reqString);
				JSONObject req = jsonObject.getJSONObject("ApproveRejectReq");			
				
				res = storedProc.PRApproveRequest(req.get("TID").toString(), req.get("DOCUMENTTYPE").toString(), Integer.parseInt(req.get("NID").toString()), req.get("RESPONDERID").toString(), 
										   req.get("ACTION").toString(), req.get("ACTIONDATE").toString(), req.get("NOTE").toString(), req.get("DEVICEID").toString(), 
										   req.get("FWDTOUSER").toString());
				
			} catch (JSONException e){
				e.printStackTrace();
			}
			String resString = "{\"ApproveRejectRes\":{\"TID\":\"" + res.gettId() + "\"," + "\"Status\":{\"Code\":\"" + res.getxRetCodeText() + 
							"\"," + "\"Description\":\"" + res.getxRetMsg() + "\"}}}";
			
			System.out.println("resString " + resString);
			
			try {
				resJson = new JSONObject(resString);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			
			System.out.println("response from oracle" + res.toString());
			
			return resJson;		
		}		
	}	
		



