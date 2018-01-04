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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwwREFBNEU7QUFDNUUsc0NBQStDO0FBQy9DLDJDQUF5QztBQUV6QyxvQ0FBdUM7QUFFdkMsdURBQTBEO0FBSTFELFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDVix5QkFBeUIsRUFBRSxVQUFDLE9BQU87UUFDL0IsRUFBRSxDQUFBLENBQUMsT0FBTyxJQUFFLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFFLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDNUQsSUFBSSxPQUFPLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO2dCQUNwQixPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUk7Z0JBQ3JCLFlBQVksRUFBRSxJQUFJO2FBQ3JCLENBQUM7WUFFRixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEIsRUFBRTtZQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUM7Q0FDSixDQUFDLENBQUMsSUFBSSxDQUNMLFVBQUMsUUFBUTtJQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwQyxDQUFDLEVBQ0QsVUFBQyxLQUFLO0lBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUMvQyxDQUFDLENBQ0YsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0REU7QUFNRjs7Ozs7Ozs7Ozs7Ozs7RUFjRTtBQUVGLHFCQUFjLEVBQUUsQ0FBQztBQUVqQixzQ0FBMkIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxzQkFBUyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBvbiBhcyBhcHBsaWNhdGlvbk9uLCBsYXVuY2hFdmVudCwgc3VzcGVuZEV2ZW50LCByZXN1bWVFdmVudCwgZXhpdEV2ZW50LCBsb3dNZW1vcnlFdmVudCwgdW5jYXVnaHRFcnJvckV2ZW50LCBBcHBsaWNhdGlvbkV2ZW50RGF0YSwgc3RhcnQgYXMgYXBwbGljYXRpb25TdGFydCB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybU5hdGl2ZVNjcmlwdER5bmFtaWMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgZW5hYmxlUHJvZE1vZGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tIFwiLi9hcHAubW9kdWxlXCI7XHJcbmltcG9ydCAqIGFzIGNvbm5lY3Rpdml0eSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9jb25uZWN0aXZpdHlcIjtcclxuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKFwidWkvZGlhbG9nc1wiKTtcclxuaW1wb3J0IExvYWRlciBmcm9tIFwiLi9jb21tb24vbG9hZGVyXCI7XHJcbmltcG9ydCBmaXJlYmFzZSA9IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtcGx1Z2luLWZpcmViYXNlXCIpO1xyXG5cclxuXHJcblxyXG5maXJlYmFzZS5pbml0KHtcclxuICAgIG9uTWVzc2FnZVJlY2VpdmVkQ2FsbGJhY2s6IChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgaWYobWVzc2FnZSE9bnVsbCAmJiBtZXNzYWdlLnRpdGxlIT1udWxsICYmIG1lc3NhZ2UuYm9keSE9bnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBtZXNzYWdlLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZS5ib2R5LFxyXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB9KTsgICAgXHJcbiAgICAgICAgfSAgXHJcbiAgICB9XHJcbn0pLnRoZW4oXHJcbiAgKGluc3RhbmNlKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcImZpcmViYXNlLmluaXQgZG9uZVwiKTtcclxuICB9LFxyXG4gIChlcnJvcikgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJmaXJlYmFzZS5pbml0IGVycm9yOiBcIiArIGVycm9yKTtcclxuICB9XHJcbik7XHJcblxyXG4vKlxyXG5hcHBsaWNhdGlvbk9uKGxhdW5jaEV2ZW50LCBmdW5jdGlvbiAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpIHtcclxuICAgIGlmIChhcmdzLmFuZHJvaWQpIHtcclxuICAgICAgICAvLyBGb3IgQW5kcm9pZCBhcHBsaWNhdGlvbnMsIGFyZ3MuYW5kcm9pZCBpcyBhbiBhbmRyb2lkLmNvbnRlbnQuSW50ZW50IGNsYXNzLlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTGF1bmNoZWQgQW5kcm9pZCBhcHBsaWNhdGlvbiB3aXRoIHRoZSBmb2xsb3dpbmcgaW50ZW50OiBcIiArIGFyZ3MuYW5kcm9pZCArIFwiLlwiKTtcclxuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIC8vIEZvciBpT1MgYXBwbGljYXRpb25zLCBhcmdzLmlvcyBpcyBOU0RpY3Rpb25hcnkgKGxhdW5jaE9wdGlvbnMpLlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTGF1bmNoZWQgaU9TIGFwcGxpY2F0aW9uIHdpdGggb3B0aW9uczogXCIgKyBhcmdzLmlvcyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuYXBwbGljYXRpb25PbihzdXNwZW5kRXZlbnQsIGZ1bmN0aW9uIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSkge1xyXG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xyXG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIGFuZHJvaWQgYWN0aXZpdHkgY2xhc3MuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTVVNQRU5EIEFjdGl2aXR5OiBcIiArIGFyZ3MuYW5kcm9pZCk7XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3MuaW9zKSB7XHJcbiAgICAgICAgLy8gRm9yIGlPUyBhcHBsaWNhdGlvbnMsIGFyZ3MuaW9zIGlzIFVJQXBwbGljYXRpb24uXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTVVNQRU5EIFVJQXBwbGljYXRpb246IFwiICsgYXJncy5pb3MpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmFwcGxpY2F0aW9uT24ocmVzdW1lRXZlbnQsIGZ1bmN0aW9uIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSkge1xyXG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xyXG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIGFuZHJvaWQgYWN0aXZpdHkgY2xhc3MuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJSRVNVTUUgQWN0aXZpdHk6IFwiICsgYXJncy5hbmRyb2lkKTtcclxuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcclxuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgVUlBcHBsaWNhdGlvbi5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJFU1VNRSBVSUFwcGxpY2F0aW9uOiBcIiArIGFyZ3MuaW9zKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5hcHBsaWNhdGlvbk9uKGV4aXRFdmVudCwgZnVuY3Rpb24gKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKSB7XHJcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XHJcbiAgICAgICAgLy8gRm9yIEFuZHJvaWQgYXBwbGljYXRpb25zLCBhcmdzLmFuZHJvaWQgaXMgYW4gYW5kcm9pZCBhY3Rpdml0eSBjbGFzcy5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVYSVQgQWN0aXZpdHk6IFwiICsgYXJncy5hbmRyb2lkKTtcclxuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcclxuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgVUlBcHBsaWNhdGlvbi5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVYSVQgVUlBcHBsaWNhdGlvbjogXCIgKyBhcmdzLmlvcyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuYXBwbGljYXRpb25Pbihsb3dNZW1vcnlFdmVudCwgZnVuY3Rpb24gKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKSB7XHJcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XHJcbiAgICAgICAgLy8gRm9yIEFuZHJvaWQgYXBwbGljYXRpb25zLCBhcmdzLmFuZHJvaWQgaXMgYW4gYW5kcm9pZCBhY3Rpdml0eSBjbGFzcy5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkxPVyBNRU1PUlkgQWN0aXZpdHk6IFwiICsgYXJncy5hbmRyb2lkKTtcclxuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcclxuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgVUlBcHBsaWNhdGlvbi5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkxPVyBNRU1PUlkgVUlBcHBsaWNhdGlvbjogXCIgKyBhcmdzLmlvcyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuYXBwbGljYXRpb25Pbih1bmNhdWdodEVycm9yRXZlbnQsIGZ1bmN0aW9uIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSkge1xyXG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xyXG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIE5hdGl2ZVNjcmlwdEVycm9yLlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRVJST1IgTmF0aXZlU2NyaXB0RXJyb3I6IFwiICsgYXJncy5hbmRyb2lkKTtcclxuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcclxuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgTmF0aXZlU2NyaXB0RXJyb3IuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJFUlJPUiBOYXRpdmVTY3JpcHRFcnJvcjogXCIgKyBhcmdzLmlvcyk7XHJcbiAgICB9XHJcbn0pO1xyXG4qL1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbmNvbm5lY3Rpdml0eS5zdGFydE1vbml0b3JpbmcoZnVuY3Rpb24gb25Db25uZWN0aW9uVHlwZUNoYW5nZWQobmV3Q29ubmVjdGlvblR5cGU6IG51bWJlcikge1xyXG4gICAgc3dpdGNoIChuZXdDb25uZWN0aW9uVHlwZSkge1xyXG4gICAgICAgIGNhc2UgY29ubmVjdGl2aXR5LmNvbm5lY3Rpb25UeXBlLm5vbmU6XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJDb25uZWN0aW9uIHR5cGUgY2hhbmdlZCB0byBub25lLlwiKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBjb25uZWN0aXZpdHkuY29ubmVjdGlvblR5cGUud2lmaTpcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gdHlwZSBjaGFuZ2VkIHRvIFdpRmkuXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eS5jb25uZWN0aW9uVHlwZS5tb2JpbGU6XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJDb25uZWN0aW9uIHR5cGUgY2hhbmdlZCB0byBtb2JpbGUuXCIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufSk7XHJcbiovXHJcblxyXG5lbmFibGVQcm9kTW9kZSgpO1xyXG5cclxucGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7XHJcbiJdfQ==