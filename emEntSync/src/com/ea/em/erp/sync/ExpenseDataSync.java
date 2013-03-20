package com.ea.em.erp.sync;

// test

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;
import java.util.Set;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import org.quartz.Job;
import org.quartz.JobExecutionContext;

import redis.clients.jedis.Jedis;

import org.apache.log4j.Logger;

public class ExpenseDataSync implements Job {

	Connection conn = null;
	Properties prop = new Properties();
	int exp_cache_databaseIndex;
	String exp_cache_host;
	int exp_cache_port;

	PreparedStatement statement = null;
	ResultSet resultset = null;

	// Always use the classname, this way you can refactor
	private final static Logger log = Logger.getLogger(ExpenseDataSync.class.getName());

	@Override
	public void execute(JobExecutionContext arg0) {

		try {
			prop.load(getClass().getClassLoader().getResourceAsStream("config.properties"));
			exp_cache_host = prop.getProperty("exp_cache_host");
			exp_cache_port = Integer.parseInt(prop.getProperty("exp_cache_port"));
			exp_cache_databaseIndex = Integer.parseInt(prop.getProperty("exp_cache_databaseIndex"));

			DataSource dataSource;
			Context initContext = new InitialContext();
			Context envContext = (Context) initContext.lookup("java:/comp/env");
			dataSource = (DataSource) envContext.lookup("jdbc/erpdb");
			conn = dataSource.getConnection();
			expWorklistItemsLoad(conn);
			expLinesLoad(conn);
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

	// To populate database for Expense Worklist items
	public void expWorklistItemsLoad(Connection conn) throws SQLException, InterruptedException {
		String dbQuery = "select NOTIFICATION_ID, REPORT_HEADER_ID, IEXPENSE_NUMBER, DESCRIPTION," + "TOTAL_AMOUNT, PAYMENT_CURRENCY_CODE, REPORT_SUBMITTED_DATE, STATUS, "
				+ "APPROVAL_REQUESTED_DATE, APPROVED_DATE, APPROVAL_REQUESTED_BY, APPROVER_EMPLOYEE_NUMBER, "
				+ "FROM_USER, TO_USER, EMPLOYEE_COST_CENTER, REQUESTOR from XXEA_MOBILITY_IE_APPR_STATUS_V";

		log.info("Executing query:" + dbQuery.toString());
		statement = conn.prepareStatement(dbQuery.toString());
		resultset = statement.executeQuery();

		// Connect to Redis server
		Jedis myedis = new Jedis(exp_cache_host, exp_cache_port);
		myedis.select(exp_cache_databaseIndex);
		myedis.connect();
		log.info("Redis Connected...");

		int notIdCount = 0;
		while (resultset.next()) {
			String appUserId = "", notId = "", keyVal = "", iexpenseNo = "";

			notIdCount++;

			appUserId = resultset.getString("APPROVER_EMPLOYEE_NUMBER");
			notId = resultset.getString("NOTIFICATION_ID");
			iexpenseNo = resultset.getString("IEXPENSE_NUMBER");

			if (appUserId == null || notId == null || iexpenseNo == null) {
				log.info("Received NULL Id:" + " APPROVER_EMPLOYEE_NUMBER = " + appUserId + " NOTIFICATION_ID =  " + notId + " IEXPENSE_NUMBER = " + iexpenseNo);
			}

			if (!(appUserId == null || notId == null)) {
				keyVal = "IE-" + notId;
				try {
					String repHeaderId = "", desc = "", amt = "", amtAndCurrency = "", status = "", toUser = "", requestor = "", appDateString = "", appReqByString = "", repSubmitDateString = "", fromUser = "", costCenter = "", payCurrencyCode = "";
					Timestamp ts;
					SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss");

					repHeaderId = resultset.getString("REPORT_HEADER_ID");
					if (repHeaderId == null)
						repHeaderId = "";
					if (iexpenseNo == null)
						iexpenseNo = "-";
					desc = resultset.getString("DESCRIPTION");
					if (desc == null)
						desc = "-";
					amt = resultset.getString("TOTAL_AMOUNT");
					if (amt == null)
						amt = "-";

					payCurrencyCode = resultset.getString("PAYMENT_CURRENCY_CODE");
					if (payCurrencyCode == null)
						payCurrencyCode = "-";

					// concatenate amt and currency, to keep it consistent with PR implementation
					// format is amt space currency
					amtAndCurrency = amt + " " + payCurrencyCode;

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

					ts = resultset.getTimestamp("APPROVAL_REQUESTED_BY");
					if (ts != null) {
						java.util.Date appReqBy = new java.util.Date(ts.getTime());
						appReqByString = formatter.format(appReqBy);
					} else
						appReqByString = "-";

					ts = resultset.getTimestamp("REPORT_SUBMITTED_DATE");
					if (ts != null) {
						java.util.Date repSubmitDate = new java.util.Date(ts.getTime());
						repSubmitDateString = formatter.format(repSubmitDate);
					} else
						repSubmitDateString = "-";

					toUser = resultset.getString("TO_USER");
					if (toUser == null)
						toUser = "-";
					fromUser = resultset.getString("FROM_USER");
					if (fromUser == null)
						fromUser = "-";
					costCenter = resultset.getString("EMPLOYEE_COST_CENTER");
					if (costCenter == null)
						costCenter = "-";
					requestor = resultset.getString("REQUESTOR");
					if (requestor == null)
						requestor = "-";

					HashMap<String, String> records = new HashMap<String, String>();

					records.put("NOTIFICATIONID", notId);
					records.put("REPORTHEADERID", repHeaderId);
					records.put("IEXPENSENUMBER", iexpenseNo);
					records.put("DESCRIPTION", desc);
					// records.put("AMOUNT", amtAndCurrency); // KAWAL NOTIFY SUPPORT CHANGES :: For Currency Code Support
					// log.info("AMOUNT = " + amtAndCurrency);
					records.put("AMOUNT", amt); // KAWAL NOTIFY SUPPORT CHANGES :: For Currency Code Support
					records.put("STATUS", status);
					records.put("APPROVALREQUESTEDDATE", appReqDateString);
					records.put("APPROVEDDATE", appDateString);
					records.put("APPROVALREQUESTEDBY", appReqByString);
					records.put("APPROVEREMPLOYEENUMBER", appUserId);
					records.put("TOUSER", toUser);
					records.put("CURRENCYCODE", payCurrencyCode); // KAWAL NOTIFY SUPPORT CHANGES :: For Currency Code Support
					records.put("REPORTSUBMITTEDDATE", repSubmitDateString);
					records.put("FROMUSER", fromUser);
					records.put("COSTCENTER", costCenter);
					records.put("REQUESTOR", requestor);

					// Check if the record already exists and the approver
					// employee number is different
					String oldAppId = myedis.hget(keyVal, "APPROVEREMPLOYEENUMBER");
					log.info("key val is " + keyVal + "Current App id is " + oldAppId);
					log.info("Comparing currappid " + oldAppId + " and new app id " + appUserId);
					if (!((oldAppId == null) || (oldAppId.equals(appUserId)))) {
						// delete from the previous user list
						log.info("To delete from the original list");
						myedis.srem(oldAppId, keyVal);
					}

					myedis.hmset(keyVal, records);
					myedis.sadd(appUserId, keyVal);
					myedis.sadd(iexpenseNo, keyVal);

					if (status.equals("Awaiting Approval")) {
						myedis.sadd("IE_LIST_NEW", notId);
					}
					System.out.println(myedis.smembers("IE_LIST_NEW"));

				} catch (SQLException e) {
					e.printStackTrace();
					log.info("Error when to user is ::" + appUserId + "notId is " + notId);
				}
			}
		}

		log.info("Processed " + notIdCount + " Expense Report Notification Ids");

		System.out.println(myedis.smembers("IE_LIST_NEW"));
		// Set<String> ieListNew = myedis.smembers("IE_LIST_OLD") ;
		if (myedis.exists("IE_LIST_OLD")) {
			// compare the two list
			log.info("IE_LIST_OLD exists, we should compare two lists...");

			// List of deleted entries
			// Records which got deleted A-B (Old - New)
			Set<String> delList = myedis.sdiff("IE_LIST_OLD", "IE_LIST_NEW");
			Iterator<String> delListIterator = delList.iterator();
			while (delListIterator.hasNext()) {
				String key = delListIterator.next();
				log.info("key is " + key);

				// KAWAL NOTIFY SUPPORT CHANGES FROM HERE
				// Below mentioned changes are to delete the expired entries from the queue
				String notIdkeyVal = "IE-" + key;
				if (myedis.exists(notIdkeyVal)) // Check if IE-<notification id> key exists
				{
					// myedis.hget(IE-<notification id>, APPROVEREMPLOYEENUMBER). Get the approver employee id from the work list hash with IE-<notification id> as key.
					String appEmpNum = myedis.hget(notIdkeyVal, "APPROVEREMPLOYEENUMBER");
					// myedis.srem(userid, IE-<notification id>). Delete this notification id (IE-<notification id>) value from the user worklist set. The key will be the userid
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
			Set<String> addList = myedis.sdiff("IE_LIST_NEW", "IE_LIST_OLD");
			Iterator<String> addListIterator = addList.iterator();
			while (addListIterator.hasNext()) {
				String key = addListIterator.next();
				log.info("key is " + key);
				// KAWAL NOTIFY SUPPORT CHANGES FROM HERE

				// Code for Notification support from here
				// for all notification ids (added in this sync cycle)
				// myedis.hget (IE-<notification id>, “APPROVEREMPLOYEENUMBER”). Get the approver employee number from the redis db with the key as (IE-<notification id>)
				String notIdkeyVal = "IE-" + key;
				myedis.select(2);
				String appEmpNum = myedis.hget(notIdkeyVal, "APPROVEREMPLOYEENUMBER");
				// Get all the sessions available for this user (approver employee number) from the session SET (with the key “<userid>-SESSION”)
				String userSessionKey = appEmpNum + "-SESSION";

				log.info("Going to fetch session details for user " + appEmpNum);
				myedis.select(0);
				Set<String> delList2 = myedis.smembers(userSessionKey);
				Iterator<String> delListIterator2 = delList2.iterator();
				while (delListIterator2.hasNext()) {
					// for every session tokens present for the user
					String key2 = delListIterator2.next();
					log.info("key2 is " + key2);

					log.info("Session Token recvd is :: " + key2);
					// Get the following session information with the session token as the key. DPLATFORM / DVERSION / REGID / PRSUPPORT (For IE it will be EXPENSESUPPORT)
					String EXPENSESUPPORTVal = myedis.hget(key2, "EXPENSESUPPORT");
					String DVERSIONVal = myedis.hget(key2, "DVERSION");
					String DPLATFORMVal = myedis.hget(key2, "DPLATFORM");
					String DUIDVal = myedis.hget(key2, "DUID");
					String REGIDVal = myedis.hget(key2, "REGID");
					// if (PRSUPPORT is ‘1’) /* For IE sync tool we will check if EXPENSESUPPORT == ‘1’ */
					if (REGIDVal == null || DPLATFORMVal == null || DVERSIONVal == null) {
						System.out.println("either REGIDVal or DPLATFORMVal is null, hence discarding it");
					} else if (((EXPENSESUPPORTVal != null) && EXPENSESUPPORTVal.equals("1")) && (DUIDVal != null)) {
						// create notification detail has with key as NOT-IE-<notification-id>
						String notPRKey = "NOT-IE-" + DUIDVal + "-" + key;

						// Put the below mentioned field value pairs in this notification details key (NOT-IE-<dev id>-<notification -id>)
						HashMap<String, String> records = new HashMap<String, String>();
						records.put("REGID", REGIDVal);
						records.put("REQTYPE", "IE"); // Field: REQTYPE Value: "IE"
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
						log.info("IE Support is disabled for the user " + appEmpNum + "Hence wont be sending the notification");
					}

					// myedis.hset(key, "Action", "A");
					// myedis.sadd("NOT_IE_LIST", key);
					// KAWAL NOTIFY SUPPORT CHANGES TILL HERE
				}
			}
		}

		myedis.select(exp_cache_databaseIndex);
		myedis.rename("IE_LIST_NEW", "IE_LIST_OLD");
		myedis.disconnect();
		log.info("Redis Disconnected...");
	}

	// To populate database for Expense Line-level details
	public void expLinesLoad(Connection conn) throws SQLException, InterruptedException {
		String dbQuery = "select REPORT_HEADER_ID, DISTRIBUTION_LINE_NUMBER, ITEM_DESCRIPTION, AMOUNT, "
				+ "CURRENCY_CODE, JUSTIFICATION, GL_ACCOUNT from XXEA_MOBILITY_IE_APPR_LINES_V";

		log.info("Executing query:" + dbQuery.toString());
		statement = conn.prepareStatement(dbQuery.toString());
		resultset = statement.executeQuery();

		// Connect to Redis server
		Jedis myedis = new Jedis(exp_cache_host, exp_cache_port);
		myedis.select(exp_cache_databaseIndex);
		myedis.connect();
		log.info("Redis Connected...");

		String repHeaderId = "", distLineNo = "", keyVal = "";
		String itemDesc = "", amt = "", currencyCode = "", amtAndCurrency = "", justification = "", glAccount = "";

		while (resultset.next()) {

			repHeaderId = resultset.getString("REPORT_HEADER_ID");
			distLineNo = resultset.getString("DISTRIBUTION_LINE_NUMBER");

			if (repHeaderId == null || distLineNo == null) {
				log.info("Received NULL Id:" + " REPORT_HEADER_ID = " + repHeaderId + " DISTRIBUTION_LINE_NUMBER = " + distLineNo);
			}

			if (!(repHeaderId == null || distLineNo == null)) {
				keyVal = "IE-" + repHeaderId + "-" + distLineNo;
				try {

					itemDesc = resultset.getString("ITEM_DESCRIPTION");
					if (itemDesc == null)
						itemDesc = "-";
					amt = resultset.getString("AMOUNT");
					if (amt == null)
						amt = "-";
					currencyCode = resultset.getString("CURRENCY_CODE");
					if (currencyCode == null)
						currencyCode = "-";
					// concatenate amt and currency, to keep it consistent with PR implementation
					// format is amt space currency
					amtAndCurrency = amt + " " + currencyCode;

					justification = resultset.getString("JUSTIFICATION");
					if (justification == null)
						justification = "-";
					glAccount = resultset.getString("GL_ACCOUNT");
					if (glAccount == null)
						glAccount = "-";

					HashMap<String, String> records = new HashMap<String, String>();
					records.put("REPORTHEADERID", repHeaderId);
					records.put("DISTRIBUTIONLINENUMBER", distLineNo);
					records.put("DESCRIPTION", itemDesc);
					records.put("AMOUNT", amtAndCurrency);
					// log.info("AMOUNT = " + amtAndCurrency);
					// records.put("CURRENCYCODE", currencyCode);
					records.put("JUSTIFICATION", justification);
					records.put("GLACCOUNT", glAccount);

					myedis.hmset(keyVal, records);
					myedis.sadd(repHeaderId, keyVal);
				} catch (Exception e) {
					log.info("Error when to repHeaderId ::" + repHeaderId);
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