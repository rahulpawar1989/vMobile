package com.vmobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.devstepbcn.wifi.AndroidWifiPackage;
import com.asterinet.react.tcpsocket.TcpSocketPackage;
import com.reactlibrary.androidsettings.RNANAndroidSettingsLibraryPackage;
//import com.poberwong.launcher.IntentLauncherPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.vmobile.generated.BasePackageList;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import org.unimodules.adapters.react.ReactAdapterPackage;
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.Package;
import org.unimodules.core.interfaces.SingletonModule;
import expo.modules.constants.ConstantsPackage;
import expo.modules.permissions.PermissionsPackage;
import expo.modules.filesystem.FileSystemPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import java.util.Arrays;
import java.util.List;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

public class MainApplication extends Application implements ReactApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
    new BasePackageList().getPackageList(),
    Arrays.<SingletonModule>asList()
  );

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AndroidWifiPackage(),
            new TcpSocketPackage(),
            new RNANAndroidSettingsLibraryPackage(),
           // new IntentLauncherPackage(),
          //new VectorIconsPackage(),
            new SafeAreaContextPackage(),
            new RNCWebViewPackage(),
          new ReanimatedPackage(),
          new RNGestureHandlerPackage(),
          new RNScreensPackage(),
          new ModuleRegistryAdapter(mModuleRegistryProvider),
          new RNDeviceInfo(),
          new AsyncStoragePackage(),
          new NetInfoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
// import com.oblador.vectoricons.VectorIconsPackage;
// import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// import com.reactnativecommunity.webview.RNCWebViewPackage;
// import com.facebook.react.ReactNativeHost;
// import com.facebook.react.ReactPackage;
// import com.facebook.react.shell.MainReactPackage;
// import com.facebook.soloader.SoLoader;
// import com.vmobile.generated.BasePackageList;
// import com.swmansion.reanimated.ReanimatedPackage;
// import com.swmansion.rnscreens.RNScreensPackage;
// import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// import com.reactnativecommunity.netinfo.NetInfoPackage;
// import org.unimodules.adapters.react.ReactAdapterPackage;
// import org.unimodules.adapters.react.ModuleRegistryAdapter;
// import org.unimodules.adapters.react.ReactModuleRegistryProvider;
// import org.unimodules.core.interfaces.Package;
// import org.unimodules.core.interfaces.SingletonModule;
// import expo.modules.constants.ConstantsPackage;
// import expo.modules.permissions.PermissionsPackage;
// import expo.modules.filesystem.FileSystemPackage;
// import com.learnium.RNDeviceInfo.RNDeviceInfo;
// import java.util.Arrays;
// import java.util.List;
// import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

// public class MainApplication extends NavigationApplication {
//   private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
//     new BasePackageList().getPackageList(),
//     Arrays.<SingletonModule>asList()
//   );

//   private final ReactNativeHost mReactNativeHost = new NavigationReactNativeHost(this) {
//     @Override
//     public boolean getUseDeveloperSupport() {
//       return BuildConfig.DEBUG;
//     }

//     @Override
//     protected List<ReactPackage> getPackages() {
//       return Arrays.<ReactPackage>asList(
//           new MainReactPackage(),
//             new VectorIconsPackage(),
//             new SafeAreaContextPackage(),
//             new RNCWebViewPackage(),
//           new ReanimatedPackage(),
//           new RNGestureHandlerPackage(),
//           new RNScreensPackage(),
//           new ModuleRegistryAdapter(mModuleRegistryProvider),
//           new RNDeviceInfo(),
//           new AsyncStoragePackage(),
//           new NetInfoPackage()
//       );
//     }

//     @Override
//     protected String getJSMainModuleName() {
//       return "index";
//     }
//   };

//   @Override
//   public ReactNativeHost getReactNativeHost() {
//     return mReactNativeHost;
//   }

//   @Override
//   public void onCreate() {
//     super.onCreate();
    
//   }
// }
