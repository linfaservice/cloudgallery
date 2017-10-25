"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("application");
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var util_1 = require("../../common/util");
var Toast = require("nativescript-toast");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var Settings = require("application-settings");
var util = require("utils/utils");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var Http = require("tns-core-modules/http");
var Base64 = require("base-64");
var loader_1 = require("../../common/loader");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(page, util, fonticon, translate) {
        this.page = page;
        this.util = util;
        this.fonticon = fonticon;
        this.translate = translate;
        this.loader = new loader_1.default();
        this.util.log("Page Init", "Settings");
        this.language = Platform.device.language;
        this.translate.setDefaultLang("en");
        this.translate.use(Platform.device.language.split("-")[0]);
    }
    SettingsComponent.prototype.ngOnInit = function () {
        if (application.ios) {
            this.isAndroid = false;
            this.isIos = true;
        }
        else if (application.android) {
            this.isAndroid = true;
            this.isIos = false;
        }
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
        if (!this.host.startsWith("https://")) {
            Toast.makeText(this.translate.instant("Nextcloud address must start with https://")).show();
            return false;
        }
        //if(!okLogin()) configured = false;
        return configured;
    };
    SettingsComponent.prototype.save = function () {
        var _this = this;
        if (this.isWellConfigured()) {
            Settings.setString("host", this.util.replaceAll(this.host, " ", ""));
            Settings.setString("username", this.util.replaceAll(this.username, " ", ""));
            Settings.setString("password", this.util.replaceAll(this.password, " ", ""));
            Settings.setString("rootdir", (this.rootdir == null) ? "" : this.rootdir.trim());
            this.tryConnection(this.host, this.username, this.password, function () {
                _this.loader.hideLoader();
                _this.util.navigate("");
            });
        }
        else {
            Toast.makeText(this.translate.instant("Error connecting. Please check parameters")).show();
        }
    };
    SettingsComponent.prototype.link = function () {
        this.util.log("Open link for language: ", this.translate.currentLang);
        var link = "https://www.operweb.com/nextcloud-gallery-en/";
        if (this.translate.currentLang == "it")
            link = "https://www.operweb.com/nextcloud-gallery/";
        util.openUrl(link);
        this.util.log("Link", link);
    };
    SettingsComponent.prototype.tryConnection = function (host, username, password, callOk) {
        var _this = this;
        this.loader.showLoader(this.translate.instant("Checking connection…"));
        var url = host + "/index.php/apps/gallery/api/files/list?location=&mediatypes=image/jpeg;&features=&etag";
        var headers = {
            "OCS-APIREQUEST": "true",
            "Authorization": "Basic " + Base64.encode(username + ':' + password)
        };
        Http.request({
            url: url,
            method: "GET",
            headers: headers
        }).then(function (response) {
            var data = null;
            try {
                data = response.content.toJSON();
            }
            catch (e) {
                Toast.makeText(_this.translate.instant("Error connecting. Please check parameters")).show();
                _this.util.log("Error", e);
                _this.loader.hideLoader();
                return;
            }
            if (data == null) {
                Toast.makeText(_this.translate.instant("Error connecting. Please check parameters")).show();
                _this.util.log("Error Data null", null);
                _this.loader.hideLoader();
                return;
            }
            console.log(data);
            var albums = data.albums;
            // error loading
            if (albums == null) {
                Toast.makeText(_this.translate.instant("Error connecting. Please check parameters")).show();
                _this.loader.hideLoader();
                return;
            }
            callOk();
        }, function (e) {
            Toast.makeText(_this.translate.instant("Error connecting. Please check parameters")).show();
            _this.util.log("Error", e);
            _this.loader.hideLoader();
            return;
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dGluZ3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQTJDO0FBQzNDLGdDQUErQjtBQUMvQixzQ0FBa0Q7QUFDbEQsMENBQXlDO0FBQ3pDLDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsK0NBQWlEO0FBQ2pELGtDQUFvQztBQUNwQyxtQ0FBcUM7QUFDckMsK0NBQWlEO0FBQ2pELDRDQUE2QztBQUM3QyxnQ0FBbUM7QUFDbkMsOENBQXlDO0FBV3pDO0lBY0ksMkJBQ1UsSUFBVSxFQUNYLElBQVUsRUFDVCxRQUE0QixFQUM1QixTQUEyQjtRQUgzQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1gsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNULGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBTjdCLFdBQU0sR0FBRyxJQUFJLGdCQUFNLEVBQUUsQ0FBQztRQVE1QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8sb0NBQVEsR0FBaEI7UUFDRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsS0FBSyxH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O1FBRVgsQ0FBQyxFQUFFLFVBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzNGLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixLQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pCLE1BQU0sQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXRJUSxpQkFBaUI7UUFSN0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsU0FBUyxFQUFFLENBQUMsb0NBQW9DLENBQUM7WUFDakQsU0FBUyxFQUFFLENBQUMsV0FBSSxDQUFDO1NBQ2xCLENBQUM7eUNBa0JrQixXQUFJO1lBQ0wsV0FBSTtZQUNDLDhDQUFrQjtZQUNqQixnQ0FBZ0I7T0FsQjVCLGlCQUFpQixDQXVJN0I7SUFBRCx3QkFBQztDQUFBLEFBdklELElBdUlDO0FBdklZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwidXRpbHMvdXRpbHNcIjtcclxuaW1wb3J0ICogYXMgUGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgKiBhcyBIdHRwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIlxyXG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7XHJcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9sb2FkZXJcIjtcclxuXHJcbiAgXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcInNldHRpbmdzXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvc2V0dGluZ3Mvc2V0dGluZ3MtY29tbW9uLmNzc1wiXSxcclxuICBwcm92aWRlcnM6IFtVdGlsXVxyXG59KVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc0NvbXBvbmVudCB7XHJcbiBcclxuICAgIHB1YmxpYyBpc0FuZHJvaWQ6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaXNJb3M6IGJvb2xlYW47XHJcblxyXG4gICAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuXHJcbiAgICBwcml2YXRlIGhvc3Q7XHJcbiAgICBwcml2YXRlIHVzZXJuYW1lO1xyXG4gICAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICAgIHByaXZhdGUgcm9vdGRpcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XHJcbiBcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG5cdCAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2VcclxuICAgICkgIHtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlBhZ2UgSW5pdFwiLCBcIlNldHRpbmdzXCIpO1xyXG5cclxuICAgICAgdGhpcy5sYW5ndWFnZSA9IFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoXCJlblwiKTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUudXNlKFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZS5zcGxpdChcIi1cIilbMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbmdPbkluaXQoKSB7XHJcbiAgICAgIGlmIChhcHBsaWNhdGlvbi5pb3MpIHtcclxuICAgICAgICB0aGlzLmlzQW5kcm9pZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNJb3MgPSB0cnVlO1xyXG4gICAgICB9IGVsc2UgaWYgKGFwcGxpY2F0aW9uLmFuZHJvaWQpIHtcclxuICAgICAgICAgIHRoaXMuaXNBbmRyb2lkID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaXNJb3MgPSBmYWxzZTtcclxuICAgICAgfSAgICAgIFxyXG4gICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcclxuICAgIH0gICAgXHJcbiBcclxuICAgIHByaXZhdGUgYmFjaygpIHtcclxuICAgICAgdGhpcy51dGlsLm5hdmlnYXRlQmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaXNXZWxsQ29uZmlndXJlZCgpIHtcclxuICAgICAgbGV0IGNvbmZpZ3VyZWQgPSB0cnVlO1xyXG4gICAgICBpZih0aGlzLmhvc3Q9PW51bGwgfHwgdGhpcy5ob3N0PT1cIlwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKHRoaXMudXNlcm5hbWU9PW51bGwgfHwgdGhpcy51c2VybmFtZT09XCJcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZih0aGlzLnBhc3N3b3JkPT1udWxsIHx8IHRoaXMucGFzc3dvcmQ9PVwiXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgaWYoIXRoaXMuaG9zdC5zdGFydHNXaXRoKFwiaHR0cHM6Ly9cIikpIHtcclxuICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTmV4dGNsb3VkIGFkZHJlc3MgbXVzdCBzdGFydCB3aXRoIGh0dHBzOi8vXCIpKS5zaG93KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL2lmKCFva0xvZ2luKCkpIGNvbmZpZ3VyZWQgPSBmYWxzZTtcclxuICAgICAgcmV0dXJuIGNvbmZpZ3VyZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzYXZlKCkge1xyXG5cclxuICAgICAgaWYodGhpcy5pc1dlbGxDb25maWd1cmVkKCkpIHtcclxuICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJob3N0XCIsIHRoaXMudXRpbC5yZXBsYWNlQWxsKHRoaXMuaG9zdCwgXCIgXCIsIFwiXCIpKTtcclxuICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJ1c2VybmFtZVwiLCB0aGlzLnV0aWwucmVwbGFjZUFsbCh0aGlzLnVzZXJuYW1lLCBcIiBcIiwgXCJcIikpO1xyXG4gICAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInBhc3N3b3JkXCIsIHRoaXMudXRpbC5yZXBsYWNlQWxsKHRoaXMucGFzc3dvcmQsIFwiIFwiLCBcIlwiKSk7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicm9vdGRpclwiLCAodGhpcy5yb290ZGlyPT1udWxsKT9cIlwiOnRoaXMucm9vdGRpci50cmltKCkpOyBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRyeUNvbm5lY3Rpb24odGhpcy5ob3N0LCB0aGlzLnVzZXJuYW1lLCB0aGlzLnBhc3N3b3JkLCAoKT0+IHtcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgIHRoaXMudXRpbC5uYXZpZ2F0ZShcIlwiKTsgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIHByaXZhdGUgbGluaygpIHtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIk9wZW4gbGluayBmb3IgbGFuZ3VhZ2U6IFwiLCB0aGlzLnRyYW5zbGF0ZS5jdXJyZW50TGFuZyk7XHJcbiAgICAgIGxldCBsaW5rID0gXCJodHRwczovL3d3dy5vcGVyd2ViLmNvbS9uZXh0Y2xvdWQtZ2FsbGVyeS1lbi9cIjtcclxuICAgICAgaWYodGhpcy50cmFuc2xhdGUuY3VycmVudExhbmc9PVwiaXRcIikgbGluayA9IFwiaHR0cHM6Ly93d3cub3BlcndlYi5jb20vbmV4dGNsb3VkLWdhbGxlcnkvXCI7XHJcbiAgICAgIHV0aWwub3BlblVybChsaW5rKTtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkxpbmtcIiwgbGluayk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdHJ5Q29ubmVjdGlvbihob3N0LCB1c2VybmFtZSwgcGFzc3dvcmQsIGNhbGxPaykge1xyXG5cclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiQ2hlY2tpbmcgY29ubmVjdGlvbuKAplwiKSk7XHJcblxyXG4gICAgICBsZXQgdXJsID0gaG9zdCtcIi9pbmRleC5waHAvYXBwcy9nYWxsZXJ5L2FwaS9maWxlcy9saXN0P2xvY2F0aW9uPSZtZWRpYXR5cGVzPWltYWdlL2pwZWc7JmZlYXR1cmVzPSZldGFnXCI7XHJcbiAgICAgIGxldCBoZWFkZXJzID0geyBcclxuICAgICAgICBcIk9DUy1BUElSRVFVRVNUXCI6IFwidHJ1ZVwiLFxyXG4gICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJhc2ljIFwiK0Jhc2U2NC5lbmNvZGUodXNlcm5hbWUrJzonK3Bhc3N3b3JkKVxyXG4gICAgICB9IFxyXG5cclxuICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICB9KS50aGVuKChyZXNwb25zZTphbnkpPT4ge1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRyeSB7ICAgXHJcbiAgICAgICAgICBkYXRhID0gcmVzcG9uc2UuY29udGVudC50b0pTT04oKTtcclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yXCIsIGUpO1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgcmV0dXJuOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGRhdGE9PW51bGwpIHtcclxuICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yIERhdGEgbnVsbFwiLCBudWxsKTtcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgIHJldHVybjsgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGxldCBhbGJ1bXMgPSBkYXRhLmFsYnVtczsgIFxyXG4gICAgICAgIC8vIGVycm9yIGxvYWRpbmdcclxuICAgICAgICBpZihhbGJ1bXM9PW51bGwpIHtcclxuICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGNhbGxPaygpO1xyXG5cclxuICAgICAgfSwgKGUpPT4ge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvclwiLCBlKTtcclxuICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9KTsgICAgICAgXHJcbiAgICB9XHJcbn1cclxuIl19