"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var app_module_1 = require("./app.module");
var dialogs = require("ui/dialogs");
var firebase = require("nativescript-plugin-firebase");
firebase.init({
    onMessageReceivedCallback: function (message) {
        if (message != null && message.title != null && message.body != null) {
            var options = {
                title: message.title,
                message: message.body,
                okButtonText: "OK"
            };
            dialogs.alert(options).then(function () {
                //
            });
        }
    }
}).then(function (instance) {
    console.log("firebase.init done");
}, function (error) {
    console.log("firebase.init error: " + error);
});
/*
applicationOn(launchEvent, function (args: ApplicationEventData) {
    if (args.android) {
        // For Android applications, args.android is an android.content.Intent class.
        // console.log("Launched Android application with the following intent: " + args.android + ".");
    } else if (args.ios !== undefined) {
        // For iOS applications, args.ios is NSDictionary (launchOptions).
        // console.log("Launched iOS application with options: " + args.ios);
    }
});

applicationOn(suspendEvent, function (args: ApplicationEventData) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        // console.log("SUSPEND Activity: " + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        // console.log("SUSPEND UIApplication: " + args.ios);
    }
});

applicationOn(resumeEvent, function (args: ApplicationEventData) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        // console.log("RESUME Activity: " + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        // console.log("RESUME UIApplication: " + args.ios);
    }
});

applicationOn(exitEvent, function (args: ApplicationEventData) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        // console.log("EXIT Activity: " + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        // console.log("EXIT UIApplication: " + args.ios);
    }
});

applicationOn(lowMemoryEvent, function (args: ApplicationEventData) {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        // console.log("LOW MEMORY Activity: " + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        // console.log("LOW MEMORY UIApplication: " + args.ios);
    }
});

applicationOn(uncaughtErrorEvent, function (args: ApplicationEventData) {
    if (args.android) {
        // For Android applications, args.android is an NativeScriptError.
        // console.log("ERROR NativeScriptError: " + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is NativeScriptError.
        // console.log("ERROR NativeScriptError: " + args.ios);
    }
});
*/
/*
connectivity.startMonitoring(function onConnectionTypeChanged(newConnectionType: number) {
    switch (newConnectionType) {
        case connectivity.connectionType.none:
            //console.log("Connection type changed to none.");
            break;
        case connectivity.connectionType.wifi:
            //console.log("Connection type changed to WiFi.");
            break;
        case connectivity.connectionType.mobile:
            //console.log("Connection type changed to mobile.");
            break;
    }
});
*/
core_1.enableProdMode();
platform_1.platformNativeScriptDynamic().bootstrapModule(app_module_1.AppModule);
