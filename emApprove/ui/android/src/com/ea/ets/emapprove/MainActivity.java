package com.ea.ets.emapprove;

import org.apache.cordova.DroidGap;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.KeyEvent;

public class MainActivity extends DroidGap  {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//super.setIntegerProperty( "splashscreen", R.drawable.launch );
		//super.setIntegerProperty("loadUrlTimeoutValue", 70000);
		//super.appView.getSettings().setJavaScriptEnabled(true);
		super.loadUrl("file:///android_asset/www/index.html");
		
	}

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
}