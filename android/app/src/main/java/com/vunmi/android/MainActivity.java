package com.vunmi.android;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import com.getcapacitor.BridgeActivity;
import org.jetbrains.annotations.Nullable;

public class MainActivity extends BridgeActivity {

  @Override
  public Intent registerReceiver(
    @Nullable BroadcastReceiver receiver,
    IntentFilter filter
  ) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      return super.registerReceiver(
        receiver,
        filter,
        Context.RECEIVER_EXPORTED
      );
    } else {
      return super.registerReceiver(receiver, filter);
    }
  }
}
