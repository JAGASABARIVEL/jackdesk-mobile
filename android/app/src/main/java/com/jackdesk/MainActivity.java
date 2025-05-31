package com.jackdesk;

import android.os.Bundle; // ✅ This import is required
import com.getcapacitor.BridgeActivity;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth; // ✅ GoogleAuth plugin

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(GoogleAuth.class); // ✅ Register GoogleAuth plugin
  }
}
