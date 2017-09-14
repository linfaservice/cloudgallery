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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0U7QUFDdEUsZ0NBQStCO0FBQy9CLG9EQUFxRTtBQUNyRSxrREFBbUU7QUFDbkUsZ0ZBQThFO0FBQzlFLHNEQUF1RTtBQUN2RSwwRUFBZ0c7QUFDaEcsd0VBQTRGO0FBQzVGLHFFQUFzRjtBQUN0Rix3RUFBNEY7QUFDNUYsMERBQWdFO0FBRWhFLHVFQUE4RDtBQUM5RCxrRUFBK0U7QUFHL0UsK0VBQTRFO0FBQzVFLDZDQUE4RDtBQUM5RCxzQ0FBcUM7QUFDckMsK0NBQXdGO0FBQ3hGLHNDQUFxQztBQUNyQywwQ0FBcUM7QUFDckMsd0RBQWtEO0FBQ2xELCtDQUFpRDtBQUlqRCwrQkFBc0MsSUFBVTtJQUM1QyxNQUFNLENBQUMsSUFBSSxxQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFGRCxzREFFQztBQTJDRDtJQUNFLG1CQUNFLElBQVMsRUFDRCxNQUFjLEVBQ2QsSUFBVTtRQUVsQjs7OztVQUlFO1FBUE0sV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFNBQUksR0FBSixJQUFJLENBQU07UUFRbEI7Ozs7Ozs7OztVQVNFO0lBQ0osQ0FBQztrQkF0QlUsU0FBUztJQXNCbkIsQ0FBQztJQUVNLG9DQUFnQixHQUF4QixVQUF5QixJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVE7UUFDL0MsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQSxDQUFDLElBQUksSUFBRSxJQUFJLElBQUksSUFBSSxJQUFFLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDeEMsRUFBRSxDQUFBLENBQUMsUUFBUSxJQUFFLElBQUksSUFBSSxRQUFRLElBQUUsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNoRCxFQUFFLENBQUEsQ0FBQyxRQUFRLElBQUUsSUFBSSxJQUFJLFFBQVEsSUFBRSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRWhELG9DQUFvQztRQUNwQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxtQ0FBZSxHQUF0QjtRQUVFLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxJQUFFLElBQUksSUFBRSxRQUFRLElBQUUsRUFBRSxDQUFDLEdBQUUsUUFBUSxHQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVFLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0UsSUFBSTtZQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXZDLHFEQUFxRDtRQUNsRDs7Ozs7Ozs7OztVQVVFO0lBQ0osQ0FBQztJQTNEVSxTQUFTO1FBekNyQixlQUFRLENBQUM7WUFDUixZQUFZO2dCQUNWLFdBQVM7Z0JBQ1QsMkNBQW1CO3FCQUNoQixtQ0FBcUIsQ0FDekI7WUFDRCxlQUFlLEVBQUU7Z0JBQ2YsMkNBQW1CO2FBQ3BCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLHdDQUFrQjtnQkFDbEIsK0JBQXVCO2dCQUN2Qiw2QkFBc0I7Z0JBQ3RCLGlDQUF3QjtnQkFDeEIsaUNBQXdCLENBQUMsT0FBTyxDQUFDLG9CQUFNLENBQUM7Z0JBQ3pDLHdDQUE4QjtnQkFDN0Isc0NBQTRCO2dCQUM1QixtQ0FBeUI7Z0JBQ3pCLHNDQUE0QjtnQkFDNUIsd0JBQWM7Z0JBQ2QsK0JBQXFCO2dCQUNyQiw2Q0FBaUIsQ0FBQyxPQUFPLENBQUM7b0JBQzFCLElBQUksRUFBRSx3QkFBd0I7aUJBRTdCLENBQUM7Z0JBQ0YsK0JBQWUsQ0FBQyxPQUFPLENBQUM7b0JBQ3BCLE9BQU8sRUFBRSwrQkFBZTtvQkFDeEIsVUFBVSxFQUFFLENBQUMscUJBQXFCLENBQUM7b0JBQ25DLElBQUksRUFBRSxDQUFDLFdBQUksQ0FBQztpQkFDZixDQUFDO2FBQ0g7WUFDRCxPQUFPLEVBQUUsQ0FBQyx1QkFBZ0IsQ0FBQztZQUMzQixTQUFTLEVBQUUsQ0FBQyxXQUFTLENBQUM7WUFDdEIsU0FBUyxFQUFFLENBQUMsZ0JBQU0sRUFBRSxXQUFJLEVBQUUsdUJBQVksQ0FBQztTQUN4QyxDQUFDO1FBR0QsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSwyQ0FBMkM7U0FDdEQsQ0FBQzt5Q0FHTyxXQUFJO1lBQ08sZ0JBQU07WUFDUixXQUFJO09BSlQsU0FBUyxDQTREckI7SUFBRCxnQkFBQzs7Q0FBQSxBQTVERCxJQTREQztBQTVEWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIE5PX0VSUk9SU19TQ0hFTUEgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0VUlTaWRlRHJhd2VyTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpLXByby9zaWRlZHJhd2VyL2FuZ3VsYXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFVJTGlzdFZpZXdNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL2xpc3R2aWV3L2FuZ3VsYXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFVJQ2hhcnRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL2NoYXJ0L2FuZ3VsYXJcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdFVJQ2FsZW5kYXJNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL2NhbGVuZGFyL2FuZ3VsYXJcIjtcbmltcG9ydCB7IERyb3BEb3duTW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1kcm9wLWRvd24vYW5ndWxhclwiO1xuaW1wb3J0IHsgc2V0Q3VycmVudE9yaWVudGF0aW9uICwgb3JpZW50YXRpb25DbGVhbnVwIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zY3JlZW4tb3JpZW50YXRpb25cIlxuaW1wb3J0IHsgVE5TRm9udEljb25Nb2R1bGUgfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcbmltcG9ydCB7IE1hc2tlZFRleHRGaWVsZE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtbWFza2VkLXRleHQtZmllbGQvYW5ndWxhclwiO1xuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBBbmRyb2lkQXBwbGljYXRpb24sIEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhIH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBJbWFnZU1vZGFsQ29tcG9uZW50IH0gZnJvbSBcIi4vcGFnZXMvZ2FsbGVyeS9pbWFnZS1tb2RhbC5jb21wb25lbnRcIjtcbmltcG9ydCB7IHJvdXRlcywgbmF2aWdhdGFibGVDb21wb25lbnRzIH0gZnJvbSBcIi4vYXBwLnJvdXRpbmdcIjtcbmltcG9ydCB7IEh0dHAgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlLCBUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZVN0YXRpY0xvYWRlciB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4vY29tbW9uL3V0aWxcIjtcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4vY29tbW9uL2xvYWRlclwiO1xuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi9jb21tb24vZ2FsbGVyeS5jYWNoZVwiO1xuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyB1dGY4IGZyb20gXCJ1dGY4XCI7XG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7IFxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHApIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zbGF0ZVN0YXRpY0xvYWRlcihodHRwLCAnL2kxOG4nLCAnLmpzb24nKTtcbn0gIFxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBcHBNb2R1bGUsXG4gICAgSW1hZ2VNb2RhbENvbXBvbmVudCxcbiAgICAuLi5uYXZpZ2F0YWJsZUNvbXBvbmVudHNcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgSW1hZ2VNb2RhbENvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgTmF0aXZlU2NyaXB0TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEZvcm1zTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyksXG5cdCAgTmF0aXZlU2NyaXB0VUlTaWRlRHJhd2VyTW9kdWxlICxcbiAgICBOYXRpdmVTY3JpcHRVSUxpc3RWaWV3TW9kdWxlLFxuICAgIE5hdGl2ZVNjcmlwdFVJQ2hhcnRNb2R1bGUsXG4gICAgTmF0aXZlU2NyaXB0VUlDYWxlbmRhck1vZHVsZSxcbiAgICBEcm9wRG93bk1vZHVsZSxcbiAgICBNYXNrZWRUZXh0RmllbGRNb2R1bGUsXG4gICAgVE5TRm9udEljb25Nb2R1bGUuZm9yUm9vdCh7XG5cdFx0ICAnZmEnOiAnLi9jc3MvZm9udC1hd2Vzb21lLmNzcycsXG5cdFx0ICAvKiAnaW9uJzogJy4vY3NzL2lvbmljb25zLmNzcycgKi9cbiAgICB9KSxcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XG4gICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXG4gICAgICAgIGRlcHM6IFtIdHRwXVxuICAgIH0pXG4gIF0sXG4gIHNjaGVtYXM6IFtOT19FUlJPUlNfU0NIRU1BXSxcbiAgYm9vdHN0cmFwOiBbQXBwTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbTG9hZGVyLCBVdGlsLCBHYWxsZXJ5Q2FjaGVdICBcbn0pIFxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJtYWluLWFwcFwiLFxuICB0ZW1wbGF0ZTogYDxwYWdlLXJvdXRlci1vdXRsZXQ+PC9wYWdlLXJvdXRlci1vdXRsZXQ+YFxufSkgXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHBhZ2U6UGFnZSxcbiAgICBwcml2YXRlIGxvYWRlcjogTG9hZGVyLFxuICAgIHByaXZhdGUgdXRpbDogVXRpbCwgXG4gICkgIHtcbiAgICAvKlxuICAgIHNldEN1cnJlbnRPcmllbnRhdGlvbihcInBvcnRyYWl0XCIsIGZ1bmN0aW9uKCkgeyAgICAgICAgXG4gICAgICAvL2NvbnNvbGUubG9nKFwiU2V0IHBvcnRyYWl0IG9yaWVudGF0aW9uXCIpOyAgICBcbiAgICB9KTsgIFxuICAgICovICAgICAgXG5cbiAgICAvKiAgICAgIFxuICAgIHBhZ2Uub24oXCJuYXZpZ2F0ZWRUb1wiLGZ1bmN0aW9uKCkge1xuICAgICAgc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG9ydHJhaXRcIixmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJwb3J0cmFpdCBvcmllbnRhdGlvblwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHBhZ2Uub24oXCJuYXZpZ2F0aW5nRnJvbVwiLGZ1bmN0aW9uKCkge1xuICAgICAgb3JpZW50YXRpb25DbGVhbnVwKCk7XG4gICAgfSk7XG4gICAgKi9cbiAgfTsgIFxuICBcbiAgcHJpdmF0ZSBpc1dlbGxDb25maWd1cmVkKGhvc3QsIHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgIGxldCBjb25maWd1cmVkID0gdHJ1ZTtcbiAgICBpZihob3N0PT1udWxsIHx8IGhvc3Q9PVwiXCIpIHJldHVybiBmYWxzZTtcbiAgICBpZih1c2VybmFtZT09bnVsbCB8fCB1c2VybmFtZT09XCJcIikgcmV0dXJuIGZhbHNlO1xuICAgIGlmKHBhc3N3b3JkPT1udWxsIHx8IHBhc3N3b3JkPT1cIlwiKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvL2lmKCFva0xvZ2luKCkpIGNvbmZpZ3VyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gY29uZmlndXJlZDtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG5cbiAgICBsZXQgaG9zdCA9IFNldHRpbmdzLmdldFN0cmluZyhcImhvc3RcIik7XG4gICAgbGV0IHVzZXJuYW1lID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcm5hbWVcIik7XG4gICAgbGV0IHBhc3N3b3JkID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicGFzc3dvcmRcIik7XG5cbiAgICB0aGlzLnV0aWwubG9nKFwiSG9zdFwiLCBob3N0KTtcbiAgICB0aGlzLnV0aWwubG9nKFwiVXNlcm5hbWVcIiwgdXNlcm5hbWUpO1xuICAgIHRoaXMudXRpbC5sb2coXCJQYXNzd29yZFwiLCAocGFzc3dvcmQ9PW51bGx8fHBhc3N3b3JkPT1cIlwiKT8gcGFzc3dvcmQ6XCIqKioqKlwiKTtcblxuICAgIGlmKHRoaXMuaXNXZWxsQ29uZmlndXJlZChob3N0LCB1c2VybmFtZSwgcGFzc3dvcmQpKSB0aGlzLnV0aWwubmF2aWdhdGUoXCJcIik7XG4gICAgZWxzZSB0aGlzLnV0aWwubmF2aWdhdGUoXCJzZXR0aW5nc1wiKTtcblxuXHQvLyBpbnRvIHRoZSBjb250cnVjdG9yIGl0IHNlZW1zIHRvIGJlIHRyaWdnZXJlZCB0d2ljZVxuICAgIC8qXG4gICAgaWYgKGFwcGxpY2F0aW9uLmFuZHJvaWQpIHtcbiAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oXG4gICAgICAgICAgQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgXG4gICAgICAgICAgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGRhdGEuY2FuY2VsID0gdHJ1ZTsgLy8gcHJldmVudHMgZGVmYXVsdCBiYWNrIGJ1dHRvbiBiZWhhdmlvclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubmF2aWdhdGVCYWNrKCk7XG4gICAgICAgICAgfSBcbiAgICAgICk7ICAgICAgIFxuICAgIH0gICBcbiAgICAqL1xuICB9ICBcbn1cbiAiXX0=