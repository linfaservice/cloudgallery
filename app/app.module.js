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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsZ0ZBQThFO0FBQzlFLHNEQUF1RTtBQUN2RSwwRUFBZ0c7QUFDaEcsd0VBQTRGO0FBQzVGLHFFQUFzRjtBQUN0Rix3RUFBNEY7QUFDNUYsMERBQWdFO0FBRWhFLHVFQUE4RDtBQUc5RCwrRUFBNEU7QUFDNUUsNkNBQThEO0FBQzlELHNDQUFxQztBQUNyQywrQ0FBd0Y7QUFDeEYsc0NBQXFDO0FBQ3JDLDBDQUFxQztBQUNyQyx3REFBa0Q7QUFDbEQsK0NBQWlEO0FBR2pELDRDQUF1QztBQUN2QywrQ0FBaUQ7QUFFakQsK0JBQXNDLElBQVU7SUFDNUMsTUFBTSxDQUFDLElBQUkscUNBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRkQsc0RBRUM7QUEwQ0Q7SUFDRSxtQkFDRSxJQUFTLEVBQ0QsTUFBYyxFQUNkLElBQVUsRUFDVixTQUEyQjtRQUVuQzs7OztVQUlFO1FBUk0sV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQVFuQzs7Ozs7Ozs7O1VBU0U7SUFDSixDQUFDO2tCQXZCVSxTQUFTO0lBdUJuQixDQUFDO0lBRU0sb0NBQWdCLEdBQXhCLFVBQXlCLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUTtRQUMvQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdEIsRUFBRSxDQUFBLENBQUMsSUFBSSxJQUFFLElBQUksSUFBSSxJQUFJLElBQUUsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QyxFQUFFLENBQUEsQ0FBQyxRQUFRLElBQUUsSUFBSSxJQUFJ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b3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpLXByby9saXN0dmlldy9hbmd1bGFyXCI7XHJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFVJQ2hhcnRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL2NoYXJ0L2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlDYWxlbmRhck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vY2FsZW5kYXIvYW5ndWxhclwiO1xyXG5pbXBvcnQgeyBEcm9wRG93bk1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duL2FuZ3VsYXJcIjtcclxuaW1wb3J0IHsgc2V0Q3VycmVudE9yaWVudGF0aW9uICwgb3JpZW50YXRpb25DbGVhbnVwIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zY3JlZW4tb3JpZW50YXRpb25cIlxyXG5pbXBvcnQgeyBUTlNGb250SWNvbk1vZHVsZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBJbWFnZU1vZGFsQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvZ2FsbGVyeS9pbWFnZS1tb2RhbC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgcm91dGVzLCBuYXZpZ2F0YWJsZUNvbXBvbmVudHMgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xyXG5pbXBvcnQgeyBIdHRwIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlLCBUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZVN0YXRpY0xvYWRlciB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuL2NvbW1vbi9sb2FkZXJcIjtcclxuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi9jb21tb24vZ2FsbGVyeS5jYWNoZVwiO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgdXRmOCBmcm9tIFwidXRmOFwiO1xyXG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7IFxyXG5pbXBvcnQgTW9uaXRvciBmcm9tIFwiLi9jb21tb24vbW9uaXRvclwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cCkge1xyXG4gICAgcmV0dXJuIG5ldyBUcmFuc2xhdGVTdGF0aWNMb2FkZXIoaHR0cCwgJy9pMThuJywgJy5qc29uJyk7XHJcbn0gIFxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEFwcE1vZHVsZSxcclxuICAgIEltYWdlTW9kYWxDb21wb25lbnQsXHJcbiAgICAuLi5uYXZpZ2F0YWJsZUNvbXBvbmVudHNcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gICAgSW1hZ2VNb2RhbENvbXBvbmVudFxyXG4gIF0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxyXG4gICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXHJcbiAgICBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlLFxyXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxyXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzKSxcclxuXHQgIE5hdGl2ZVNjcmlwdFVJU2lkZURyYXdlck1vZHVsZSAsXHJcbiAgICBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlLFxyXG4gICAgTmF0aXZlU2NyaXB0VUlDaGFydE1vZHVsZSxcclxuICAgIE5hdGl2ZVNjcmlwdFVJQ2FsZW5kYXJNb2R1bGUsXHJcbiAgICBEcm9wRG93bk1vZHVsZSxcclxuICAgIFROU0ZvbnRJY29uTW9kdWxlLmZvclJvb3Qoe1xyXG5cdFx0ICAnZmEnOiAnLi9jc3MvZm9udC1hd2Vzb21lLmNzcycsXHJcblx0XHQgIC8qICdpb24nOiAnLi9jc3MvaW9uaWNvbnMuY3NzJyAqL1xyXG4gICAgfSksXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XHJcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxyXG4gICAgICAgIHVzZUZhY3Rvcnk6IChjcmVhdGVUcmFuc2xhdGVMb2FkZXIpLFxyXG4gICAgICAgIGRlcHM6IFtIdHRwXVxyXG4gICAgfSlcclxuICBdLFxyXG4gIHNjaGVtYXM6IFtOT19FUlJPUlNfU0NIRU1BXSxcclxuICBib290c3RyYXA6IFtBcHBNb2R1bGVdLFxyXG4gIHByb3ZpZGVyczogW0xvYWRlciwgVXRpbCwgR2FsbGVyeUNhY2hlXSAgXHJcbn0pIFxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcIm1haW4tYXBwXCIsXHJcbiAgdGVtcGxhdGU6IGA8cGFnZS1yb3V0ZXItb3V0bGV0PjwvcGFnZS1yb3V0ZXItb3V0bGV0PmBcclxufSkgXHJcbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgIHBhZ2U6UGFnZSxcclxuICAgIHByaXZhdGUgbG9hZGVyOiBMb2FkZXIsXHJcbiAgICBwcml2YXRlIHV0aWw6IFV0aWwsIFxyXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgKSAge1xyXG4gICAgLypcclxuICAgIHNldEN1cnJlbnRPcmllbnRhdGlvbihcInBvcnRyYWl0XCIsIGZ1bmN0aW9uKCkgeyAgICAgICAgXHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJTZXQgcG9ydHJhaXQgb3JpZW50YXRpb25cIik7ICAgIFxyXG4gICAgfSk7ICBcclxuICAgICovICAgICAgXHJcblxyXG4gICAgLyogICAgICBcclxuICAgIHBhZ2Uub24oXCJuYXZpZ2F0ZWRUb1wiLGZ1bmN0aW9uKCkge1xyXG4gICAgICBzZXRDdXJyZW50T3JpZW50YXRpb24oXCJwb3J0cmFpdFwiLGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicG9ydHJhaXQgb3JpZW50YXRpb25cIik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBwYWdlLm9uKFwibmF2aWdhdGluZ0Zyb21cIixmdW5jdGlvbigpIHtcclxuICAgICAgb3JpZW50YXRpb25DbGVhbnVwKCk7XHJcbiAgICB9KTtcclxuICAgICovXHJcbiAgfTsgIFxyXG4gIFxyXG4gIHByaXZhdGUgaXNXZWxsQ29uZmlndXJlZChob3N0LCB1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuICAgIGxldCBjb25maWd1cmVkID0gdHJ1ZTtcclxuICAgIGlmKGhvc3Q9PW51bGwgfHwgaG9zdD09XCJcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgaWYodXNlcm5hbWU9PW51bGwgfHwgdXNlcm5hbWU9PVwiXCIpIHJldHVybiBmYWxzZTtcclxuICAgIGlmKHBhc3N3b3JkPT1udWxsIHx8IHBhc3N3b3JkPT1cIlwiKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgLy9pZighb2tMb2dpbigpKSBjb25maWd1cmVkID0gZmFsc2U7XHJcbiAgICByZXR1cm4gY29uZmlndXJlZDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XHJcblxyXG4gICAgbGV0IGhvc3QgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0XCIpO1xyXG4gICAgbGV0IHVzZXJuYW1lID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcm5hbWVcIik7XHJcbiAgICBsZXQgcGFzc3dvcmQgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJwYXNzd29yZFwiKTtcclxuXHJcbiAgICB0aGlzLnV0aWwubG9nKFwiSG9zdFwiLCBob3N0KTtcclxuICAgIHRoaXMudXRpbC5sb2coXCJVc2VybmFtZVwiLCB1c2VybmFtZSk7XHJcbiAgICB0aGlzLnV0aWwubG9nKFwiUGFzc3dvcmRcIiwgKHBhc3N3b3JkPT1udWxsfHxwYXNzd29yZD09XCJcIik/IHBhc3N3b3JkOlwiKioqKipcIik7XHJcblxyXG4gICAgbGV0IG1vbml0b3IgPSBuZXcgTW9uaXRvcih0aGlzLmxvYWRlciwgdGhpcy50cmFuc2xhdGUpO1xyXG4gICAgbW9uaXRvci5zdGFydFBpbmdBbGl2ZShcImh0dHBzOi8vd3d3LmxpbmZhc2VydmljZS5pdFwiKTsgICAgICAgIFxyXG5cclxuICAgIGlmKHRoaXMuaXNXZWxsQ29uZmlndXJlZChob3N0LCB1c2VybmFtZSwgcGFzc3dvcmQpKSB0aGlzLnV0aWwubmF2aWdhdGUoXCJcIik7XHJcbiAgICBlbHNlIHRoaXMudXRpbC5uYXZpZ2F0ZShcInNldHRpbmdzXCIpO1xyXG5cclxuXHQvLyBpbnRvIHRoZSBjb250cnVjdG9yIGl0IHNlZW1zIHRvIGJlIHRyaWdnZXJlZCB0d2ljZVxyXG4gICAgLypcclxuICAgIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XHJcbiAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oXHJcbiAgICAgICAgICBBbmRyb2lkQXBwbGljYXRpb24uYWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50LCBcclxuICAgICAgICAgIChkYXRhOiBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgIGRhdGEuY2FuY2VsID0gdHJ1ZTsgLy8gcHJldmVudHMgZGVmYXVsdCBiYWNrIGJ1dHRvbiBiZWhhdmlvclxyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5uYXZpZ2F0ZUJhY2soKTtcclxuICAgICAgICAgIH0gXHJcbiAgICAgICk7ICAgICAgIFxyXG4gICAgfSAgIFxyXG4gICAgKi9cclxuICB9ICBcclxufVxyXG4gIl19