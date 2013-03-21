package com.ea.ets.emapprove;

import static com.ea.ets.emapprove.CommonUtilities.DISPLAY_MESSAGE_ACTION;
import static com.ea.ets.emapprove.CommonUtilities.SENDER_ID;

import org.apache.cordova.DroidGap;

import com.google.android.gcm.GCMRegistrar;

import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.TextView;

public class MainActivity extends DroidGap  {
	
	TextView mDisplay;
	private String RegValue = null;
    AsyncTask<Void, Void, Void> mRegisterTask;
    public String set3rdPartyRegJavaResult;
    public String NotificationCalledFlag;
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		 //setContentView(R.layout.main);
			super.init();
			
	        checkNotNull(SENDER_ID, "SENDER_ID");
	        // Make sure the device has the proper dependencies.
	        GCMRegistrar.checkDevice(this);
	        
	        // Make sure the manifest was properly set - comment out this line
	        // while developing the app, then uncomment it when it's ready.
	        GCMRegistrar.checkManifest(this);                
	     
	        registerReceiver(mHandleMessageReceiver,
	                new IntentFilter(DISPLAY_MESSAGE_ACTION));
	        final  String regId = GCMRegistrar.getRegistrationId(this);
	            
	        if (regId.equals("")) {
	            // Automatically registers application on startup.
	            GCMRegistrar.register(this, SENDER_ID);
	        } 
	        else
	        {
		        // Device is already registered on GCM, check server.
		        if (GCMRegistrar.isRegisteredOnServer(this)) 
		        {
		            // Skips registration.
		                	
		        	setRegValue(regId);
			    } 
		        else 
		        {
			        // Try to register again, but not in the UI thread.
			        // It's also necessary to cancel the thread onDestroy(),
			        // hence the use of AsyncTask instead of a raw thread.
		            setRegValue(regId);
		        }
	    }
	        
	        appView.addJavascriptInterface(this, "regID");
		/* Loading the index.html for rendering the application in the webkit browser */
		super.loadUrl("file:///android_asset/www/index.html");
		
	}
	
	/* Exit the application on Click of Back button */
	private  void exit(){
        this.finish();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {

            AlertDialog.Builder alertbox = new AlertDialog.Builder(this);
            alertbox.setTitle("EmApprove");
            alertbox.setMessage("Are you sure you want to exit this application? ");

            alertbox.setPositiveButton("Yes",
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface arg0, int arg1) {
                            exit();
                        }
                    });

            alertbox.setNeutralButton("No",
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface arg0, int arg1) {
                        }
                    });

            alertbox.show();

            return true;
        } else {
            return super.onKeyDown(keyCode, event);
        }

    }
    
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
       // inflater.inflate(R.menu.options_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch(item.getItemId()) {
            /*
             * Typically, an application registers automatically, so options
             * below are disabled. Uncomment them if you want to manually
             * register or unregister the device (you will also need to
             * uncomment the equivalent options on options_menu.xml).
             */
           
                   
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
	public void onDestroy() {
        if (mRegisterTask != null) {
            mRegisterTask.cancel(true);
        }
        unregisterReceiver(mHandleMessageReceiver);
        GCMRegistrar.onDestroy(this);
        super.onDestroy();
    }

    private void checkNotNull(Object reference, String name) {
        if (reference == null) {
            throw new NullPointerException(
                    getString(R.string.error_config, name));
        }
    }

    public String getRegValue() {
		return RegValue;
	}

	public  void setRegValue(String regValue) {
		RegValue = regValue;
	}
	
	public  void setRegValueIfPresent() {
		
		RegValue = GCMRegistrar.getRegistrationId(this);
	}
	
	
	public  void set3rdPartyRegsiter() {
		final Context context = this;
		 GCMRegistrar.setRegisteredOnServer(context, true);	
		 set3rdPartyRegJavaResult = "Success";
	 }
	

	private final BroadcastReceiver mHandleMessageReceiver =
            new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
        	Log.e("mHandleMessageReceiver", "mHandleMessageReceiver");
        	
        	SetNotificationCalledFlag();         	
        
        	
        }

		
    };
    
    private void SetNotificationCalledFlag() {
		// TODO Auto-generated method stub
		NotificationCalledFlag = "True";		
		    	
	}
	
	  public String getNotificationCalledFlag() {
			return NotificationCalledFlag;
		}
}