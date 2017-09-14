"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var util_1 = require("../../common/util");
var Toast = require("nativescript-toast");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var Settings = require("application-settings");
var util = require("utils/utils");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(page, util, fonticon, translate) {
        this.page = page;
        this.util = util;
        this.fonticon = fonticon;
        this.translate = translate;
        this.util.log("Page Init", "Settings");
        this.language = Platform.device.language;
        this.translate.setDefaultLang("en");
        this.translate.use(Platform.device.language.split("-")[0]);
    }
    SettingsComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
    };
    SettingsComponent.prototype.back = function () {
        this.util.navigateBack();
    };
    SettingsComponent.prototype.isWellConfigured = function () {
        var configured = true;
        if (this.host == null || this.host == "")
            return false;
        if (this.username == null || this.username == "")
            return false;
        if (this.password == null || this.password == "")
            return false;
        //if(!okLogin()) configured = false;
        return configured;
    };
    SettingsComponent.prototype.save = function () {
        this.util.log("check", this.isWellConfigured());
        if (this.isWellConfigured()) {
            Settings.setString("host", this.util.replaceAll(this.host, " ", ""));
            Settings.setString("username", this.util.replaceAll(this.username, " ", ""));
            Settings.setString("password", this.util.replaceAll(this.password, " ", ""));
            Settings.setString("rootdir", (this.rootdir == null) ? "" : this.rootdir.trim());
            this.util.navigate("");
        }
        else {
            Toast.makeText(this.translate.instant("Error connecting. Please check parameters")).show();
        }
    };
    SettingsComponent.prototype.link = function () {
        util.openUrl("https://www.linfaservice.it/cloudgallery");
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: "settings",
            templateUrl: "pages/settings/settings.html",
            styleUrls: ["pages/settings/settings-common.css"],
            providers: [util_1.Util]
        }),
        __metadata("design:paramtypes", [page_1.Page,
            util_1.Util,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            ng2_translate_1.TranslateService])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dGluZ3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsMENBQTRDO0FBQzVDLHVFQUErRDtBQUMvRCwrQ0FBaUQ7QUFDakQsa0NBQW9DO0FBQ3BDLG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFZakQ7SUFVSSwyQkFDVSxJQUFVLEVBQ1gsSUFBVSxFQUNULFFBQTRCLEVBQzVCLFNBQTJCO1FBSDNCLFNBQUksR0FBSixJQUFJLENBQU07UUFDWCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFFbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVPLG9DQUFRLEdBQWhCO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQ25DLENBQUM7SUFFTyxnQ0FBSSxHQUFaO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU8sNENBQWdCLEdBQXhCO1FBQ0UsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUUsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNsRCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFFLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFFLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDMUQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBRSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRTFELG9DQUFvQztRQUNwQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFTyxnQ0FBSSxHQUFaO1FBRUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFFaEQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3RSxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdFLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBRSxJQUFJLENBQUMsR0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzNFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdGLENBQUM7SUFDSCxDQUFDO0lBRU8sZ0NBQUksR0FBWjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBMURRLGlCQUFpQjtRQVI3QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsV0FBVyxFQUFFLDhCQUE4QjtZQUMzQyxTQUFTLEVBQUUsQ0FBQyxvQ0FBb0MsQ0FBQztZQUNqRCxTQUFTLEVBQUUsQ0FBQyxXQUFJLENBQUM7U0FDbEIsQ0FBQzt5Q0Fja0IsV0FBSTtZQUNMLFdBQUk7WUFDQyw4Q0FBa0I7WUFDakIsZ0NBQWdCO09BZDVCLGlCQUFpQixDQTREN0I7SUFBRCx3QkFBQztDQUFBLEFBNURELElBNERDO0FBNURZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0aWxcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCJ1dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgKiBhcyBQbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XHJcblxyXG5cclxuICBcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwic2V0dGluZ3NcIixcclxuICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9zZXR0aW5ncy9zZXR0aW5ncy5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9zZXR0aW5ncy9zZXR0aW5ncy1jb21tb24uY3NzXCJdLFxyXG4gIHByb3ZpZGVyczogW1V0aWxdXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29tcG9uZW50IHtcclxuIFxyXG4gICAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuXHJcbiAgICBwcml2YXRlIGhvc3Q7XHJcbiAgICBwcml2YXRlIHVzZXJuYW1lO1xyXG4gICAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICAgIHByaXZhdGUgcm9vdGRpcjtcclxuICAgIFxyXG4gXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgIHByaXZhdGUgcGFnZTogUGFnZSxcclxuXHQgICAgcHJpdmF0ZSB1dGlsOiBVdGlsLFxyXG4gICAgICBwcml2YXRlIGZvbnRpY29uOiBUTlNGb250SWNvblNlcnZpY2UsXHJcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlXHJcbiAgICApICB7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJQYWdlIEluaXRcIiwgXCJTZXR0aW5nc1wiKTtcclxuXHJcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2U7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKFwiZW5cIik7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnVzZShQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG5nT25Jbml0KCkge1xyXG4gICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcclxuICAgIH0gICAgXHJcbiBcclxuICAgIHByaXZhdGUgYmFjaygpIHtcclxuICAgICAgdGhpcy51dGlsLm5hdmlnYXRlQmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaXNXZWxsQ29uZmlndXJlZCgpIHtcclxuICAgICAgbGV0IGNvbmZpZ3VyZWQgPSB0cnVlO1xyXG4gICAgICBpZih0aGlzLmhvc3Q9PW51bGwgfHwgdGhpcy5ob3N0PT1cIlwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKHRoaXMudXNlcm5hbWU9PW51bGwgfHwgdGhpcy51c2VybmFtZT09XCJcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZih0aGlzLnBhc3N3b3JkPT1udWxsIHx8IHRoaXMucGFzc3dvcmQ9PVwiXCIpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIC8vaWYoIW9rTG9naW4oKSkgY29uZmlndXJlZCA9IGZhbHNlO1xyXG4gICAgICByZXR1cm4gY29uZmlndXJlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNhdmUoKSB7XHJcblxyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiY2hlY2tcIiwgdGhpcy5pc1dlbGxDb25maWd1cmVkKCkpO1xyXG5cclxuICAgICAgaWYodGhpcy5pc1dlbGxDb25maWd1cmVkKCkpIHtcclxuICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJob3N0XCIsIHRoaXMudXRpbC5yZXBsYWNlQWxsKHRoaXMuaG9zdCwgXCIgXCIsIFwiXCIpKTtcclxuICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJ1c2VybmFtZVwiLCB0aGlzLnV0aWwucmVwbGFjZUFsbCh0aGlzLnVzZXJuYW1lLCBcIiBcIiwgXCJcIikpO1xyXG4gICAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInBhc3N3b3JkXCIsIHRoaXMudXRpbC5yZXBsYWNlQWxsKHRoaXMucGFzc3dvcmQsIFwiIFwiLCBcIlwiKSk7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicm9vdGRpclwiLCAodGhpcy5yb290ZGlyPT1udWxsKT9cIlwiOnRoaXMucm9vdGRpci50cmltKCkpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy51dGlsLm5hdmlnYXRlKFwiXCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIHByaXZhdGUgbGluaygpIHtcclxuICAgICAgdXRpbC5vcGVuVXJsKFwiaHR0cHM6Ly93d3cubGluZmFzZXJ2aWNlLml0L2Nsb3VkZ2FsbGVyeVwiKTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19