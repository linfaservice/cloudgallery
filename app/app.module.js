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
function createTranslateLoader(http) {
    return new ng2_translate_1.TranslateStaticLoader(http, '/i18n', '.json');
}
exports.createTranslateLoader = createTranslateLoader;
var AppModule = /** @class */ (function () {
    function AppModule(page, loader, util) {
        /*
        setCurrentOrientation("portrait", function() {
          //console.log("Set portrait orientation");
        });
        */
        this.loader = loader;
        this.util = util;
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
        var monitor = new monitor_1.default(new loader_1.default());
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
            util_1.Util])
    ], AppModule);
    return AppModule;
    var AppModule_1;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsZ0ZBQThFO0FBQzlFLHNEQUF1RTtBQUN2RSwwRUFBZ0c7QUFDaEcsd0VBQTRGO0FBQzVGLHFFQUFzRjtBQUN0Rix3RUFBNEY7QUFDNUYsMERBQWdFO0FBRWhFLHVFQUE4RDtBQUM5RCxrRUFBK0U7QUFHL0UsK0VBQTRFO0FBQzVFLDZDQUE4RDtBQUM5RCxzQ0FBcUM7QUFDckMsK0NBQXdGO0FBQ3hGLHNDQUFxQztBQUNyQywwQ0FBcUM7QUFDckMsd0RBQWtEO0FBQ2xELCtDQUFpRDtBQUdqRCw0Q0FBdUM7QUFFdkMsK0JBQXNDLElBQVU7SUFDNUMsTUFBTSxDQUFDLElBQUkscUNBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRkQsc0RBRUM7QUEyQ0Q7SUFDRSxtQkFDRSxJQUFTLEVBQ0QsTUFBYyxFQUNkLElBQVU7UUFFbEI7Ozs7VUFJRTtRQVBNLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBUWxCOzs7Ozs7Ozs7VUFTRTtJQUNKLENBQUM7a0JBdEJVLFNBQVM7SUFzQm5CLENBQUM7SUFFTSxvQ0FBZ0IsR0FBeEIsVUFBeUIsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRO1FBQy9DLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztRQUN0QixFQUFFLENBQUEsQ0FBQyxJQUFJLElBQUUsSUFBSSxJQUFJLElBQUksSUFBRSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQSxDQUFDLFFBQVEsSUFBRSxJQUFJLElBQUksUUFBUSxJQUFFLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDaEQsRUFBRSxDQUFBLENBQUMsUUFBUSxJQUFFLElBQUksSUFBSSxRQUFRLElBQUUsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUVoRCxvQ0FBb0M7UUFDcEMsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRU0sbUNBQWUsR0FBdEI7UUFFRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU5QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsSUFBRSxJQUFJLElBQUUsUUFBUSxJQUFFLEVBQUUsQ0FBQyxHQUFFLFFBQVEsR0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1RSxJQUFJLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsSUFBSSxnQkFBTSxFQUFFLENBQUMsQ0FBQztRQUN4QyxPQUFPLENBQUMsY0FBYyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFFdEQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzRSxJQUFJO1lBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdkMscURBQXFEO1FBQ2xEOzs7Ozs7Ozs7O1VBVUU7SUFDSixDQUFDO0lBOURVLFNBQVM7UUF6Q3JCLGVBQVEsQ0FBQztZQUNSLFlBQVk7Z0JBQ1YsV0FBUztnQkFDVCwyQ0FBbUI7cUJBQ2hCLG1DQUFxQixDQUN6QjtZQUNELGVBQWUsRUFBRTtnQkFDZiwyQ0FBbUI7YUFDcEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1Asd0NBQWtCO2dCQUNsQiwrQkFBdUI7Z0JBQ3ZCLDZCQUFzQjtnQkFDdEIsaUNBQXdCO2dCQUN4QixpQ0FBd0IsQ0FBQyxPQUFPLENBQUMsb0JBQU0sQ0FBQztnQkFDekMsd0NBQThCO2dCQUM3QixzQ0FBNEI7Z0JBQzVCLG1DQUF5QjtnQkFDekIsc0NBQTRCO2dCQUM1Qix3QkFBYztnQkFDZCwrQkFBcUI7Z0JBQ3JCLDZDQUFpQixDQUFDLE9BQU8sQ0FBQztvQkFDMUIsSUFBSSxFQUFFLHdCQUF3QjtpQkFFN0IsQ0FBQztnQkFDRiwrQkFBZSxDQUFDLE9BQU8sQ0FBQztvQkFDcEIsT0FBTyxFQUFFLCtCQUFlO29CQUN4QixVQUFVLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDbkMsSUFBSSxFQUFFLENBQUMsV0FBSSxDQUFDO2lCQUNmLENBQUM7YUFDSDtZQUNELE9BQU8sRUFBRSxDQUFDLHVCQUFnQixDQUFDO1lBQzNCLFNBQVMsRUFBRSxDQUFDLFdBQVMsQ0FBQztZQUN0QixTQUFTLEVBQUUsQ0FBQyxnQkFBTSxFQUFFLFdBQUksRUFBRSx1QkFBWSxDQUFDO1NBQ3hDLENBQUM7UUFHRCxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLDJDQUEyQztTQUN0RCxDQUFDO3lDQUdPLFdBQUk7WUFDTyxnQkFBTTtZQUNSLFdBQUk7T0FKVCxTQUFTLENBK0RyQjtJQUFELGdCQUFDOztDQUFBLEFBL0RELElBK0RDO0FBL0RZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRVSVNpZGVEcmF3ZXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlMaXN0Vmlld01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vbGlzdHZpZXcvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlDaGFydE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vY2hhcnQvYW5ndWxhclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlDYWxlbmRhck1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vY2FsZW5kYXIvYW5ndWxhclwiO1xuaW1wb3J0IHsgRHJvcERvd25Nb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWRyb3AtZG93bi9hbmd1bGFyXCI7XG5pbXBvcnQgeyBzZXRDdXJyZW50T3JpZW50YXRpb24gLCBvcmllbnRhdGlvbkNsZWFudXAgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXNjcmVlbi1vcmllbnRhdGlvblwiXG5pbXBvcnQgeyBUTlNGb250SWNvbk1vZHVsZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xuaW1wb3J0IHsgTWFza2VkVGV4dEZpZWxkTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1tYXNrZWQtdGV4dC1maWVsZC9hbmd1bGFyXCI7XG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IEFuZHJvaWRBcHBsaWNhdGlvbiwgQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IEltYWdlTW9kYWxDb21wb25lbnQgfSBmcm9tIFwiLi9wYWdlcy9nYWxsZXJ5L2ltYWdlLW1vZGFsLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgcm91dGVzLCBuYXZpZ2F0YWJsZUNvbXBvbmVudHMgfSBmcm9tIFwiLi9hcHAucm91dGluZ1wiO1xuaW1wb3J0IHsgSHR0cCB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUsIFRyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlU3RhdGljTG9hZGVyIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi9jb21tb24vdXRpbFwiO1xuaW1wb3J0IExvYWRlciBmcm9tIFwiLi9jb21tb24vbG9hZGVyXCI7XG5pbXBvcnQgR2FsbGVyeUNhY2hlIGZyb20gXCIuL2NvbW1vbi9nYWxsZXJ5LmNhY2hlXCI7XG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCAqIGFzIHV0ZjggZnJvbSBcInV0ZjhcIjtcbmltcG9ydCAqIGFzICBCYXNlNjQgZnJvbSBcImJhc2UtNjRcIjsgXG5pbXBvcnQgTW9uaXRvciBmcm9tIFwiLi9jb21tb24vbW9uaXRvclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHApIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zbGF0ZVN0YXRpY0xvYWRlcihodHRwLCAnL2kxOG4nLCAnLmpzb24nKTtcbn0gIFxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBcHBNb2R1bGUsXG4gICAgSW1hZ2VNb2RhbENvbXBvbmVudCxcbiAgICAuLi5uYXZpZ2F0YWJsZUNvbXBvbmVudHNcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgSW1hZ2VNb2RhbENvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyksXG5cdCAgTmF0aXZlU2NyaXB0VUlTaWRlRHJhd2VyTW9kdWxlICxcbiAgICBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFVJQ2hhcnRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0VUlDYWxlbmRhck1vZHVsZSxcbiAgICBEcm9wRG93bk1vZHVsZSxcbiAgICBNYXNrZWRUZXh0RmllbGRNb2R1bGUsXG4gICAgVE5TRm9udEljb25Nb2R1bGUuZm9yUm9vdCh7XG5cdFx0ICAnZmEnOiAnLi9jc3MvZm9udC1hd2Vzb21lLmNzcycsXG5cdFx0ICAvKiAnaW9uJzogJy4vY3NzL2lvbmljb25zLmNzcycgKi9cbiAgICB9KSxcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XG4gICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXG4gICAgICAgIGRlcHM6IFtIdHRwXVxuICAgIH0pXG4gIF0sXG4gIHNjaGVtYXM6IFtOT19FUlJPUlNfU0NIRU1BXSxcbiAgYm9vdHN0cmFwOiBbQXBwTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbTG9hZGVyLCBVdGlsLCBHYWxsZXJ5Q2FjaGVdICBcbn0pIFxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJtYWluLWFwcFwiLFxuICB0ZW1wbGF0ZTogYDxwYWdlLXJvdXRlci1vdXRsZXQ+PC9wYWdlLXJvdXRlci1vdXRsZXQ+YFxufSkgXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHBhZ2U6UGFnZSxcbiAgICBwcml2YXRlIGxvYWRlcjogTG9hZGVyLFxuICAgIHByaXZhdGUgdXRpbDogVXRpbCwgXG4gICkgIHtcbiAgICAvKlxuICAgIHNldEN1cnJlbnRPcmllbnRhdGlvbihcInBvcnRyYWl0XCIsIGZ1bmN0aW9uKCkgeyAgICAgICAgXG4gICAgICAvL2NvbnNvbGUubG9nKFwiU2V0IHBvcnRyYWl0IG9yaWVudGF0aW9uXCIpOyAgICBcbiAgICB9KTsgIFxuICAgICovICAgICAgXG5cbiAgICAvKiAgICAgIFxuICAgIHBhZ2Uub24oXCJuYXZpZ2F0ZWRUb1wiLGZ1bmN0aW9uKCkge1xuICAgICAgc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG9ydHJhaXRcIixmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJwb3J0cmFpdCBvcmllbnRhdGlvblwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHBhZ2Uub24oXCJuYXZpZ2F0aW5nRnJvbVwiLGZ1bmN0aW9uKCkge1xuICAgICAgb3JpZW50YXRpb25DbGVhbnVwKCk7XG4gICAgfSk7XG4gICAgKi9cbiAgfTsgIFxuICBcbiAgcHJpdmF0ZSBpc1dlbGxDb25maWd1cmVkKGhvc3QsIHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgIGxldCBjb25maWd1cmVkID0gdHJ1ZTtcbiAgICBpZihob3N0PT1udWxsIHx8IGhvc3Q9PVwiXCIpIHJldHVybiBmYWxzZTtcbiAgICBpZih1c2VybmFtZT09bnVsbCB8fCB1c2VybmFtZT09XCJcIikgcmV0dXJuIGZhbHNlO1xuICAgIGlmKHBhc3N3b3JkPT1udWxsIHx8IHBhc3N3b3JkPT1cIlwiKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvL2lmKCFva0xvZ2luKCkpIGNvbmZpZ3VyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gY29uZmlndXJlZDtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG5cbiAgICBsZXQgaG9zdCA9IFNldHRpbmdzLmdldFN0cmluZyhcImhvc3RcIik7XG4gICAgbGV0IHVzZXJuYW1lID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcm5hbWVcIik7XG4gICAgbGV0IHBhc3N3b3JkID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicGFzc3dvcmRcIik7XG5cbiAgICB0aGlzLnV0aWwubG9nKFwiSG9zdFwiLCBob3N0KTtcbiAgICB0aGlzLnV0aWwubG9nKFwiVXNlcm5hbWVcIiwgdXNlcm5hbWUpO1xuICAgIHRoaXMudXRpbC5sb2coXCJQYXNzd29yZFwiLCAocGFzc3dvcmQ9PW51bGx8fHBhc3N3b3JkPT1cIlwiKT8gcGFzc3dvcmQ6XCIqKioqKlwiKTtcblxuICAgIGxldCBtb25pdG9yID0gbmV3IE1vbml0b3IobmV3IExvYWRlcigpKTtcbiAgICBtb25pdG9yLnN0YXJ0UGluZ0FsaXZlKFwiaHR0cHM6Ly93d3cubGluZmFzZXJ2aWNlLml0XCIpOyAgICAgICAgXG5cbiAgICBpZih0aGlzLmlzV2VsbENvbmZpZ3VyZWQoaG9zdCwgdXNlcm5hbWUsIHBhc3N3b3JkKSkgdGhpcy51dGlsLm5hdmlnYXRlKFwiXCIpO1xuICAgIGVsc2UgdGhpcy51dGlsLm5hdmlnYXRlKFwic2V0dGluZ3NcIik7XG5cblx0Ly8gaW50byB0aGUgY29udHJ1Y3RvciBpdCBzZWVtcyB0byBiZSB0cmlnZ2VyZWQgdHdpY2VcbiAgICAvKlxuICAgIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XG4gICAgICBhcHBsaWNhdGlvbi5hbmRyb2lkLm9uKFxuICAgICAgICAgIEFuZHJvaWRBcHBsaWNhdGlvbi5hY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnQsIFxuICAgICAgICAgIChkYXRhOiBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSkgPT4ge1xuICAgICAgICAgICAgICBkYXRhLmNhbmNlbCA9IHRydWU7IC8vIHByZXZlbnRzIGRlZmF1bHQgYmFjayBidXR0b24gYmVoYXZpb3JcbiAgICAgICAgICAgICAgdGhpcy51dGlsLm5hdmlnYXRlQmFjaygpO1xuICAgICAgICAgIH0gXG4gICAgICApOyAgICAgICBcbiAgICB9ICAgXG4gICAgKi9cbiAgfSAgXG59XG4gIl19