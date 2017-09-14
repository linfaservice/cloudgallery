"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("nativescript-angular/platform");
var core_1 = require("@angular/core");
var app_module_1 = require("./app.module");
var dialogs = require("ui/dialogs");
var loader_1 = require("./common/loader");
var monitor_1 = require("./common/monitor");
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
var monitor = new monitor_1.default(new loader_1.default());
monitor.startPingAlive("https://www.linfaservice.it");
core_1.enableProdMode();
platform_1.platformNativeScriptDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwwREFBNEU7QUFDNUUsc0NBQStDO0FBQy9DLDJDQUF5QztBQUV6QyxvQ0FBdUM7QUFDdkMsMENBQXFDO0FBQ3JDLDRDQUF1QztBQUN2Qyx1REFBMEQ7QUFJMUQsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNWLHlCQUF5QixFQUFFLFVBQUMsT0FBTztRQUMvQixFQUFFLENBQUEsQ0FBQyxPQUFPLElBQUUsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUUsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLE9BQU8sR0FBRztnQkFDVixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7Z0JBQ3BCLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSTtnQkFDckIsWUFBWSxFQUFFLElBQUk7YUFDckIsQ0FBQztZQUVGLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN4QixFQUFFO1lBQ04sQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyxJQUFJLENBQ0wsVUFBQyxRQUFRO0lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsRUFDRCxVQUFDLEtBQUs7SUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FDRixDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTRERTtBQU1GOzs7Ozs7Ozs7Ozs7OztFQWNFO0FBRUYsSUFBSSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksZ0JBQU0sRUFBRSxDQUFDLENBQUM7QUFDeEMsT0FBTyxDQUFDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBR3RELHFCQUFjLEVBQUUsQ0FBQztBQUVqQixzQ0FBMkIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxzQkFBUyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBvbiBhcyBhcHBsaWNhdGlvbk9uLCBsYXVuY2hFdmVudCwgc3VzcGVuZEV2ZW50LCByZXN1bWVFdmVudCwgZXhpdEV2ZW50LCBsb3dNZW1vcnlFdmVudCwgdW5jYXVnaHRFcnJvckV2ZW50LCBBcHBsaWNhdGlvbkV2ZW50RGF0YSwgc3RhcnQgYXMgYXBwbGljYXRpb25TdGFydCB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0IHsgcGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3BsYXRmb3JtXCI7XG5pbXBvcnQgeyBlbmFibGVQcm9kTW9kZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tIFwiLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgKiBhcyBjb25uZWN0aXZpdHkgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvY29ubmVjdGl2aXR5XCI7XG5pbXBvcnQgZGlhbG9ncyA9IHJlcXVpcmUoXCJ1aS9kaWFsb2dzXCIpO1xuaW1wb3J0IExvYWRlciBmcm9tIFwiLi9jb21tb24vbG9hZGVyXCI7XG5pbXBvcnQgTW9uaXRvciBmcm9tIFwiLi9jb21tb24vbW9uaXRvclwiO1xuaW1wb3J0IGZpcmViYXNlID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2VcIik7XG5cblxuXG5maXJlYmFzZS5pbml0KHtcbiAgICBvbk1lc3NhZ2VSZWNlaXZlZENhbGxiYWNrOiAobWVzc2FnZSkgPT4ge1xuICAgICAgICBpZihtZXNzYWdlIT1udWxsICYmIG1lc3NhZ2UudGl0bGUhPW51bGwgJiYgbWVzc2FnZS5ib2R5IT1udWxsKSB7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogbWVzc2FnZS50aXRsZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLmJvZHksXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgfSAgXG4gICAgfVxufSkudGhlbihcbiAgKGluc3RhbmNlKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJmaXJlYmFzZS5pbml0IGRvbmVcIik7XG4gIH0sXG4gIChlcnJvcikgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiZmlyZWJhc2UuaW5pdCBlcnJvcjogXCIgKyBlcnJvcik7XG4gIH1cbik7XG5cbi8qXG5hcHBsaWNhdGlvbk9uKGxhdW5jaEV2ZW50LCBmdW5jdGlvbiAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpIHtcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIGFuZHJvaWQuY29udGVudC5JbnRlbnQgY2xhc3MuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTGF1bmNoZWQgQW5kcm9pZCBhcHBsaWNhdGlvbiB3aXRoIHRoZSBmb2xsb3dpbmcgaW50ZW50OiBcIiArIGFyZ3MuYW5kcm9pZCArIFwiLlwiKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3MuaW9zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gRm9yIGlPUyBhcHBsaWNhdGlvbnMsIGFyZ3MuaW9zIGlzIE5TRGljdGlvbmFyeSAobGF1bmNoT3B0aW9ucykuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTGF1bmNoZWQgaU9TIGFwcGxpY2F0aW9uIHdpdGggb3B0aW9uczogXCIgKyBhcmdzLmlvcyk7XG4gICAgfVxufSk7XG5cbmFwcGxpY2F0aW9uT24oc3VzcGVuZEV2ZW50LCBmdW5jdGlvbiAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpIHtcbiAgICBpZiAoYXJncy5hbmRyb2lkKSB7XG4gICAgICAgIC8vIEZvciBBbmRyb2lkIGFwcGxpY2F0aW9ucywgYXJncy5hbmRyb2lkIGlzIGFuIGFuZHJvaWQgYWN0aXZpdHkgY2xhc3MuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU1VTUEVORCBBY3Rpdml0eTogXCIgKyBhcmdzLmFuZHJvaWQpO1xuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcbiAgICAgICAgLy8gRm9yIGlPUyBhcHBsaWNhdGlvbnMsIGFyZ3MuaW9zIGlzIFVJQXBwbGljYXRpb24uXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU1VTUEVORCBVSUFwcGxpY2F0aW9uOiBcIiArIGFyZ3MuaW9zKTtcbiAgICB9XG59KTtcblxuYXBwbGljYXRpb25PbihyZXN1bWVFdmVudCwgZnVuY3Rpb24gKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKSB7XG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xuICAgICAgICAvLyBGb3IgQW5kcm9pZCBhcHBsaWNhdGlvbnMsIGFyZ3MuYW5kcm9pZCBpcyBhbiBhbmRyb2lkIGFjdGl2aXR5IGNsYXNzLlxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJFU1VNRSBBY3Rpdml0eTogXCIgKyBhcmdzLmFuZHJvaWQpO1xuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcbiAgICAgICAgLy8gRm9yIGlPUyBhcHBsaWNhdGlvbnMsIGFyZ3MuaW9zIGlzIFVJQXBwbGljYXRpb24uXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUkVTVU1FIFVJQXBwbGljYXRpb246IFwiICsgYXJncy5pb3MpO1xuICAgIH1cbn0pO1xuXG5hcHBsaWNhdGlvbk9uKGV4aXRFdmVudCwgZnVuY3Rpb24gKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKSB7XG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xuICAgICAgICAvLyBGb3IgQW5kcm9pZCBhcHBsaWNhdGlvbnMsIGFyZ3MuYW5kcm9pZCBpcyBhbiBhbmRyb2lkIGFjdGl2aXR5IGNsYXNzLlxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVYSVQgQWN0aXZpdHk6IFwiICsgYXJncy5hbmRyb2lkKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3MuaW9zKSB7XG4gICAgICAgIC8vIEZvciBpT1MgYXBwbGljYXRpb25zLCBhcmdzLmlvcyBpcyBVSUFwcGxpY2F0aW9uLlxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVYSVQgVUlBcHBsaWNhdGlvbjogXCIgKyBhcmdzLmlvcyk7XG4gICAgfVxufSk7XG5cbmFwcGxpY2F0aW9uT24obG93TWVtb3J5RXZlbnQsIGZ1bmN0aW9uIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSkge1xuICAgIGlmIChhcmdzLmFuZHJvaWQpIHtcbiAgICAgICAgLy8gRm9yIEFuZHJvaWQgYXBwbGljYXRpb25zLCBhcmdzLmFuZHJvaWQgaXMgYW4gYW5kcm9pZCBhY3Rpdml0eSBjbGFzcy5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJMT1cgTUVNT1JZIEFjdGl2aXR5OiBcIiArIGFyZ3MuYW5kcm9pZCk7XG4gICAgfSBlbHNlIGlmIChhcmdzLmlvcykge1xuICAgICAgICAvLyBGb3IgaU9TIGFwcGxpY2F0aW9ucywgYXJncy5pb3MgaXMgVUlBcHBsaWNhdGlvbi5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJMT1cgTUVNT1JZIFVJQXBwbGljYXRpb246IFwiICsgYXJncy5pb3MpO1xuICAgIH1cbn0pO1xuXG5hcHBsaWNhdGlvbk9uKHVuY2F1Z2h0RXJyb3JFdmVudCwgZnVuY3Rpb24gKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKSB7XG4gICAgaWYgKGFyZ3MuYW5kcm9pZCkge1xuICAgICAgICAvLyBGb3IgQW5kcm9pZCBhcHBsaWNhdGlvbnMsIGFyZ3MuYW5kcm9pZCBpcyBhbiBOYXRpdmVTY3JpcHRFcnJvci5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJFUlJPUiBOYXRpdmVTY3JpcHRFcnJvcjogXCIgKyBhcmdzLmFuZHJvaWQpO1xuICAgIH0gZWxzZSBpZiAoYXJncy5pb3MpIHtcbiAgICAgICAgLy8gRm9yIGlPUyBhcHBsaWNhdGlvbnMsIGFyZ3MuaW9zIGlzIE5hdGl2ZVNjcmlwdEVycm9yLlxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVSUk9SIE5hdGl2ZVNjcmlwdEVycm9yOiBcIiArIGFyZ3MuaW9zKTtcbiAgICB9XG59KTtcbiovXG5cblxuXG5cblxuLypcbmNvbm5lY3Rpdml0eS5zdGFydE1vbml0b3JpbmcoZnVuY3Rpb24gb25Db25uZWN0aW9uVHlwZUNoYW5nZWQobmV3Q29ubmVjdGlvblR5cGU6IG51bWJlcikge1xuICAgIHN3aXRjaCAobmV3Q29ubmVjdGlvblR5cGUpIHtcbiAgICAgICAgY2FzZSBjb25uZWN0aXZpdHkuY29ubmVjdGlvblR5cGUubm9uZTpcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJDb25uZWN0aW9uIHR5cGUgY2hhbmdlZCB0byBub25lLlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eS5jb25uZWN0aW9uVHlwZS53aWZpOlxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gdHlwZSBjaGFuZ2VkIHRvIFdpRmkuXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgY29ubmVjdGl2aXR5LmNvbm5lY3Rpb25UeXBlLm1vYmlsZTpcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJDb25uZWN0aW9uIHR5cGUgY2hhbmdlZCB0byBtb2JpbGUuXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG4qL1xuXG5sZXQgbW9uaXRvciA9IG5ldyBNb25pdG9yKG5ldyBMb2FkZXIoKSk7XG5tb25pdG9yLnN0YXJ0UGluZ0FsaXZlKFwiaHR0cHM6Ly93d3cubGluZmFzZXJ2aWNlLml0XCIpO1xuXG5cbmVuYWJsZVByb2RNb2RlKCk7XG5cbnBsYXRmb3JtTmF0aXZlU2NyaXB0RHluYW1pYygpLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpO1xuIl19