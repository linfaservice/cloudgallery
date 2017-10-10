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
        util.openUrl("https://www.operweb.com/nextcloud-gallery/");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dGluZ3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsMENBQTRDO0FBQzVDLHVFQUErRDtBQUMvRCwrQ0FBaUQ7QUFDakQsa0NBQW9DO0FBQ3BDLG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsNENBQTZDO0FBQzdDLGdDQUFtQztBQUNuQyw4Q0FBeUM7QUFZekM7SUFXSSwyQkFDVSxJQUFVLEVBQ1gsSUFBVSxFQUNULFFBQTRCLEVBQzVCLFNBQTJCO1FBSDNCLFNBQUksR0FBSixJQUFJLENBQU07UUFDWCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFON0IsV0FBTSxHQUFHLElBQUksZ0JBQU0sRUFBRSxDQUFDO1FBUTVCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyxvQ0FBUSxHQUFoQjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRU8sZ0NBQUksR0FBWjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FB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YWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwidXRpbHMvdXRpbHNcIjtcclxuaW1wb3J0ICogYXMgUGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgKiBhcyBIdHRwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIlxyXG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7XHJcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9sb2FkZXJcIjtcclxuXHJcblxyXG4gIFxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJzZXR0aW5nc1wiLFxyXG4gIHRlbXBsYXRlVXJsOiBcInBhZ2VzL3NldHRpbmdzL3NldHRpbmdzLmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcInBhZ2VzL3NldHRpbmdzL3NldHRpbmdzLWNvbW1vbi5jc3NcIl0sXHJcbiAgcHJvdmlkZXJzOiBbVXRpbF1cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDb21wb25lbnQge1xyXG4gXHJcbiAgICBwcml2YXRlIGxhbmd1YWdlO1xyXG5cclxuICAgIHByaXZhdGUgaG9zdDtcclxuICAgIHByaXZhdGUgdXNlcm5hbWU7XHJcbiAgICBwcml2YXRlIHBhc3N3b3JkO1xyXG4gICAgcHJpdmF0ZSByb290ZGlyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuIFxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXHJcblx0ICAgIHByaXZhdGUgdXRpbDogVXRpbCxcclxuICAgICAgcHJpdmF0ZSBmb250aWNvbjogVE5TRm9udEljb25TZXJ2aWNlLFxyXG4gICAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZVxyXG4gICAgKSAge1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiUGFnZSBJbml0XCIsIFwiU2V0dGluZ3NcIik7XHJcblxyXG4gICAgICB0aGlzLmxhbmd1YWdlID0gUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZyhcImVuXCIpO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0ZS51c2UoUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlLnNwbGl0KFwiLVwiKVswXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBuZ09uSW5pdCgpIHtcclxuICAgICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IHRydWU7XHJcbiAgICB9ICAgIFxyXG4gXHJcbiAgICBwcml2YXRlIGJhY2soKSB7XHJcbiAgICAgIHRoaXMudXRpbC5uYXZpZ2F0ZUJhY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlzV2VsbENvbmZpZ3VyZWQoKSB7XHJcbiAgICAgIGxldCBjb25maWd1cmVkID0gdHJ1ZTtcclxuICAgICAgaWYodGhpcy5ob3N0PT1udWxsIHx8IHRoaXMuaG9zdD09XCJcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZih0aGlzLnVzZXJuYW1lPT1udWxsIHx8IHRoaXMudXNlcm5hbWU9PVwiXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgaWYodGhpcy5wYXNzd29yZD09bnVsbCB8fCB0aGlzLnBhc3N3b3JkPT1cIlwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKCF0aGlzLmhvc3Quc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSB7XHJcbiAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIk5leHRjbG91ZCBhZGRyZXNzIG11c3Qgc3RhcnQgd2l0aCBodHRwczovL1wiKSkuc2hvdygpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9pZighb2tMb2dpbigpKSBjb25maWd1cmVkID0gZmFsc2U7XHJcbiAgICAgIHJldHVybiBjb25maWd1cmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2F2ZSgpIHtcclxuXHJcbiAgICAgIGlmKHRoaXMuaXNXZWxsQ29uZmlndXJlZCgpKSB7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwiaG9zdFwiLCB0aGlzLnV0aWwucmVwbGFjZUFsbCh0aGlzLmhvc3QsIFwiIFwiLCBcIlwiKSk7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwidXNlcm5hbWVcIiwgdGhpcy51dGlsLnJlcGxhY2VBbGwodGhpcy51c2VybmFtZSwgXCIgXCIsIFwiXCIpKTtcclxuICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJwYXNzd29yZFwiLCB0aGlzLnV0aWwucmVwbGFjZUFsbCh0aGlzLnBhc3N3b3JkLCBcIiBcIiwgXCJcIikpO1xyXG4gICAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInJvb3RkaXJcIiwgKHRoaXMucm9vdGRpcj09bnVsbCk/XCJcIjp0aGlzLnJvb3RkaXIudHJpbSgpKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50cnlDb25uZWN0aW9uKHRoaXMuaG9zdCwgdGhpcy51c2VybmFtZSwgdGhpcy5wYXNzd29yZCwgKCk9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICB0aGlzLnV0aWwubmF2aWdhdGUoXCJcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIHByaXZhdGUgbGluaygpIHtcclxuICAgICAgdXRpbC5vcGVuVXJsKFwiaHR0cHM6Ly93d3cub3BlcndlYi5jb20vbmV4dGNsb3VkLWdhbGxlcnkvXCIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHRyeUNvbm5lY3Rpb24oaG9zdCwgdXNlcm5hbWUsIHBhc3N3b3JkLCBjYWxsT2spIHtcclxuXHJcbiAgICAgIHRoaXMubG9hZGVyLnNob3dMb2FkZXIodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkNoZWNraW5nIGNvbm5lY3Rpb27igKZcIikpO1xyXG5cclxuICAgICAgbGV0IHVybCA9IGhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvZmlsZXMvbGlzdD9sb2NhdGlvbj0mbWVkaWF0eXBlcz1pbWFnZS9qcGVnOyZmZWF0dXJlcz0mZXRhZ1wiO1xyXG4gICAgICBsZXQgaGVhZGVycyA9IHsgXHJcbiAgICAgICAgXCJPQ1MtQVBJUkVRVUVTVFwiOiBcInRydWVcIixcclxuICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCYXNpYyBcIitCYXNlNjQuZW5jb2RlKHVzZXJuYW1lKyc6JytwYXNzd29yZClcclxuICAgICAgfSBcclxuXHJcbiAgICAgIEh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICB0cnkgeyAgIFxyXG4gICAgICAgICAgZGF0YSA9IHJlc3BvbnNlLmNvbnRlbnQudG9KU09OKCk7XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvclwiLCBlKTtcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgIHJldHVybjsgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihkYXRhPT1udWxsKSB7XHJcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvciBEYXRhIG51bGxcIiwgbnVsbCk7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBsZXQgYWxidW1zID0gZGF0YS5hbGJ1bXM7ICBcclxuICAgICAgICAvLyBlcnJvciBsb2FkaW5nXHJcbiAgICAgICAgaWYoYWxidW1zPT1udWxsKSB7XHJcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBjYWxsT2soKTtcclxuXHJcbiAgICAgIH0sIChlKT0+IHtcclxuICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3JcIiwgZSk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfSk7ICAgICAgIFxyXG4gICAgfVxyXG59XHJcbiJdfQ==