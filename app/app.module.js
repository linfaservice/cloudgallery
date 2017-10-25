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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsZ0ZBQThFO0FBQzlFLHNEQUF1RTtBQUN2RSwwRUFBZ0c7QUFDaEcsd0VBQTRGO0FBQzVGLHFFQUFzRjtBQUN0Rix3RUFBNEY7QUFDNUYsMERBQWdFO0FBRWhFLHVFQUE4RDtBQUc5RCwrRUFBNEU7QUFDNUUsNkNBQThEO0FBQzlELHNDQUFxQztBQUNyQywrQ0FBd0Y7QUFDeEYsc0NBQXFDO0FBQ3JDLDBDQUFxQztBQUNyQyx3REFBa0Q7QUFDbEQsK0NBQWlEO0FBR2pELDRDQUF1QztBQUN2QywrQ0FBaUQ7QUFFakQsK0JBQXNDLElBQVU7SUFDNUMsTUFBTSxDQUFDLElBQUkscUNBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRkQsc0RBRUM7QUEwQ0Q7SUFDRSxtQkFDRSxJQUFTLEVBQ0QsTUFBYyxFQUNkLElBQVUsRUFDVixTQUEyQjtRQUVuQzs7OztVQUlFO1FBUk0sV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQVFuQzs7Ozs7Ozs7O1VBU0U7SUFDSixDQUFDO2tCQXZCVSxTQUFTO0lBdUJuQixDQUFDO0lBRU0sb0NBQWdCLEdBQXhCLFVBQXlCLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUTtRQUMvQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdEIsRUFBRSxDQUFBLENBQUMsSUFBSSxJQUFFLElBQUksSUFBSSxJQUFJLElBQUUsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QyxFQUFFLENBQUEsQ0FBQyxRQUFRLElBQUUsSUFBSSxJQUFJ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b3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlMaXN0Vmlld01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vbGlzdHZpZXcvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlDaGFydE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vY2hhcnQvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlDYWxlbmRhck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vY2FsZW5kYXIvYW5ndWxhclwiO1xuaW1wb3J0IHsgRHJvcERvd25Nb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93bi9hbmd1bGFyXCI7XG5pbXBvcnQgeyBzZXRDdXJyZW50T3JpZW50YXRpb24gLCBvcmllbnRhdGlvbkNsZWFudXAgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNjcmVlbi1vcmllbnRhdGlvblwiXG5pbXBvcnQgeyBUTlNGb250SWNvbk1vZHVsZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBJbWFnZU1vZGFsQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvZ2FsbGVyeS9pbWFnZS1tb2RhbC5jb21wb25lbnRcIjtcbmltcG9ydCB7IHJvdXRlcywgbmF2aWdhdGFibGVDb21wb25lbnRzIH0gZnJvbSBcIi4vYXBwLnJvdXRpbmdcIjtcbmltcG9ydCB7IEh0dHAgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlLCBUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZVN0YXRpY0xvYWRlciB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4vY29tbW9uL3V0aWxcIjtcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4vY29tbW9uL2xvYWRlclwiO1xuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi9jb21tb24vZ2FsbGVyeS5jYWNoZVwiO1xuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyB1dGY4IGZyb20gXCJ1dGY4XCI7XG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7IFxuaW1wb3J0IE1vbml0b3IgZnJvbSBcIi4vY29tbW9uL21vbml0b3JcIjtcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHApIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zbGF0ZVN0YXRpY0xvYWRlcihodHRwLCAnL2kxOG4nLCAnLmpzb24nKTtcbn0gIFxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBcHBNb2R1bGUsXG4gICAgSW1hZ2VNb2RhbENvbXBvbmVudCxcbiAgICAuLi5uYXZpZ2F0YWJsZUNvbXBvbmVudHNcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgSW1hZ2VNb2RhbENvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyksXG5cdCAgTmF0aXZlU2NyaXB0VUlTaWRlRHJhd2VyTW9kdWxlICxcbiAgICBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFVJQ2hhcnRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0VUlDYWxlbmRhck1vZHVsZSxcbiAgICBEcm9wRG93bk1vZHVsZSxcbiAgICBUTlNGb250SWNvbk1vZHVsZS5mb3JSb290KHtcblx0XHQgICdmYSc6ICcuL2Nzcy9mb250LWF3ZXNvbWUuY3NzJyxcblx0XHQgIC8qICdpb24nOiAnLi9jc3MvaW9uaWNvbnMuY3NzJyAqL1xuICAgIH0pLFxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxuICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcbiAgICAgICAgZGVwczogW0h0dHBdXG4gICAgfSlcbiAgXSxcbiAgc2NoZW1hczogW05PX0VSUk9SU19TQ0hFTUFdLFxuICBib290c3RyYXA6IFtBcHBNb2R1bGVdLFxuICBwcm92aWRlcnM6IFtMb2FkZXIsIFV0aWwsIEdhbGxlcnlDYWNoZV0gIFxufSkgXG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcIm1haW4tYXBwXCIsXG4gIHRlbXBsYXRlOiBgPHBhZ2Utcm91dGVyLW91dGxldD48L3BhZ2Utcm91dGVyLW91dGxldD5gXG59KSBcbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgcGFnZTpQYWdlLFxuICAgIHByaXZhdGUgbG9hZGVyOiBMb2FkZXIsXG4gICAgcHJpdmF0ZSB1dGlsOiBVdGlsLCBcbiAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcbiAgKSAge1xuICAgIC8qXG4gICAgc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG9ydHJhaXRcIiwgZnVuY3Rpb24oKSB7ICAgICAgICBcbiAgICAgIC8vY29uc29sZS5sb2coXCJTZXQgcG9ydHJhaXQgb3JpZW50YXRpb25cIik7ICAgIFxuICAgIH0pOyAgXG4gICAgKi8gICAgICBcblxuICAgIC8qICAgICAgXG4gICAgcGFnZS5vbihcIm5hdmlnYXRlZFRvXCIsZnVuY3Rpb24oKSB7XG4gICAgICBzZXRDdXJyZW50T3JpZW50YXRpb24oXCJwb3J0cmFpdFwiLGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInBvcnRyYWl0IG9yaWVudGF0aW9uXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcGFnZS5vbihcIm5hdmlnYXRpbmdGcm9tXCIsZnVuY3Rpb24oKSB7XG4gICAgICBvcmllbnRhdGlvbkNsZWFudXAoKTtcbiAgICB9KTtcbiAgICAqL1xuICB9OyAgXG4gIFxuICBwcml2YXRlIGlzV2VsbENvbmZpZ3VyZWQoaG9zdCwgdXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgbGV0IGNvbmZpZ3VyZWQgPSB0cnVlO1xuICAgIGlmKGhvc3Q9PW51bGwgfHwgaG9zdD09XCJcIikgcmV0dXJuIGZhbHNlO1xuICAgIGlmKHVzZXJuYW1lPT1udWxsIHx8IHVzZXJuYW1lPT1cIlwiKSByZXR1cm4gZmFsc2U7XG4gICAgaWYocGFzc3dvcmQ9PW51bGwgfHwgcGFzc3dvcmQ9PVwiXCIpIHJldHVybiBmYWxzZTtcblxuICAgIC8vaWYoIW9rTG9naW4oKSkgY29uZmlndXJlZCA9IGZhbHNlO1xuICAgIHJldHVybiBjb25maWd1cmVkO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcblxuICAgIGxldCBob3N0ID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdFwiKTtcbiAgICBsZXQgdXNlcm5hbWUgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VybmFtZVwiKTtcbiAgICBsZXQgcGFzc3dvcmQgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJwYXNzd29yZFwiKTtcblxuICAgIHRoaXMudXRpbC5sb2coXCJIb3N0XCIsIGhvc3QpO1xuICAgIHRoaXMudXRpbC5sb2coXCJVc2VybmFtZVwiLCB1c2VybmFtZSk7XG4gICAgdGhpcy51dGlsLmxvZyhcIlBhc3N3b3JkXCIsIChwYXNzd29yZD09bnVsbHx8cGFzc3dvcmQ9PVwiXCIpPyBwYXNzd29yZDpcIioqKioqXCIpO1xuXG4gICAgbGV0IG1vbml0b3IgPSBuZXcgTW9uaXRvcih0aGlzLmxvYWRlciwgdGhpcy50cmFuc2xhdGUpO1xuICAgIG1vbml0b3Iuc3RhcnRQaW5nQWxpdmUoXCJodHRwczovL2xpbmZhc2VydmljZS5pdFwiKTsgICAgICAgIFxuXG4gICAgaWYodGhpcy5pc1dlbGxDb25maWd1cmVkKGhvc3QsIHVzZXJuYW1lLCBwYXNzd29yZCkpIHRoaXMudXRpbC5uYXZpZ2F0ZShcIlwiKTtcbiAgICBlbHNlIHRoaXMudXRpbC5uYXZpZ2F0ZShcInNldHRpbmdzXCIpO1xuXG5cdC8vIGludG8gdGhlIGNvbnRydWN0b3IgaXQgc2VlbXMgdG8gYmUgdHJpZ2dlcmVkIHR3aWNlXG4gICAgLypcbiAgICBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xuICAgICAgYXBwbGljYXRpb24uYW5kcm9pZC5vbihcbiAgICAgICAgICBBbmRyb2lkQXBwbGljYXRpb24uYWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50LCBcbiAgICAgICAgICAoZGF0YTogQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEpID0+IHtcbiAgICAgICAgICAgICAgZGF0YS5jYW5jZWwgPSB0cnVlOyAvLyBwcmV2ZW50cyBkZWZhdWx0IGJhY2sgYnV0dG9uIGJlaGF2aW9yXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5uYXZpZ2F0ZUJhY2soKTtcbiAgICAgICAgICB9IFxuICAgICAgKTsgICAgICAgXG4gICAgfSAgIFxuICAgICovXG4gIH0gIFxufVxuICJdfQ==