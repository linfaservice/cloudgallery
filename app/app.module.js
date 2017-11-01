"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("ui/page");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var router_1 = require("nativescript-angular/router");
var angular_1 = require("nativescript-telerik-ui-pro/sidedrawer/angular");
var angular_2 = require("nativescript-telerik-ui-pro/listview/angular");
var angular_3 = require("nativescript-telerik-ui-pro/chart/angular");
var angular_4 = require("nativescript-telerik-ui-pro/calendar/angular");
var angular_5 = require("nativescript-drop-down/angular");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var app_routing_1 = require("./app.routing");
var http_2 = require("@angular/http");
var ng2_translate_1 = require("ng2-translate");
var util_1 = require("./common/util");
var loader_1 = require("./common/loader");
var gallery_cache_1 = require("./common/gallery.cache");
var Settings = require("application-settings");
var monitor_1 = require("./common/monitor");
var ng2_translate_2 = require("ng2-translate");
function createTranslateLoader(http) {
    return new ng2_translate_1.TranslateStaticLoader(http, '/i18n', '.json');
}
exports.createTranslateLoader = createTranslateLoader;
var AppModule = /** @class */ (function () {
    function AppModule(page, loader, util, translate) {
        /*
        setCurrentOrientation("portrait", function() {
          //console.log("Set portrait orientation");
        });
        */
        this.loader = loader;
        this.util = util;
        this.translate = translate;
        /*
        page.on("navigatedTo",function() {
          setCurrentOrientation("portrait",function() {
            console.log("portrait orientation");
          });
        });
        page.on("navigatingFrom",function() {
          orientationCleanup();
        });
        */
    }
    AppModule_1 = AppModule;
    ;
    AppModule.prototype.isWellConfigured = function (host, username, password) {
        var configured = true;
        if (host == null || host == "")
            return false;
        if (username == null || username == "")
            return false;
        if (password == null || password == "")
            return false;
        //if(!okLogin()) configured = false;
        return configured;
    };
    AppModule.prototype.ngAfterViewInit = function () {
        var host = Settings.getString("host");
        var username = Settings.getString("username");
        var password = Settings.getString("password");
        this.util.log("Host", host);
        this.util.log("Username", username);
        this.util.log("Password", (password == null || password == "") ? password : "*****");
        var monitor = new monitor_1.default(this.loader, this.translate);
        monitor.startPingAlive("https://linfaservice.it");
        if (this.isWellConfigured(host, username, password))
            this.util.navigate("");
        else
            this.util.navigate("settings");
        // into the contructor it seems to be triggered twice
        /*
        if (application.android) {
          application.android.on(
              AndroidApplication.activityBackPressedEvent,
              (data: AndroidActivityBackPressedEventData) => {
                  data.cancel = true; // prevents default back button behavior
                  this.util.navigateBack();
              }
          );
        }
        */
    };
    AppModule = AppModule_1 = __decorate([
        core_1.NgModule({
            declarations: [
                AppModule_1
            ].concat(app_routing_1.navigatableComponents),
            entryComponents: [],
            imports: [
                nativescript_module_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule,
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.routes),
                angular_1.NativeScriptUISideDrawerModule,
                angular_2.NativeScriptUIListViewModule,
                angular_3.NativeScriptUIChartModule,
                angular_4.NativeScriptUICalendarModule,
                angular_5.DropDownModule,
                nativescript_ngx_fonticon_1.TNSFontIconModule.forRoot({
                    'fa': './css/font-awesome.css',
                }),
                ng2_translate_1.TranslateModule.forRoot({
                    provide: ng2_translate_1.TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [http_2.Http]
                })
            ],
            schemas: [core_1.NO_ERRORS_SCHEMA],
            bootstrap: [AppModule_1],
            providers: [loader_1.default, util_1.Util, gallery_cache_1.default]
        }),
        core_1.Component({
            selector: "main-app",
            template: "<page-router-outlet></page-router-outlet>"
        }),
        __metadata("design:paramtypes", [page_1.Page,
            loader_1.default,
            util_1.Util,
            ng2_translate_2.TranslateService])
    ], AppModule);
    return AppModule;
    var AppModule_1;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsZ0ZBQThFO0FBQzlFLHNEQUF1RTtBQUN2RSwwRUFBZ0c7QUFDaEcsd0VBQTRGO0FBQzVGLHFFQUFzRjtBQUN0Rix3RUFBNEY7QUFDNUYsMERBQWdFO0FBRWhFLHVFQUE4RDtBQUc5RCw2Q0FBOEQ7QUFDOUQsc0NBQXFDO0FBQ3JDLCtDQUF3RjtBQUN4RixzQ0FBcUM7QUFDckMsMENBQXFDO0FBQ3JDLHdEQUFrRDtBQUNsRCwrQ0FBaUQ7QUFHakQsNENBQXVDO0FBQ3ZDLCtDQUFpRDtBQUVqRCwrQkFBc0MsSUFBVTtJQUM1QyxNQUFNLENBQUMsSUFBSSxxQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFGRCxzREFFQztBQXlDRDtJQUNFLG1CQUNFLElBQVMsRUFDRCxNQUFjLEVBQ2QsSUFBVSxFQUNWLFNBQTJCO1FBRW5DOzs7O1VBSUU7UUFSTSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBUW5DOzs7Ozs7Ozs7VUFTRTtJQUNKLENBQUM7a0JBdkJVLFNBQVM7SUF1Qm5CLENBQUM7SUFFTSxvQ0FBZ0IsR0FBeEIsVUFBeUIsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRO1FBQy9DLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztRQUN0QixFQUFFLENBQUEsQ0FBQyxJQUFJLElBQUUsSUFBSSxJQUFJLElBQUksSUFBRSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQSxDQUFDLFFBQVEsSUFBRSxJQUFJLElBQUksUUFBUSxJQUFFLEVB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RU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFVJU2lkZURyYXdlck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vc2lkZWRyYXdlci9hbmd1bGFyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpLXByby9saXN0dmlldy9hbmd1bGFyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSUNoYXJ0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpLXByby9jaGFydC9hbmd1bGFyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSUNhbGVuZGFyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpLXByby9jYWxlbmRhci9hbmd1bGFyXCI7XG5pbXBvcnQgeyBEcm9wRG93bk1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duL2FuZ3VsYXJcIjtcbmltcG9ydCB7IHNldEN1cnJlbnRPcmllbnRhdGlvbiAsIG9yaWVudGF0aW9uQ2xlYW51cCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc2NyZWVuLW9yaWVudGF0aW9uXCJcbmltcG9ydCB7IFROU0ZvbnRJY29uTW9kdWxlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IEFuZHJvaWRBcHBsaWNhdGlvbiwgQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IHJvdXRlcywgbmF2aWdhdGFibGVDb21wb25lbnRzIH0gZnJvbSBcIi4vYXBwLnJvdXRpbmdcIjtcbmltcG9ydCB7IEh0dHAgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlLCBUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZVN0YXRpY0xvYWRlciB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4vY29tbW9uL3V0aWxcIjtcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4vY29tbW9uL2xvYWRlclwiO1xuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi9jb21tb24vZ2FsbGVyeS5jYWNoZVwiO1xuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyB1dGY4IGZyb20gXCJ1dGY4XCI7XG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7IFxuaW1wb3J0IE1vbml0b3IgZnJvbSBcIi4vY29tbW9uL21vbml0b3JcIjtcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHApIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zbGF0ZVN0YXRpY0xvYWRlcihodHRwLCAnL2kxOG4nLCAnLmpzb24nKTtcbn0gIFxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBcHBNb2R1bGUsXG4gICAgLi4ubmF2aWdhdGFibGVDb21wb25lbnRzXG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW1xuXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzKSxcblx0ICBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUgLFxuICAgIE5hdGl2ZVNjcmlwdFVJTGlzdFZpZXdNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0VUlDaGFydE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRVSUNhbGVuZGFyTW9kdWxlLFxuICAgIERyb3BEb3duTW9kdWxlLFxuICAgIFROU0ZvbnRJY29uTW9kdWxlLmZvclJvb3Qoe1xuXHRcdCAgJ2ZhJzogJy4vY3NzL2ZvbnQtYXdlc29tZS5jc3MnLFxuXHRcdCAgLyogJ2lvbic6ICcuL2Nzcy9pb25pY29ucy5jc3MnICovXG4gICAgfSksXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXG4gICAgICAgIHVzZUZhY3Rvcnk6IChjcmVhdGVUcmFuc2xhdGVMb2FkZXIpLFxuICAgICAgICBkZXBzOiBbSHR0cF1cbiAgICB9KVxuICBdLFxuICBzY2hlbWFzOiBbTk9fRVJST1JTX1NDSEVNQV0sXG4gIGJvb3RzdHJhcDogW0FwcE1vZHVsZV0sXG4gIHByb3ZpZGVyczogW0xvYWRlciwgVXRpbCwgR2FsbGVyeUNhY2hlXSAgXG59KSBcblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibWFpbi1hcHBcIixcbiAgdGVtcGxhdGU6IGA8cGFnZS1yb3V0ZXItb3V0bGV0PjwvcGFnZS1yb3V0ZXItb3V0bGV0PmBcbn0pIFxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBwYWdlOlBhZ2UsXG4gICAgcHJpdmF0ZSBsb2FkZXI6IExvYWRlcixcbiAgICBwcml2YXRlIHV0aWw6IFV0aWwsIFxuICAgIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxuICApICB7XG4gICAgLypcbiAgICBzZXRDdXJyZW50T3JpZW50YXRpb24oXCJwb3J0cmFpdFwiLCBmdW5jdGlvbigpIHsgICAgICAgIFxuICAgICAgLy9jb25zb2xlLmxvZyhcIlNldCBwb3J0cmFpdCBvcmllbnRhdGlvblwiKTsgICAgXG4gICAgfSk7ICBcbiAgICAqLyAgICAgIFxuXG4gICAgLyogICAgICBcbiAgICBwYWdlLm9uKFwibmF2aWdhdGVkVG9cIixmdW5jdGlvbigpIHtcbiAgICAgIHNldEN1cnJlbnRPcmllbnRhdGlvbihcInBvcnRyYWl0XCIsZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicG9ydHJhaXQgb3JpZW50YXRpb25cIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwYWdlLm9uKFwibmF2aWdhdGluZ0Zyb21cIixmdW5jdGlvbigpIHtcbiAgICAgIG9yaWVudGF0aW9uQ2xlYW51cCgpO1xuICAgIH0pO1xuICAgICovXG4gIH07ICBcbiAgXG4gIHByaXZhdGUgaXNXZWxsQ29uZmlndXJlZChob3N0LCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICBsZXQgY29uZmlndXJlZCA9IHRydWU7XG4gICAgaWYoaG9zdD09bnVsbCB8fCBob3N0PT1cIlwiKSByZXR1cm4gZmFsc2U7XG4gICAgaWYodXNlcm5hbWU9PW51bGwgfHwgdXNlcm5hbWU9PVwiXCIpIHJldHVybiBmYWxzZTtcbiAgICBpZihwYXNzd29yZD09bnVsbCB8fCBwYXNzd29yZD09XCJcIikgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy9pZighb2tMb2dpbigpKSBjb25maWd1cmVkID0gZmFsc2U7XG4gICAgcmV0dXJuIGNvbmZpZ3VyZWQ7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuXG4gICAgbGV0IGhvc3QgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0XCIpO1xuICAgIGxldCB1c2VybmFtZSA9IFNldHRpbmdzLmdldFN0cmluZyhcInVzZXJuYW1lXCIpO1xuICAgIGxldCBwYXNzd29yZCA9IFNldHRpbmdzLmdldFN0cmluZyhcInBhc3N3b3JkXCIpO1xuXG4gICAgdGhpcy51dGlsLmxvZyhcIkhvc3RcIiwgaG9zdCk7XG4gICAgdGhpcy51dGlsLmxvZyhcIlVzZXJuYW1lXCIsIHVzZXJuYW1lKTtcbiAgICB0aGlzLnV0aWwubG9nKFwiUGFzc3dvcmRcIiwgKHBhc3N3b3JkPT1udWxsfHxwYXNzd29yZD09XCJcIik/IHBhc3N3b3JkOlwiKioqKipcIik7XG5cbiAgICBsZXQgbW9uaXRvciA9IG5ldyBNb25pdG9yKHRoaXMubG9hZGVyLCB0aGlzLnRyYW5zbGF0ZSk7XG4gICAgbW9uaXRvci5zdGFydFBpbmdBbGl2ZShcImh0dHBzOi8vbGluZmFzZXJ2aWNlLml0XCIpOyAgICAgICAgXG5cbiAgICBpZih0aGlzLmlzV2VsbENvbmZpZ3VyZWQoaG9zdCwgdXNlcm5hbWUsIHBhc3N3b3JkKSkgdGhpcy51dGlsLm5hdmlnYXRlKFwiXCIpO1xuICAgIGVsc2UgdGhpcy51dGlsLm5hdmlnYXRlKFwic2V0dGluZ3NcIik7XG5cblx0Ly8gaW50byB0aGUgY29udHJ1Y3RvciBpdCBzZWVtcyB0byBiZSB0cmlnZ2VyZWQgdHdpY2VcbiAgICAvKlxuICAgIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XG4gICAgICBhcHBsaWNhdGlvbi5hbmRyb2lkLm9uKFxuICAgICAgICAgIEFuZHJvaWRBcHBsaWNhdGlvbi5hY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnQsIFxuICAgICAgICAgIChkYXRhOiBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSkgPT4ge1xuICAgICAgICAgICAgICBkYXRhLmNhbmNlbCA9IHRydWU7IC8vIHByZXZlbnRzIGRlZmF1bHQgYmFjayBidXR0b24gYmVoYXZpb3JcbiAgICAgICAgICAgICAgdGhpcy51dGlsLm5hdmlnYXRlQmFjaygpO1xuICAgICAgICAgIH0gXG4gICAgICApOyAgICAgICBcbiAgICB9ICAgXG4gICAgKi9cbiAgfSAgXG59XG4gIl19