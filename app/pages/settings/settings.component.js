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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dGluZ3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQTJDO0FBQzNDLGdDQUErQjtBQUMvQixzQ0FBa0Q7QUFDbEQsMENBQXlDO0FBQ3pDLDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsK0NBQWlEO0FBQ2pELGtDQUFvQztBQUNwQyxtQ0FBcUM7QUFDckMsK0NBQWlEO0FBQ2pELDRDQUE2QztBQUM3QyxnQ0FBbUM7QUFDbkMsOENBQXlDO0FBV3pDO0lBY0ksMkJBQ1UsSUFBVSxFQUNYLElBQVUsRUFDVCxRQUE0QixFQUM1QixTQUEyQjtRQUgzQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1gsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNULGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBTjdCLFdBQU0sR0FBRyxJQUFJLGdCQUFNLEVBQUUsQ0FBQztRQVM1QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8sb0NBQVEsR0FBaEI7UUFDRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsS0FBSyxH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O1FBRVgsQ0FBQyxFQUFFLFVBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzNGLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixLQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pCLE1BQU0sQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXZJUSxpQkFBaUI7UUFSN0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsU0FBUyxFQUFFLENBQUMsb0NBQW9DLENBQUM7WUFDakQsU0FBUyxFQUFFLENBQUMsV0FBSSxDQUFDO1NBQ2xCLENBQUM7eUNBa0JrQixXQUFJO1lBQ0wsV0FBSTtZQUNDLDhDQUFrQjtZQUNqQixnQ0FBZ0I7T0FsQjVCLGlCQUFpQixDQXdJN0I7SUFBRCx3QkFBQztDQUFBLEFBeElELElBd0lDO0FBeElZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwidXRpbHMvdXRpbHNcIjtcclxuaW1wb3J0ICogYXMgUGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgKiBhcyBIdHRwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIlxyXG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7XHJcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9sb2FkZXJcIjtcclxuXHJcbiAgXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcInNldHRpbmdzXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvc2V0dGluZ3Mvc2V0dGluZ3MtY29tbW9uLmNzc1wiXSxcclxuICBwcm92aWRlcnM6IFtVdGlsXVxyXG59KVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc0NvbXBvbmVudCB7XHJcblxyXG4gICAgcHVibGljIGlzQW5kcm9pZDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBpc0lvczogYm9vbGVhbjtcclxuXHJcbiAgICBwcml2YXRlIGxhbmd1YWdlO1xyXG5cclxuICAgIHByaXZhdGUgaG9zdDtcclxuICAgIHByaXZhdGUgdXNlcm5hbWU7XHJcbiAgICBwcml2YXRlIHBhc3N3b3JkO1xyXG4gICAgcHJpdmF0ZSByb290ZGlyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuIFxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXHJcblx0ICAgIHByaXZhdGUgdXRpbDogVXRpbCxcclxuICAgICAgcHJpdmF0ZSBmb250aWNvbjogVE5TRm9udEljb25TZXJ2aWNlLFxyXG4gICAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSwgXHJcbiAgICApICB7XHJcblxyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiUGFnZSBJbml0XCIsIFwiU2V0dGluZ3NcIik7XHJcblxyXG4gICAgICB0aGlzLmxhbmd1YWdlID0gUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZyhcImVuXCIpO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0ZS51c2UoUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlLnNwbGl0KFwiLVwiKVswXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBuZ09uSW5pdCgpIHtcclxuICAgICAgaWYgKGFwcGxpY2F0aW9uLmlvcykge1xyXG4gICAgICAgIHRoaXMuaXNBbmRyb2lkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc0lvcyA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xyXG4gICAgICAgICAgdGhpcy5pc0FuZHJvaWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5pc0lvcyA9IGZhbHNlO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xyXG4gICAgfSAgICBcclxuIFxyXG4gICAgcHJpdmF0ZSBiYWNrKCkge1xyXG4gICAgICB0aGlzLnV0aWwubmF2aWdhdGVCYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc1dlbGxDb25maWd1cmVkKCkge1xyXG4gICAgICBsZXQgY29uZmlndXJlZCA9IHRydWU7XHJcbiAgICAgIGlmKHRoaXMuaG9zdD09bnVsbCB8fCB0aGlzLmhvc3Q9PVwiXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgaWYodGhpcy51c2VybmFtZT09bnVsbCB8fCB0aGlzLnVzZXJuYW1lPT1cIlwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKHRoaXMucGFzc3dvcmQ9PW51bGwgfHwgdGhpcy5wYXNzd29yZD09XCJcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZighdGhpcy5ob3N0LnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJOZXh0Y2xvdWQgYWRkcmVzcyBtdXN0IHN0YXJ0IHdpdGggaHR0cHM6Ly9cIikpLnNob3coKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vaWYoIW9rTG9naW4oKSkgY29uZmlndXJlZCA9IGZhbHNlO1xyXG4gICAgICByZXR1cm4gY29uZmlndXJlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNhdmUoKSB7XHJcblxyXG4gICAgICBpZih0aGlzLmlzV2VsbENvbmZpZ3VyZWQoKSkge1xyXG4gICAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcImhvc3RcIiwgdGhpcy51dGlsLnJlcGxhY2VBbGwodGhpcy5ob3N0LCBcIiBcIiwgXCJcIikpO1xyXG4gICAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInVzZXJuYW1lXCIsIHRoaXMudXRpbC5yZXBsYWNlQWxsKHRoaXMudXNlcm5hbWUsIFwiIFwiLCBcIlwiKSk7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicGFzc3dvcmRcIiwgdGhpcy51dGlsLnJlcGxhY2VBbGwodGhpcy5wYXNzd29yZCwgXCIgXCIsIFwiXCIpKTtcclxuICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJyb290ZGlyXCIsICh0aGlzLnJvb3RkaXI9PW51bGwpP1wiXCI6dGhpcy5yb290ZGlyLnRyaW0oKSk7IFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudHJ5Q29ubmVjdGlvbih0aGlzLmhvc3QsIHRoaXMudXNlcm5hbWUsIHRoaXMucGFzc3dvcmQsICgpPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgdGhpcy51dGlsLm5hdmlnYXRlKFwiXCIpOyBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGNvbm5lY3RpbmcuIFBsZWFzZSBjaGVjayBwYXJhbWV0ZXJzXCIpKS5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICAgcHJpdmF0ZSBsaW5rKCkge1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiT3BlbiBsaW5rIGZvciBsYW5ndWFnZTogXCIsIHRoaXMudHJhbnNsYXRlLmN1cnJlbnRMYW5nKTtcclxuICAgICAgbGV0IGxpbmsgPSBcImh0dHBzOi8vd3d3Lm9wZXJ3ZWIuY29tL25leHRjbG91ZC1nYWxsZXJ5LWVuL1wiO1xyXG4gICAgICBpZih0aGlzLnRyYW5zbGF0ZS5jdXJyZW50TGFuZz09XCJpdFwiKSBsaW5rID0gXCJodHRwczovL3d3dy5vcGVyd2ViLmNvbS9uZXh0Y2xvdWQtZ2FsbGVyeS9cIjtcclxuICAgICAgdXRpbC5vcGVuVXJsKGxpbmspO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiTGlua1wiLCBsaW5rKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSB0cnlDb25uZWN0aW9uKGhvc3QsIHVzZXJuYW1lLCBwYXNzd29yZCwgY2FsbE9rKSB7XHJcblxyXG4gICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJDaGVja2luZyBjb25uZWN0aW9u4oCmXCIpKTtcclxuXHJcbiAgICAgIGxldCB1cmwgPSBob3N0K1wiL2luZGV4LnBocC9hcHBzL2dhbGxlcnkvYXBpL2ZpbGVzL2xpc3Q/bG9jYXRpb249Jm1lZGlhdHlwZXM9aW1hZ2UvanBlZzsmZmVhdHVyZXM9JmV0YWdcIjtcclxuICAgICAgbGV0IGhlYWRlcnMgPSB7IFxyXG4gICAgICAgIFwiT0NTLUFQSVJFUVVFU1RcIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmFzaWMgXCIrQmFzZTY0LmVuY29kZSh1c2VybmFtZSsnOicrcGFzc3dvcmQpXHJcbiAgICAgIH0gXHJcblxyXG4gICAgICBIdHRwLnJlcXVlc3Qoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzXHJcbiAgICAgIH0pLnRoZW4oKHJlc3BvbnNlOmFueSk9PiB7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgdHJ5IHsgICBcclxuICAgICAgICAgIGRhdGEgPSByZXNwb25zZS5jb250ZW50LnRvSlNPTigpO1xyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGNvbm5lY3RpbmcuIFBsZWFzZSBjaGVjayBwYXJhbWV0ZXJzXCIpKS5zaG93KCk7XHJcbiAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3JcIiwgZSk7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICByZXR1cm47ICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoZGF0YT09bnVsbCkge1xyXG4gICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGNvbm5lY3RpbmcuIFBsZWFzZSBjaGVjayBwYXJhbWV0ZXJzXCIpKS5zaG93KCk7XHJcbiAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3IgRGF0YSBudWxsXCIsIG51bGwpO1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgcmV0dXJuOyAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgbGV0IGFsYnVtcyA9IGRhdGEuYWxidW1zOyAgXHJcbiAgICAgICAgLy8gZXJyb3IgbG9hZGluZ1xyXG4gICAgICAgIGlmKGFsYnVtcz09bnVsbCkge1xyXG4gICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGNvbm5lY3RpbmcuIFBsZWFzZSBjaGVjayBwYXJhbWV0ZXJzXCIpKS5zaG93KCk7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FsbE9rKCk7XHJcblxyXG4gICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGNvbm5lY3RpbmcuIFBsZWFzZSBjaGVjayBwYXJhbWV0ZXJzXCIpKS5zaG93KCk7XHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yXCIsIGUpO1xyXG4gICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0pOyAgICAgICBcclxuICAgIH1cclxufVxyXG4iXX0=