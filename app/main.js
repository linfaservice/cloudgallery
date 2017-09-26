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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwwREFBNEU7QUFDNUUsc0NBQStDO0FBQy9DLDJDQUF5QztBQUV6QyxvQ0FBdUM7QUFFdkMsdURBQTBEO0FBSTFELFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDVix5QkFBeUIsRUFBRSxVQUFDLE9BQU87UUFDL0IsRUFBRSxDQUFBLENBQUMsT0FBTyxJQUFFLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFFLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDNUQsSUFBSSxPQUFPLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO2dCQUNwQixPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUk7Z0JBQ3JCLFlBQVksRUFBRSxJQUFJO2FBQ3JCLENBQUM7WUFFRixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEIsRUFBRTtZQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUM7Q0FDSixDQUFDLENBQUMsSUFBSSxDQUNMLFVBQUMsUUFBUTtJQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwQyxDQUFDLEVBQ0QsVUFBQyxLQUFLO0lBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUMvQyxDQUFDLENBQ0YsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0REU7QUFNRjs7Ozs7Ozs7Ozs7Ozs7RUFjRTtBQUVGLHFCQUFjLEVBQUUsQ0FBQztBQUVqQixzQ0FBMkIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxzQkFBUyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBvbiBhcyBhcHBsaWNhdGlvbk9uLCBsYXVuY2hFdmVudCwgc3VzcGVuZEV2ZW50LCByZXN1bWVFdmVudCwgZXhpdEV2ZW50LCBsb3dNZW1vcnlFdmVudCwgdW5jYXVnaHRFcnJvckV2ZW50LCBBcHBsaWNhdGlvbkV2ZW50RGF0YSwgc3RhcnQgYXMgYXBwbGljYXRpb25TdGFydCB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0IHsgcGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3BsYXRmb3JtXCI7XG5pbXBvcnQgeyBlbmFibGVQcm9kTW9kZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tIFwiLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgKiBhcyBjb25uZWN0aXZpdHkgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvY29ubmVjdGl2aXR5XCI7XG5pbXBvcnQgZGlhbG9ncyA9IHJlcXVpcmUoXCJ1aS9kaWFsb2dzXCIpO1xuaW1wb3J0IExvYWRlciBmcm9tIFwiLi9jb21tb24vbG9hZGVyXCI7XG5pbXBvcnQgZmlyZWJhc2UgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZVwiKTtcblxuXG5cbmZpcmViYXNlLmluaXQoe1xuICAgIG9uTWVzc2FnZVJlY2VpdmVkQ2FsbGJhY2s6IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIGlmKG1lc3NhZ2UhPW51bGwgJiYgbWVzc2FnZS50aXRsZSE9bnVsbCAmJiBtZXNzYWdlLmJvZHkhPW51bGwpIHtcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBtZXNzYWdlLnRpdGxlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UuYm9keSxcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICB9ICBcbiAgICB9XG59KS50aGVuKFxuICAoaW5zdGFuY2UpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImZpcmViYXNlLmluaXQgZG9uZVwiKTtcbiAgfSxcbiAgKGVycm9yKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJmaXJlYmFzZS5pbml0IGVycm9yOiBcIiArIGVycm9yKTtcbiAgfVxuKTtcblxuLypcbmFwcGxpY2F0aW9uT24obGF1bmNoRXZlbnQsIGZ1bmN0aW9uIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSkge1xuICAgIGlmIChhcmdzLmFuZHJvaWQpIHtcbiAgICAgICAgLy8gRm9yIEFuZHJvaWQgYXBwbGljYXRpb25zLCBhcmdzLmFuZHJvaWQgaXMgYW4gYW5kcm9pZC5jb250ZW50LkludGVudCBjbGFzcy5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJMYXVuY2hlZCBBbmRyb2lkIGFwcGxpY2F0aW9uIHdpdGggdGhlIGZvbGxvd2luZyBpbnRlbnQ6IFwiICsgYXJncy5hbmRyb2lkICsgXCIuXCIpO1xuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgTlNEaWN0aW9uYXJ5IChsYXVuY2hPcHRpb25zKS5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJMYXVuY2hlZCBpT1MgYXBwbGljYXRpb24gd2l0aCBvcHRpb25zOiBcIiArIGFyZ3MuaW9zKTtcbiAgICB9XG59KTtcblxuYXBwbGljYXRpb25PbihzdXNwZW5kRXZlbnQsIGZ1bmN0aW9uIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSkge1xuICAgIGlmIChhcmdzLmFuZHJvaWQpIHtcbiAgICAgICAgLy8gRm9yIEFuZHJvaWQgYXBwbGljYXRpb25zLCBhcmdzLmFuZHJvaWQgaXMgYW4gYW5kcm9pZCBhY3Rpdml0eSBjbGFzcy5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTVVNQRU5EIEFjdGl2aXR5OiBcIiArIGFyZ3MuYW5kcm9pZCk7XG4gICAgfSBlbHNlIGlmIChhcmdzLmlvcykge1xuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgVUlBcHBsaWNhdGlvbi5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTVVNQRU5EIFVJQXBwbGljYXRpb246IFwiICsgYXJncy5pb3MpO1xuICAgIH1cbn0pO1xuXG5hcHBsaWNhdGlvbk9uKHJlc3VtZUV2ZW50LCBmdW5jdGlvbiAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpIHtcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIGFuZHJvaWQgYWN0aXZpdHkgY2xhc3MuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUkVTVU1FIEFjdGl2aXR5OiBcIiArIGFyZ3MuYW5kcm9pZCk7XG4gICAgfSBlbHNlIGlmIChhcmdzLmlvcykge1xuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgVUlBcHBsaWNhdGlvbi5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJSRVNVTUUgVUlBcHBsaWNhdGlvbjogXCIgKyBhcmdzLmlvcyk7XG4gICAgfVxufSk7XG5cbmFwcGxpY2F0aW9uT24oZXhpdEV2ZW50LCBmdW5jdGlvbiAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpIHtcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIGFuZHJvaWQgYWN0aXZpdHkgY2xhc3MuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRVhJVCBBY3Rpdml0eTogXCIgKyBhcmdzLmFuZHJvaWQpO1xuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcbiAgICAgICAgLy8gRm9yIGlPUyBhcHBsaWNhdGlvbnMsIGFyZ3MuaW9zIGlzIFVJQXBwbGljYXRpb24uXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRVhJVCBVSUFwcGxpY2F0aW9uOiBcIiArIGFyZ3MuaW9zKTtcbiAgICB9XG59KTtcblxuYXBwbGljYXRpb25Pbihsb3dNZW1vcnlFdmVudCwgZnVuY3Rpb24gKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKSB7XG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xuICAgICAgICAvLyBGb3IgQW5kcm9pZCBhcHBsaWNhdGlvbnMsIGFyZ3MuYW5kcm9pZCBpcyBhbiBhbmRyb2lkIGFjdGl2aXR5IGNsYXNzLlxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkxPVyBNRU1PUlkgQWN0aXZpdHk6IFwiICsgYXJncy5hbmRyb2lkKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3MuaW9zKSB7XG4gICAgICAgIC8vIEZvciBpT1MgYXBwbGljYXRpb25zLCBhcmdzLmlvcyBpcyBVSUFwcGxpY2F0aW9uLlxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkxPVyBNRU1PUlkgVUlBcHBsaWNhdGlvbjogXCIgKyBhcmdzLmlvcyk7XG4gICAgfVxufSk7XG5cbmFwcGxpY2F0aW9uT24odW5jYXVnaHRFcnJvckV2ZW50LCBmdW5jdGlvbiAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpIHtcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIE5hdGl2ZVNjcmlwdEVycm9yLlxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVSUk9SIE5hdGl2ZVNjcmlwdEVycm9yOiBcIiArIGFyZ3MuYW5kcm9pZCk7XG4gICAgfSBlbHNlIGlmIChhcmdzLmlvcykge1xuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgTmF0aXZlU2NyaXB0RXJyb3IuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRVJST1IgTmF0aXZlU2NyaXB0RXJyb3I6IFwiICsgYXJncy5pb3MpO1xuICAgIH1cbn0pO1xuKi9cblxuXG5cblxuXG4vKlxuY29ubmVjdGl2aXR5LnN0YXJ0TW9uaXRvcmluZyhmdW5jdGlvbiBvbkNvbm5lY3Rpb25UeXBlQ2hhbmdlZChuZXdDb25uZWN0aW9uVHlwZTogbnVtYmVyKSB7XG4gICAgc3dpdGNoIChuZXdDb25uZWN0aW9uVHlwZSkge1xuICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eS5jb25uZWN0aW9uVHlwZS5ub25lOlxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gdHlwZSBjaGFuZ2VkIHRvIG5vbmUuXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgY29ubmVjdGl2aXR5LmNvbm5lY3Rpb25UeXBlLndpZmk6XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ29ubmVjdGlvbiB0eXBlIGNoYW5nZWQgdG8gV2lGaS5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBjb25uZWN0aXZpdHkuY29ubmVjdGlvblR5cGUubW9iaWxlOlxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gdHlwZSBjaGFuZ2VkIHRvIG1vYmlsZS5cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcbiovXG5cbmVuYWJsZVByb2RNb2RlKCk7XG5cbnBsYXRmb3JtTmF0aXZlU2NyaXB0RHluYW1pYygpLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpO1xuIl19