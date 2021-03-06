BASE_URL = "https://kanteenlife.f4food.net/home3/";
$(window).on("load", function () {

  try {
    document.addEventListener('deviceready', function () {


      try {
        wkWebView.injectCookie('rncm.f4food.net/');
      } catch (e) {

      }
      codePush.sync(null, { updateDialog: false, installMode: InstallMode.IMMEDIATE });




      //Remove this method to stop OneSignal Debugging
      window.plugins.OneSignal.setLogLevel({ logLevel: 6, visualLevel: 0 });

      var notificationOpenedCallback = function (jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };
      // Set your iOS Settings
      var iosSettings = {};
      iosSettings["kOSSettingsKeyAutoPrompt"] = false;
      iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

      window.plugins.OneSignal
        .startInit("1a276b5f-a456-4fb6-a4c4-e1f6e58d82cd")
        .handleNotificationOpened(notificationOpenedCallback)
        .iOSSettings(iosSettings)
        .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
        .endInit();

      // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
      window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
        console.log("User accepted notifications: " + accepted);
      });
    }, false);


  } catch (e) { }


  if (iOS()) {
    document.documentElement.style.setProperty('--iphonTop', '20px');
  }

  // // iPhone X Detection
  // // Get the device pixel ratio
  // var ratio = window.devicePixelRatio || 1;

  // // Define the users device screen dimensions
  // var screen = {
  //   width : window.screen.width * ratio,
  //   height : window.screen.height * ratio
  // };


  // if (iOS && screen.width == 1125 && screen.height === 2436) {
  //   // alert("iphonx");
  //   document.documentElement.style.setProperty('--iphonbtm', '20px');
  //   document.documentElement.style.setProperty('--iphonbtmMrg', '20px');
  // }

  if (ons.platform.isIPhoneX()) { // Utility function
    // Add empty attribute to the <html> element
    // document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
    // document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
    document.documentElement.style.setProperty('--iphonbtm', '20px');
    document.documentElement.style.setProperty('--iphonbtmMrg', '20px');

  }

});


function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
