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
var angular_6 = require("nativescript-masked-text-field/angular");
var image_modal_component_1 = require("./pages/gallery/image-modal.component");
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
        monitor.startPingAlive("https://www.linfaservice.it");
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
                AppModule_1,
                image_modal_component_1.ImageModalComponent
            ].concat(app_routing_1.navigatableComponents),
            entryComponents: [
                image_modal_component_1.ImageModalComponent
            ],
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
                angular_6.MaskedTextFieldModule,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsZ0ZBQThFO0FBQzlFLHNEQUF1RTtBQUN2RSwwRUFBZ0c7QUFDaEcsd0VBQTRGO0FBQzVGLHFFQUFzRjtBQUN0Rix3RUFBNEY7QUFDNUYsMERBQWdFO0FBRWhFLHVFQUE4RDtBQUM5RCxrRUFBK0U7QUFHL0UsK0VBQTRFO0FBQzVFLDZDQUE4RDtBQUM5RCxzQ0FBcUM7QUFDckMsK0NBQXdGO0FBQ3hGLHNDQUFxQztBQUNyQywwQ0FBcUM7QUFDckMsd0RBQWtEO0FBQ2xELCtDQUFpRDtBQUdqRCw0Q0FBdUM7QUFDdkMsK0NBQWlEO0FBRWpELCtCQUFzQyxJQUFVO0lBQzVDLE1BQU0sQ0FBQyxJQUFJLHFDQUFxQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUZELHNEQUVDO0FBMkNEO0lBQ0UsbUJBQ0UsSUFBUyxFQUNELE1BQWMsRUFDZCxJQUFVLEVBQ1YsU0FBMkI7UUFFbkM7Ozs7VUFJRTtRQVJNLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFRbkM7Ozs7Ozs7OztVQVNFO0lBQ0osQ0FBQztrQkF2QlUsU0FBUztJQXVCbkIsQ0FBQztJQUVNLG9DQUFnQixHQUF4QixVQUF5QixJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVE7UUFDL0MsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQSxDQUFDLElBQUksSUFBRSxJQUFJLElBQUksSUFBSSxJQUFFLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDeEMsRUFBRSxDQUFBLENBQUMsUUFBUSxJ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QUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlMaXN0Vmlld01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vbGlzdHZpZXcvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlDaGFydE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vY2hhcnQvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlDYWxlbmRhck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vY2FsZW5kYXIvYW5ndWxhclwiO1xuaW1wb3J0IHsgRHJvcERvd25Nb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93bi9hbmd1bGFyXCI7XG5pbXBvcnQgeyBzZXRDdXJyZW50T3JpZW50YXRpb24gLCBvcmllbnRhdGlvbkNsZWFudXAgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNjcmVlbi1vcmllbnRhdGlvblwiXG5pbXBvcnQgeyBUTlNGb250SWNvbk1vZHVsZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xuaW1wb3J0IHsgTWFza2VkVGV4dEZpZWxkTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1tYXNrZWQtdGV4dC1maWVsZC9hbmd1bGFyXCI7XG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IEFuZHJvaWRBcHBsaWNhdGlvbiwgQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IEltYWdlTW9kYWxDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy9nYWxsZXJ5L2ltYWdlLW1vZGFsLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgcm91dGVzLCBuYXZpZ2F0YWJsZUNvbXBvbmVudHMgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xuaW1wb3J0IHsgSHR0cCB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUsIFRyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlU3RhdGljTG9hZGVyIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi9jb21tb24vdXRpbFwiO1xuaW1wb3J0IExvYWRlciBmcm9tIFwiLi9jb21tb24vbG9hZGVyXCI7XG5pbXBvcnQgR2FsbGVyeUNhY2hlIGZyb20gXCIuL2NvbW1vbi9nYWxsZXJ5LmNhY2hlXCI7XG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCAqIGFzIHV0ZjggZnJvbSBcInV0ZjhcIjtcbmltcG9ydCAqIGFzICBCYXNlNjQgZnJvbSBcImJhc2UtNjRcIjsgXG5pbXBvcnQgTW9uaXRvciBmcm9tIFwiLi9jb21tb24vbW9uaXRvclwiO1xuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cCkge1xuICAgIHJldHVybiBuZXcgVHJhbnNsYXRlU3RhdGljTG9hZGVyKGh0dHAsICcvaTE4bicsICcuanNvbicpO1xufSAgXG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEFwcE1vZHVsZSxcbiAgICBJbWFnZU1vZGFsQ29tcG9uZW50LFxuICAgIC4uLm5hdmlnYXRhYmxlQ29tcG9uZW50c1xuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICBJbWFnZU1vZGFsQ29tcG9uZW50XG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzKSxcblx0ICBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUgLFxuICAgIE5hdGl2ZVNjcmlwdFVJTGlzdFZpZXdNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0VUlDaGFydE1vZHVsZSxcbiAgICBOYXRpdmVTY3JpcHRVSUNhbGVuZGFyTW9kdWxlLFxuICAgIERyb3BEb3duTW9kdWxlLFxuICAgIE1hc2tlZFRleHRGaWVsZE1vZHVsZSxcbiAgICBUTlNGb250SWNvbk1vZHVsZS5mb3JSb290KHtcblx0XHQgICdmYSc6ICcuL2Nzcy9mb250LWF3ZXNvbWUuY3NzJyxcblx0XHQgIC8qICdpb24nOiAnLi9jc3MvaW9uaWNvbnMuY3NzJyAqL1xuICAgIH0pLFxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxuICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcbiAgICAgICAgZGVwczogW0h0dHBdXG4gICAgfSlcbiAgXSxcbiAgc2NoZW1hczogW05PX0VSUk9SU19TQ0hFTUFdLFxuICBib290c3RyYXA6IFtBcHBNb2R1bGVdLFxuICBwcm92aWRlcnM6IFtMb2FkZXIsIFV0aWwsIEdhbGxlcnlDYWNoZV0gIFxufSkgXG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcIm1haW4tYXBwXCIsXG4gIHRlbXBsYXRlOiBgPHBhZ2Utcm91dGVyLW91dGxldD48L3BhZ2Utcm91dGVyLW91dGxldD5gXG59KSBcbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgcGFnZTpQYWdlLFxuICAgIHByaXZhdGUgbG9hZGVyOiBMb2FkZXIsXG4gICAgcHJpdmF0ZSB1dGlsOiBVdGlsLCBcbiAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcbiAgKSAge1xuICAgIC8qXG4gICAgc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG9ydHJhaXRcIiwgZnVuY3Rpb24oKSB7ICAgICAgICBcbiAgICAgIC8vY29uc29sZS5sb2coXCJTZXQgcG9ydHJhaXQgb3JpZW50YXRpb25cIik7ICAgIFxuICAgIH0pOyAgXG4gICAgKi8gICAgICBcblxuICAgIC8qICAgICAgXG4gICAgcGFnZS5vbihcIm5hdmlnYXRlZFRvXCIsZnVuY3Rpb24oKSB7XG4gICAgICBzZXRDdXJyZW50T3JpZW50YXRpb24oXCJwb3J0cmFpdFwiLGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInBvcnRyYWl0IG9yaWVudGF0aW9uXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcGFnZS5vbihcIm5hdmlnYXRpbmdGcm9tXCIsZnVuY3Rpb24oKSB7XG4gICAgICBvcmllbnRhdGlvbkNsZWFudXAoKTtcbiAgICB9KTtcbiAgICAqL1xuICB9OyAgXG4gIFxuICBwcml2YXRlIGlzV2VsbENvbmZpZ3VyZWQoaG9zdCwgdXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgbGV0IGNvbmZpZ3VyZWQgPSB0cnVlO1xuICAgIGlmKGhvc3Q9PW51bGwgfHwgaG9zdD09XCJcIikgcmV0dXJuIGZhbHNlO1xuICAgIGlmKHVzZXJuYW1lPT1udWxsIHx8IHVzZXJuYW1lPT1cIlwiKSByZXR1cm4gZmFsc2U7XG4gICAgaWYocGFzc3dvcmQ9PW51bGwgfHwgcGFzc3dvcmQ9PVwiXCIpIHJldHVybiBmYWxzZTtcblxuICAgIC8vaWYoIW9rTG9naW4oKSkgY29uZmlndXJlZCA9IGZhbHNlO1xuICAgIHJldHVybiBjb25maWd1cmVkO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcblxuICAgIGxldCBob3N0ID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdFwiKTtcbiAgICBsZXQgdXNlcm5hbWUgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VybmFtZVwiKTtcbiAgICBsZXQgcGFzc3dvcmQgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJwYXNzd29yZFwiKTtcblxuICAgIHRoaXMudXRpbC5sb2coXCJIb3N0XCIsIGhvc3QpO1xuICAgIHRoaXMudXRpbC5sb2coXCJVc2VybmFtZVwiLCB1c2VybmFtZSk7XG4gICAgdGhpcy51dGlsLmxvZyhcIlBhc3N3b3JkXCIsIChwYXNzd29yZD09bnVsbHx8cGFzc3dvcmQ9PVwiXCIpPyBwYXNzd29yZDpcIioqKioqXCIpO1xuXG4gICAgbGV0IG1vbml0b3IgPSBuZXcgTW9uaXRvcih0aGlzLmxvYWRlciwgdGhpcy50cmFuc2xhdGUpO1xuICAgIG1vbml0b3Iuc3RhcnRQaW5nQWxpdmUoXCJodHRwczovL3d3dy5saW5mYXNlcnZpY2UuaXRcIik7ICAgICAgICBcblxuICAgIGlmKHRoaXMuaXNXZWxsQ29uZmlndXJlZChob3N0LCB1c2VybmFtZSwgcGFzc3dvcmQpKSB0aGlzLnV0aWwubmF2aWdhdGUoXCJcIik7XG4gICAgZWxzZSB0aGlzLnV0aWwubmF2aWdhdGUoXCJzZXR0aW5nc1wiKTtcblxuXHQvLyBpbnRvIHRoZSBjb250cnVjdG9yIGl0IHNlZW1zIHRvIGJlIHRyaWdnZXJlZCB0d2ljZVxuICAgIC8qXG4gICAgaWYgKGFwcGxpY2F0aW9uLmFuZHJvaWQpIHtcbiAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oXG4gICAgICAgICAgQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgXG4gICAgICAgICAgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGRhdGEuY2FuY2VsID0gdHJ1ZTsgLy8gcHJldmVudHMgZGVmYXVsdCBiYWNrIGJ1dHRvbiBiZWhhdmlvclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubmF2aWdhdGVCYWNrKCk7XG4gICAgICAgICAgfSBcbiAgICAgICk7ICAgICAgIFxuICAgIH0gICBcbiAgICAqL1xuICB9ICBcbn1cbiAiXX0=