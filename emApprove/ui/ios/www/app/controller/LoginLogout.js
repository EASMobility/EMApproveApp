/**
 * Copyright 2012-2013 Electronic Arts, Inc.
 */

/**
 * LoginLogout.js holding loginService(),logOutService() functions, These will make an ajax call when
 * sign-on toggled ON.
 */

/*
 Make an AJAX call to get the worklist details, this function will be called only when user credentials and url is valid only.
 */

function loginService(username, password, url) {
   var httpRequest = new XMLHttpRequest();
    var _object = {
    username: username,
    password: password
    };
    DeviceName = device.name;
    Platform = device.platform;
    UniqueID = device.uuid;
    Version = device.version;
    var obj = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "username": username,
        "password": password,
        "SessionTokenId": "",
        "DeviceInfo": {
            "DeviceName": DeviceName,
            "DeviceVersion": Version,
            "UniqueDeviceID": UniqueID,
            "Platform": Platform,
            "RegistrationId": ""
        }
    };
    var object = {
    AuthenticateUserReq: obj,
    };
	Mask('Please Wait');
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(object));
    
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
    var _oonreadystatechange = function (httpRequest, optss) {
        if (httpRequest.readyState == '4') {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                if (data.AuthenticateUserRes.Status.Code == '200') {
                    sessionTokenID = data.AuthenticateUserRes.SessionTokenId;
                    localStorage.setItem('sessionToken', sessionTokenID);
                    userID = data.AuthenticateUserRes.USERID;
                    document.getElementById('loginstatus').innerHTML = "LOGGED ON";
                    localStorage.setItem('userid', userID);
                    signontoggle = true;
					Unmask();
                    if (check_network() == 'No network connection' || check_network() == 'Unknown connection') {
                        Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                    } else {
                        console.log('Retrieving records from service');
					    devicetokenregistry(localStorage.getItem('sessionToken'),devTokenFromIOS,url);
                        worklistrequest(url, localStorage.getItem('sessionToken'),true);
                        ERworklistrequest(url, localStorage.getItem('sessionToken'),true);
                        WorklistDetailsReqProcess(url, localStorage.getItem('sessionToken'));
                        autorefreshcall();                        
                        
                    }
					
                } else if (data.AuthenticateUserRes.Status.Code == '402') //Invalid user
                {
                    alert('Invalid username or password. Try again');
                    Unmask();
                    document.getElementById('loginstatus').innerHTML = "LOGGED OFF";
                    
                } else if (data.AuthenticateUserRes.Status.Code == '401') //Invalid Session due to session timeout
                {
                    loginService(nameValue, passwordValue, url);
                    Unmask();
                    
                }
            } else {
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                Ext.getCmp('toggle1').setValue(0);
                Unmask();
                document.getElementById('loginstatus').innerHTML = "LOGGED OFF";
                
            }
        }
    };
}
/*
 On click of OFF toggle button in Settings page this function will be executed.
 */
function logOutService(sessionToken, url) {
    var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionToken,
    };
    var object = {
    LogoutUserReq: _object,
    };
    Mask('');
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(object));
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
    var _oonreadystatechange = function (httpRequest, optss) {
        
        if (httpRequest.readyState == '4') {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                if (data.LogoutUserRes.Status.Code == '200') {
                    document.getElementById('loginstatus').innerHTML = "LOGGED OFF";
                    signontoggle = false;
                    Unmask();
                    clearInterval(clearautorefesh);
                }
                
            }else{
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                Unmask();
            }
        }
    };
}
/**
 * Code for WorklistDetails Request Process
 */
function WorklistDetailsReqProcess(url, sessionTokenID) {
    var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionTokenID,
        "PRSupport": "1",
        "POSupport": "0",
        "ExpenseSupport": "1",
        "TradePromotionsupport": "0",
        "JournalEntrySupport": "0"
    };
    var object = {
    WorkListDetailsReq: _object,
    };
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(object));
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
    var _oonreadystatechange = function (httpRequest, optss) {
        console.log(httpRequest.status);
        if (httpRequest.readyState == '4') {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                if (data.WorkListDetailsRes.Status.Code == '200') {
                    console.log('WorkListDetailsRes Success');
                }
            }
        }
    };
}
//ends


/**
 * Send device token along with Session token to node server..
 */
function devicetokenregistry(sessionTokenID, devTokenFromIOS,url) {
    
    if(devTokenFromIOS != ""){
    var httpRequest = new XMLHttpRequest();
    var _object = {
        "Tid": Math.floor(Math.random() * 9000) + 1000,
        "SessionTokenId": sessionTokenID,
        "RegistrationId": devTokenFromIOS
    };
    var object = {
    RegisterAppReq: _object
    };
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    httpRequest.send(JSON.stringify(object));
    httpRequest.onreadystatechange = function () {
        _oonreadystatechange(httpRequest);
    }
    var _oonreadystatechange = function (httpRequest, optss) {
        if (httpRequest.readyState == '4') {
            if (httpRequest.status == '200') {
                var data = JSON.parse(httpRequest.responseText);
                if (data.RegisterAppRes.Status.Code === '200') {
                    console.log('Registered the device token');
                } else if (data.RegisterAppRes.Status.Code == '401') {
                    loginService(nameValue, passwordValue, url);
                }
            }else{
                Ext.Msg.alert('No Connection', 'Please try again later', Ext.emptyFn);
                Unmask();
            }
        }
    };
    }
}