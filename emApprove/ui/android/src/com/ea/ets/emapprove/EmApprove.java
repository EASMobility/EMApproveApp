package com.ea.ets.emapprove;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

public class EmApprove extends Activity  {

	@Override


	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_em_approve);

		
		Handler handler = new Handler();

		// run a thread after 2 seconds to start the home screen
		handler.postDelayed(new Runnable() {

			@Override
			public void run() {
				finish();
				Intent intent = new Intent(EmApprove.this, MainActivity.class);
				EmApprove.this.startActivity(intent);

			}

		}, 3000); 
		
	}
}