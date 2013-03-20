
/* File : server.js
*  Description: defined module to
*  1. connect to LDAP 
*  2. Authenticate the user and get the response
*  3. Fetch all the LDAP attributes
*  4. Fetch the employeeNumber and user details
*/

/* define.js :- Include the definations file */
var define = require("./em-define");

/* For logging */
var logModule = require("./em-logModule");
var winston = logModule.getLogModule (); 

if (define.ldapSupport)
{
	//var ldapauth  = require('./ldapauth'); // Path to ldapauth.node
	var ldap = require(define.ldapNodeModulePath) ;
}

var gSearchConn = null ; // For search
var gBindConn = null ;	// For bind

function ldapInit (ldapURL, callback)
{
	winston.log ("info", "In Init, going to create interface with LDAP [" + ldapURL + "]...\n") ;
	winston.log ("info", "Initialising the bind interface ... \n") ;
	gBindConn = ldap.createClient({ url: ldapURL });

	winston.log ("info", "Initialised bind interface.. \n") ;
	gSearchConn = ldap.createClient({ url: ldapURL });
	winston.log ("info", "Create search interface... \n") ;
	ldapBind (gSearchConn, define.searchUsername, define.searchUserPass, function (err)	
	{
		if (err)
			winston.log ("error", "Error while binding.. \n") ;
		else
			winston.log ("debug", "Successful in binding.. \n") ;
		callback () ;
	}) ;
}


function ldapBind (conn, username, password, callback)
{
	try
	{
		conn.bind(username, password, function(err) {
   		 if (err) {
		 	winston.log  ("error", "Error.. while binding.. \n") ;
   	 	    winston.log("error", err.name);
   	            callback (1) ;
   		 }
		 else
		 {
		 	winston.log ("debug", "Succesfull in binding...\n") ;
			callback (0) ;
		 }
		});
	}
	catch (e)
	{
		winston.log  ("error", "Error.. while binding.. \n") ;
		callback (1) ;
	}
}

function ldapSearch (base, mailFilter, callback)
{
	var userDetails = new Object () ;
    gSearchConn.search(base, {
        scope: 'sub',
        filter: mailFilter, 
        attributes: ['givenName', 'sn', 'title', 'employeeNumber']
    	}, function(err, res) 
		{
			winston.log ("info", "Search Completed...\n") ;
			if (err) {
				winston.log("debug", err.name);
			}

			res.on('searchEntry', function(entry) 
			{
				entry.attributes.forEach(function(attribute) 
				{
					var value;
					if (attribute.type === 'thumbnailPhoto') 
					{
						value = attribute.buffers[0];
					} 
					else 
					{
						value = attribute.vals[0];
					}

					if (attribute.type === 'sn') 
					{
						userDetails.sn = value ;
					}
					else if (attribute.type === 'title') 
					{
						userDetails.title = value ;
					}
					else if (attribute.type === 'givenName') 
					{
						userDetails.givenName = value ;
					}
					else if (attribute.type === 'employeeNumber') 
					{
						userDetails.employeeNumber = value ;
					}
				});
				callback (0, userDetails) ;
			});
    });
}


function LDAPAuthenticateUser(username, password, userid, callback)
{
	var retResult = new Object () ;
	
	/* If the user are in white list we will by pass the authentication */
	checkUserInWhiteList (username, password, function (err, retUserDetails)
	{
		if (err)
		{	// User in not white list, go for authentication
			// LDAPAuthentication(function(err, result)
			if (!define.testEnvironment) // For test environment we should not go for LDAP authentication
			{
				//ldapauth.authenticate(scheme, ldap_host, ldap_port, username, password, function(err, result)
				ldapBind (gBindConn, username, password, function (err)
				{
					if(!err) // == true)  //Comment 2: Based on Comment 1 values
					{
						// Check if user id is there then no need to fetch the details from the active directory
						if (userid && userid.length == 0)
						{
							winston.log ("info", "User Id details are already present.. hence not going to fetch the details from active directory ..\n") ;
							retResult.employeeNumber = userid ;
							callback (0, retResult) ;
						}
						else
						{
							//base      = "DC=ad,DC=ea,DC=com,DC=rws,OU=RWS Corporate,OU=RWS Corporate Users";
							winston.log ("info", "Authentication successful.. Getting user details from the LDAP server\n") ;

							var filter = "(mail=" + username +")";   // Need to change it later
							//ldapauth.search(ldap_host, ldap_port, username, password, base, filter, function(err, searchResults) 
							ldapSearch (define.ldapBase, filter, function (err, userDetails)
							{
								winston.log ("info", "search result is " + userDetails) ;
								if (err) 
								{
									winston.log ("info", "ERROR ... \n") ;
									callback (1, null) ;
								}
								else 
								{
									winston.log ("info", "SUCCESS ... \n") ;
									//var ldapAttributes = JSON.stringify(searchResults);	
									//winston.log("\n" + ldapAttributes);
									winston.log ("debug", " The SN is " + userDetails.sn) ;
									winston.log ("debug", " The Title is " + userDetails.title) ;
									winston.log ("debug", " The givenName is " + userDetails.givenName) ;
									winston.log ("debug", " The employee number is " + userDetails.employeeNumber) ;
									retResult.sn = userDetails.sn ;
									retResult.title = userDetails.title ;
									retResult.givenName = userDetails.givenName ;
									retResult.employeeNumber = userDetails.employeeNumber ;

									//retResult.userID = userDetails.employeeNumber ;
									callback (0, retResult) ;
								}
							});
						}
					}
					else
					{
						winston.log("debug", "Failed to authenticate with LDAP.............");
						//winston.log("Authentication Result" + result);
						callback (1, retResult) ;
					}
				}) ;
			}
			else
			{
				winston.log("debug", "Failed to authenticate .............");
				callback (1, retResult) ;
			}
		}
		else
		{
			winston.log ("debug", "User in the white list..\n") ;
			retResult.employeeNumber = retUserDetails.userid ;
			retResult.givenName = retUserDetails.GIVENNAME ;
			retResult.sn = retUserDetails.SECONDNAME ;
			retResult.title = retUserDetails.TITLE ;

			callback (0, retResult) ;
		}
	}) ;
}


/* 	This functions checks whether the user is in white list, if present
 *  	*	it will send the user details (id)
 *  	*/
function checkUserInWhiteList (username, password, callback)
{
	var userdetails = new Object () ;
	var userid = null;
	var wl = define.whiteListUsers ;
	
	for (i in wl)
	{
		winston.log ("debug", "comparing... " + username + " wl list item " + wl [i] [0]) ;
		if (username == wl[i][0])
		{
			winston.log ("debug", "user id matched..") ;
			winston.log ("debug", "User name is .. " +  username) ;
			winston.log ("debug", "password is .. " +  password) ;
			/* Check for the password */
			if (password == wl [i][1])
			{
				winston.log ("debug", "Validation success in white list..\n") ;
				userid = wl [i][3] ;
			}
			else
			{
				winston.log ("debug", "Invalid Password: Authentication failed..\n") ;
			}

			break ;
		}
	}
	winston.log ("debug", "User id out is .. " +  userid) ;
	if (userid)
	{
		userdetails.userid = userid ;
		userdetails.GIVENNAME = wl[i][2] ;
		userdetails.SECONDNAME = wl[i][2] ;
		userdetails.TITLE = "Employee" ;
		callback (0, userdetails) ;
	}
	else
	{
		callback (1, userdetails) ;
	}
}



/* start funciton can be envoked from other files too */
exports.LDAPAuthenticateUser = LDAPAuthenticateUser;
exports.ldapInit = ldapInit;

