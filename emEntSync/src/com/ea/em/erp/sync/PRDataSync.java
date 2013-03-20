package com.ea.em.erp.sync;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;
import java.util.Set;
import org.apache.log4j.Logger;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import org.quartz.Job;
import org.quartz.JobExecutionContext;

import redis.clients.jedis.Jedis;

public class PRDataSync implements Job {

	Connection conn = null;
	Properties prop = new Properties();
	int pr_cache_databaseIndex;
	String pr_cache_host;
	int pr_cache_port;

	PreparedStatement statement = null;
	ResultSet resultset = null;

	private final static Logger log = Logger.getLogger(PRDataSync.class.getName());

	@Override
	public void execute(JobExecutionContext arg0) {

		try {
			prop.load(getClass().getClassLoader().getResourceAsStream("config.properties"));
			pr_cache_host = prop.getProperty("pr_cache_host");
			pr_cache_port = Integer.parseInt(prop.getProperty("pr_cache_port"));
			pr_cache_databaseIndex = Integer.parseInt(prop.getProperty("pr_cache_databaseIndex"));
			DataSource dataSource;
			Context initContext = new InitialContext();
			Context envContext = (Context) initContext.lookup("java:/comp/env");
			dataSource = (DataSource) envContext.lookup("jdbc/erpdb");
			conn = dataSource.getConnection();
			worklistItemsLoad(conn);
			PRLinesLoad(conn);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}

	// To populate database for Worklist items
	public void worklistItemsLoad(Connection conn) throws SQLException, InterruptedException {
		String empNumberQuery = "select APPROVER_EMPLOYEE_NUMBER, NOTIFICATION_ID, REQUISITION_NUMBER, REQUISITION_HEADER_ID, DESCRIPTION, "
				+ "AMOUNT, STATUS, APPROVAL_REQUESTED_DATE, APPROVED_DATE, APPROVAL_REQUESTED_BY, TO_USER, REQUESTOR " + "from XXEA_MOBILITY_PR_APPR_STATUS_V";

		log.info("Executing query:" + empNumberQuery.toString());
		statement = conn.prepareStatement(empNumberQuery.toString());
		resultset = statement.executeQuery();

		// Connect to Redis server
		Jedis myedis = new Jedis(pr_cache_host, pr_cache_port);
		myedis.select(pr_cache_databaseIndex);
		myedis.connect();
		log.info("Redis Connected...");

		int notIdCount = 0;
		while (resultset.next()) {
			String appUserId = "", notId = "", keyVal = "", requisitionNo = "";

			notIdCount++;

			appUserId = resultset.getString("APPROVER_EMPLOYEE_NUMBER");
			notId = resultset.getString("NOTIFICATION_ID");
			requisitionNo = resultset.getString("REQUISITION_NUMBER");

			if (appUserId == null || notId == null || requisitionNo == null) {
				log.info("Received NULL Id:" + " APPROVER_EMPLOYEE_NUMBER = " + appUserId + " NOTIFICATION_ID =  " + notId + " REQUISITION_NUMBER = " + requisitionNo);
			}

			if (!(appUserId == null || notId == null)) {
				keyVal = "PR-" + notId;
				try {
					String reqHeaderID = "", reqNo = "", desc = "", amt = "", status = "", toUser = "", requestor = "", appDateString = "", appReqByString = "";
					Timestamp ts;
					SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss");

					reqHeaderID = resultset.getString("REQUISITION_HEADER_ID");
					if (reqHeaderID == null)
						reqHeaderID = "";
					reqNo = resultset.getString("REQUISITION_NUMBER");
					if (reqNo == null)
						reqNo = "-";
					desc = resultset.getString("DESCRIPTION");
					if (desc == null)
						desc = "-";
					amt = resultset.getString("AMOUNT");
					if (amt == null)
						amt = "-";
					status = resultset.getString("STATUS");
					if (status == null)
						status = "-";

					ts = resultset.getTimestamp("APPROVAL_REQUESTED_DATE");
					java.util.Date appReqDate = new java.util.Date(ts.getTime());
					String appReqDateString = formatter.format(appReqDate);

					if (appReqDateString == null)
						appReqDateString = "-";

					ts = resultset.getTimestamp("APPROVED_DATE");
					if (ts != null) {
						java.util.Date appDate = new java.util.Date(ts.getTime());
						appDateString = formatter.format(appDate);
					} else
						appDateString = "-";

					// log.info("appDateString== " +
					// appDateString);

					ts = resultset.getTimestamp("APPROVAL_REQUESTED_BY");
					if (ts != null) {
						java.util.Date appReqBy = new java.util.Date(ts.getTime());
						appReqByString = formatter.format(appReqBy);
					} else
						appReqByString = "-";

					toUser = resultset.getString("TO_USER");
					if (toUser == null)
						toUser = "-";
					requestor = resultset.getString("REQUESTOR");
					if (requestor == null)
						requestor = "-";

					HashMap<String, String> records = new HashMap<String, String>();
					records.put("NOTIFICATIONID", notId);
					records.put("REQUISITIONHEADERID", reqHeaderID);
					records.put("REQUISITIONNUMBER", reqNo);
					records.put("DESCRIPTION", desc);
					records.put("AMOUNT", amt);
					records.put("STATUS", status);
					records.put("APPROVALREQUESTEDDATE", appReqDateString);
					records.put("APPROVEDDATE", appDateString);
					records.put("APPROVALREQUESTEDBY", appReqByString);
					records.put("APPROVEREMPLOYEENUMBER", appUserId);
					records.put("TOUSER", toUser);
					records.put("REQUESTOR", requestor);

					// Check if the record already exists and the approver
					// employee number is different
					String oldAppId = myedis.hget(keyVal, "APPROVEREMPLOYEENUMBER");
					// log.info("key val is " + keyVal +
					// "Current App id is " + oldAppId) ;
					// log.info("Comparing currappid " + oldAppId
					// + " and new app id " + appUserId) ;
					if (!((oldAppId == null) || (oldAppId.equals(appUserId)))) {
						// delete from the previous user list
						System.out.println("To delete from the original list");
						myedis.srem(oldAppId, keyVal);
					}
					// KAWAL-NEWLYADDED Till here

					myedis.hmset(keyVal, records);
					myedis.sadd(appUserId, keyVal);
					myedis.sadd(requisitionNo, keyVal);

					// KAWAL-NEWLYADDED From here
					if (status.equals("Awaiting Approval")) {
						myedis.sadd("PR_LIST_NEW", notId);
					}
					// log.info(myedis.smembers("PR_LIST_NEW")) ;
					// KAWAL-NEWLYADDED Till here

				} catch (SQLException e) {
					e.printStackTrace();
					log.info("Error when to user is ::" + appUserId + "notId is " + notId);
				}
			}
		}

		log.info("Processed " + notIdCount + " Purchase Requisition Notification Ids");

		// KAWAL-NEWLYADDED From here

		// log.info(myedis.smembers("PR_LIST_NEW")) ;
		// Set<String> prListNew = myedis.smembers("PR_LIST_OLD") ;
		if (myedis.exists("PR_LIST_OLD")) {
			// compare the two list
			System.out.println("PR_LIST_OLD exists, we should compare two lists...");

			// List of deleted entries
			// Records which got deleted A-B (Old - New)
			Set<String> delList = myedis.sdiff("PR_LIST_OLD", "PR_LIST_NEW");
			Iterator<String> delListIterator = delList.iterator();
			while (delListIterator.hasNext()) {
				String key = delListIterator.next();
				log.info("key is " + key);

				// KAWAL NOTIFY SUPPORT CHANGES FROM HERE
				// Below mentioned changes are to delete the expired entries from the queue
				String notIdkeyVal = "PR-" + key;
				if (myedis.exists(notIdkeyVal)) // Check if PR-<notification id> key exists
				{
					// myedis.hget(PR-<notification id>, APPROVEREMPLOYEENUMBER). Get the approver employee id from the work list hash with PR-<notification id> as key.
					String appEmpNum = myedis.hget(notIdkeyVal, "APPROVEREMPLOYEENUMBER");
					// myedis.srem(userid, PR-<notification id>). Delete this notification id (PR-<notification id>) value from the user worklist set. The key will be the userid
					// (approver employee id) got above
					log.info("Going to delete the notification id " + notIdkeyVal + " from user " + appEmpNum + " queue. As it has expired");
					myedis.srem(appEmpNum, notIdkeyVal);
					// Delete the notification id (PR-<notification id>) key
					myedis.del(notIdkeyVal);
				}
				// myedis.hset(key, "Action", "D");
				// myedis.sadd("NOT_PR_LIST", key);
				// KAWAL NOTIFY SUPPORT CHANGES TILL HERE
			}

			String notKeyValue = "NOTIFICATION_QUEUE"; // KAWAL NOTIFY SUPPORT CHANGES

			// List of entries added
			// Records which got added B-A (New - Old)
			Set<String> addList = myedis.sdiff("PR_LIST_NEW", "PR_LIST_OLD");
			Iterator<String> addListIterator = addList.iterator();
			while (addListIterator.hasNext()) {
				String key = addListIterator.next();
				// log.info("key is " + key);

				// KAWAL NOTIFY SUPPORT CHANGES FROM HERE

				// Code for Notification support from here
				// for all notification ids (added in this sync cycle)
				// myedis.hget (PR-<notification id>, “APPROVEREMPLOYEENUMBER”). Get the approver employee number from the redis db with the key as (PR-<notification id>)
				String notIdkeyVal = "PR-" + key;
				String appEmpNum = myedis.hget(notIdkeyVal, "APPROVEREMPLOYEENUMBER");
				// Get all the sessions available for this user (approver employee number) from the session SET (with the key “<userid>-SESSION”)
				String userSessionKey = appEmpNum + "-SESSION";

				log.info("Going to fetch session details for user " + appEmpNum);
				Set<String> delList2 = myedis.smembers(userSessionKey);
				Iterator<String> delListIterator2 = delList2.iterator();
				while (delListIterator2.hasNext()) {
					// for every session tokens present for the user
					String key2 = delListIterator2.next();
					log.info("key2 is " + key2);

					log.info("Session Token recvd is :: " + key2);
					// Get the following session information with the session token as the key. DPLATFORM / DVERSION / REGID / PRSUPPORT (For IE it will be EXPENSESUPPORT)
					String PRSUPPORTVal = myedis.hget(key2, "PRSUPPORT");
					String DVERSIONVal = myedis.hget(key2, "DVERSION");
					String DPLATFORMVal = myedis.hget(key2, "DPLATFORM");
					String DUIDVal = myedis.hget(key2, "DUID");
					String REGIDVal = myedis.hget(key2, "REGID");
					// if (PRSUPPORT is ‘1’) /* For IE sync tool we will check if EXPENSESUPPORT == ‘1’ */
					if (REGIDVal == null || DPLATFORMVal == null || DVERSIONVal == null) {
						System.out.println("either REGIDVal or DPLATFORMVal is null, hence discarding it");
					} else if (((PRSUPPORTVal != null) && PRSUPPORTVal.equals("1")) && (DUIDVal != null)) {
						// create notification detail has with key as NOT-PR-<notification-id>
						String notPRKey = "NOT-PR-" + DUIDVal + "-" + key;

						// Put the below mentioned field value pairs in this notification details key (NOT-PR-< notification -id >)
						HashMap<String, String> records = new HashMap<String, String>();
						records.put("REGID", REGIDVal);
						records.put("REQTYPE", "PR"); // Field: REQTYPE Value: "PR"
						records.put("MESSAGE", "New Item For Approval"); // Field: MESSAGE Value: "New Item for Approval”
						records.put("DEVPLATFORM", DPLATFORMVal); // Field: DEVPLATFORM Value: "DPLATFORM" (Got above)
						records.put("DEVVERSION", DVERSIONVal); // Field: DEVVERSION Value: "DVERSION" (Got above)
						records.put("STATE", "N"); // Field: STATE Value: "N"
						records.put("RETRYAFTER", "0"); // Field: RETRYAFTER Value: 0
						records.put("NOOFTRY", "0"); // Field: NOOFTRY Value: "0"
						myedis.hmset(notPRKey, records);

						// write (update) the NOTIFICATION_QUEUE set with the key values derived from Notification details (below)
						myedis.sadd(notKeyValue, notPRKey);
					} else {
						// Do Nothing
						log.info("PR Support is disabled for the user " + appEmpNum + "Hence wont be sending the notification");
					}
					// myedis.hset(key, "Action", "A");
					// myedis.sadd("NOT_PR_LIST", key);
					// KAWAL NOTIFY SUPPORT CHANGES TILL HERE
				}
			}

			myedis.rename("PR_LIST_NEW", "PR_LIST_OLD");

			// KAWAL-NEWLYADDED Till here

			myedis.disconnect();
			log.info("Redis Disconnected...");
		}
	}

	// To populate database for PR Line-level details
	public void PRLinesLoad(Connection conn) throws SQLException, InterruptedException {
		String empNumberQuery = "select REQUISITION_HEADER_ID, REQUISITION_LINE_ID, LINE_NUM, ITEM_DESCRIPTION, QUANTITY, UNIT_PRICE from XXEA_MOBILITY_PR_LINES_V";

		log.info("Executing query:" + empNumberQuery.toString());
		statement = conn.prepareStatement(empNumberQuery.toString());
		resultset = statement.executeQuery();

		// Connect to Redis server
		Jedis myedis = new Jedis(pr_cache_host, pr_cache_port);
		myedis.select(pr_cache_databaseIndex);
		myedis.connect();
		log.info("Redis Connected...");

		while (resultset.next()) {
			String reqHeaderID = "", reqLineID = "", linenum = "", keyVal = "";

			reqHeaderID = resultset.getString("REQUISITION_HEADER_ID");
			reqLineID = resultset.getString("REQUISITION_LINE_ID");

			if (reqHeaderID == null || reqLineID == null) {
				log.info("Received NULL Id:" + " REQUISITION_HEADER_ID = " + reqHeaderID + " REQUISITION_LINE_ID = " + reqLineID);
			}

			if (!(reqHeaderID == null || reqLineID == null)) {
				keyVal = "PR-" + reqLineID;
				try {
					String itemDesc = "", quantity = "", unitPrice = "";

					itemDesc = resultset.getString("ITEM_DESCRIPTION");
					if (itemDesc == null)
						itemDesc = "-";
					linenum = resultset.getString("LINE_NUM");
					if (linenum == null)
						linenum = "-";
					quantity = resultset.getString("QUANTITY");
					if (quantity == null)
						quantity = "-";
					unitPrice = resultset.getString("UNIT_PRICE");
					if (unitPrice == null)
						unitPrice = "-";

					HashMap<String, String> records = new HashMap<String, String>();
					records.put("REQUISITIONHEADERID", reqHeaderID);
					records.put("LINENUM", linenum);
					records.put("REQUISITIONLINEID", reqLineID);
					records.put("DESCRIPTION", itemDesc);
					records.put("QUANTITY", quantity);
					records.put("UNITPRICE", unitPrice);

					myedis.hmset(keyVal, records);
					myedis.sadd(reqHeaderID, keyVal);
				} catch (Exception e) {
					log.info("Error when to reqHeaderID ::" + reqHeaderID);
				}
			}
		}
		if (statement != null)
			statement.close();
		if (resultset != null)
			resultset.close();
		myedis.disconnect();
		log.info("Redis Disconnected...");
	}
}