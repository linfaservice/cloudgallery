"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var util_1 = require("../../common/util");
var Toast = require("nativescript-toast");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var Settings = require("application-settings");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var Http = require("tns-core-modules/http");
var Base64 = require("base-64");
var loader_1 = require("../../common/loader");
var email = require("nativescript-email");
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
        if (!this.host.startsWith("http://") && !this.host.startsWith("https://")) {
            Toast.makeText(this.translate.instant("Nextcloud address must start with https:// or http://")).show();
            return false;
        }
        if (this.host.startsWith("http://")) {
            Toast.makeText(this.translate.instant("Connection is not secure. Please configure your server on https")).show();
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
        /*
        this.util.log("Open link for language: ", this.translate.currentLang);
        let link = "https://www.operweb.com/nextcloud-gallery-en/";
        if(this.translate.currentLang=="it") link = "https://www.operweb.com/nextcloud-gallery/";
        util.openUrl(link);
        */
        email.compose({
            subject: this.translate.instant("Request for Cloud Gallery unlimited"),
            body: this.translate.instant("Hello, I'm interested to obtain unlimited space for Cloud Gallery. Thanks"),
            to: ['helpdesk@linfaservice.it']
        }).then(function () {
            this.util.log("Email compose for Cloud Gallery unlimited request", "Email composer closed");
        }, function (err) {
            this.util.log("Email compose error", err);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dGluZ3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsMENBQTRDO0FBQzVDLHVFQUErRDtBQUMvRCwrQ0FBaUQ7QUFFakQsbUNBQXFDO0FBQ3JDLCtDQUFpRDtBQUNqRCw0Q0FBNkM7QUFDN0MsZ0NBQW1DO0FBQ25DLDhDQUF5QztBQUN6QywwQ0FBNEM7QUFZNUM7SUFXSSwyQkFDVSxJQUFVLEVBQ1gsSUFBVSxFQUNULFFBQTRCLEVBQzVCLFNBQTJCO1FBSDNCLFNBQUksR0FBSixJQUFJLENBQU07UUFDWCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFON0IsV0FBTSxHQUFHLElBQUksZ0JBQU0sRUFBRSxDQUFDO1FBUTVCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyxvQ0FBUSxHQUFoQjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRU8sZ0NBQUksR0FBWjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FB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O1lBRUQsTUFBTSxFQUFFLENBQUM7UUFFWCxDQUFDLEVBQUUsVUFBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0YsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFCLEtBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDekIsTUFBTSxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBMUlRLGlCQUFpQjtRQVI3QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsV0FBVyxFQUFFLDhCQUE4QjtZQUMzQyxTQUFTLEVBQUUsQ0FBQyxvQ0FBb0MsQ0FBQztZQUNqRCxTQUFTLEVBQUUsQ0FBQyxXQUFJLENBQUM7U0FDbEIsQ0FBQzt5Q0Fla0IsV0FBSTtZQUNMLFdBQUk7WUFDQyw4Q0FBa0I7WUFDakIsZ0NBQWdCO09BZjVCLGlCQUFpQixDQTJJN0I7SUFBRCx3QkFBQztDQUFBLEFBM0lELElBMklDO0FBM0lZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0aWxcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCJ1dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgKiBhcyBQbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XHJcbmltcG9ydCAqIGFzIEh0dHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvaHR0cFwiXHJcbmltcG9ydCAqIGFzICBCYXNlNjQgZnJvbSBcImJhc2UtNjRcIjtcclxuaW1wb3J0IExvYWRlciBmcm9tIFwiLi4vLi4vY29tbW9uL2xvYWRlclwiO1xyXG5pbXBvcnQgKiBhcyBlbWFpbCBmcm9tIFwibmF0aXZlc2NyaXB0LWVtYWlsXCI7XHJcblxyXG5cclxuICBcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwic2V0dGluZ3NcIixcclxuICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9zZXR0aW5ncy9zZXR0aW5ncy5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9zZXR0aW5ncy9zZXR0aW5ncy1jb21tb24uY3NzXCJdLFxyXG4gIHByb3ZpZGVyczogW1V0aWxdXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29tcG9uZW50IHtcclxuIFxyXG4gICAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuXHJcbiAgICBwcml2YXRlIGhvc3Q7XHJcbiAgICBwcml2YXRlIHVzZXJuYW1lO1xyXG4gICAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICAgIHByaXZhdGUgcm9vdGRpcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XHJcbiBcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG5cdCAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2VcclxuICAgICkgIHtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlBhZ2UgSW5pdFwiLCBcIlNldHRpbmdzXCIpO1xyXG5cclxuICAgICAgdGhpcy5sYW5ndWFnZSA9IFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoXCJlblwiKTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUudXNlKFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZS5zcGxpdChcIi1cIilbMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbmdPbkluaXQoKSB7XHJcbiAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xyXG4gICAgfSAgICBcclxuIFxyXG4gICAgcHJpdmF0ZSBiYWNrKCkge1xyXG4gICAgICB0aGlzLnV0aWwubmF2aWdhdGVCYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc1dlbGxDb25maWd1cmVkKCkge1xyXG4gICAgICBsZXQgY29uZmlndXJlZCA9IHRydWU7XHJcbiAgICAgIGlmKHRoaXMuaG9zdD09bnVsbCB8fCB0aGlzLmhvc3Q9PVwiXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgaWYodGhpcy51c2VybmFtZT09bnVsbCB8fCB0aGlzLnVzZXJuYW1lPT1cIlwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKHRoaXMucGFzc3dvcmQ9PW51bGwgfHwgdGhpcy5wYXNzd29yZD09XCJcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZighdGhpcy5ob3N0LnN0YXJ0c1dpdGgoXCJodHRwOi8vXCIpICYmICF0aGlzLmhvc3Quc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSB7XHJcbiAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIk5leHRjbG91ZCBhZGRyZXNzIG11c3Qgc3RhcnQgd2l0aCBodHRwczovLyBvciBodHRwOi8vXCIpKS5zaG93KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHRoaXMuaG9zdC5zdGFydHNXaXRoKFwiaHR0cDovL1wiKSkge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJDb25uZWN0aW9uIGlzIG5vdCBzZWN1cmUuIFBsZWFzZSBjb25maWd1cmUgeW91ciBzZXJ2ZXIgb24gaHR0cHNcIikpLnNob3coKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9pZighb2tMb2dpbigpKSBjb25maWd1cmVkID0gZmFsc2U7XHJcbiAgICAgIHJldHVybiBjb25maWd1cmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2F2ZSgpIHtcclxuXHJcbiAgICAgIGlmKHRoaXMuaXNXZWxsQ29uZmlndXJlZCgpKSB7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwiaG9zdFwiLCB0aGlzLnV0aWwucmVwbGFjZUFsbCh0aGlzLmhvc3QsIFwiIFwiLCBcIlwiKSk7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwidXNlcm5hbWVcIiwgdGhpcy51dGlsLnJlcGxhY2VBbGwodGhpcy51c2VybmFtZSwgXCIgXCIsIFwiXCIpKTtcclxuICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJwYXNzd29yZFwiLCB0aGlzLnV0aWwucmVwbGFjZUFsbCh0aGlzLnBhc3N3b3JkLCBcIiBcIiwgXCJcIikpO1xyXG4gICAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInJvb3RkaXJcIiwgKHRoaXMucm9vdGRpcj09bnVsbCk/XCJcIjp0aGlzLnJvb3RkaXIudHJpbSgpKTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50cnlDb25uZWN0aW9uKHRoaXMuaG9zdCwgdGhpcy51c2VybmFtZSwgdGhpcy5wYXNzd29yZCwgKCk9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICB0aGlzLnV0aWwubmF2aWdhdGUoXCJcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIHByaXZhdGUgbGluaygpIHtcclxuICAgICAgLypcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIk9wZW4gbGluayBmb3IgbGFuZ3VhZ2U6IFwiLCB0aGlzLnRyYW5zbGF0ZS5jdXJyZW50TGFuZyk7XHJcbiAgICAgIGxldCBsaW5rID0gXCJodHRwczovL3d3dy5vcGVyd2ViLmNvbS9uZXh0Y2xvdWQtZ2FsbGVyeS1lbi9cIjtcclxuICAgICAgaWYodGhpcy50cmFuc2xhdGUuY3VycmVudExhbmc9PVwiaXRcIikgbGluayA9IFwiaHR0cHM6Ly93d3cub3BlcndlYi5jb20vbmV4dGNsb3VkLWdhbGxlcnkvXCI7XHJcbiAgICAgIHV0aWwub3BlblVybChsaW5rKTtcclxuICAgICAgKi9cclxuICAgICAgZW1haWwuY29tcG9zZSh7XHJcbiAgICAgICAgc3ViamVjdDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIlJlcXVlc3QgZm9yIENsb3VkIEdhbGxlcnkgdW5saW1pdGVkXCIpLFxyXG4gICAgICAgIGJvZHk6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJIZWxsbywgSSdtIGludGVyZXN0ZWQgdG8gb2J0YWluIHVubGltaXRlZCBzcGFjZSBmb3IgQ2xvdWQgR2FsbGVyeS4gVGhhbmtzXCIpLFxyXG4gICAgICAgIHRvOiBbJ2hlbHBkZXNrQGxpbmZhc2VydmljZS5pdCddXHJcbiAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRW1haWwgY29tcG9zZSBmb3IgQ2xvdWQgR2FsbGVyeSB1bmxpbWl0ZWQgcmVxdWVzdFwiLCBcIkVtYWlsIGNvbXBvc2VyIGNsb3NlZFwiKTtcclxuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFbWFpbCBjb21wb3NlIGVycm9yXCIsIGVycik7XHJcbiAgICAgIH0pOyAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHRyeUNvbm5lY3Rpb24oaG9zdCwgdXNlcm5hbWUsIHBhc3N3b3JkLCBjYWxsT2spIHtcclxuXHJcbiAgICAgIHRoaXMubG9hZGVyLnNob3dMb2FkZXIodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkNoZWNraW5nIGNvbm5lY3Rpb27igKZcIikpO1xyXG5cclxuICAgICAgbGV0IHVybCA9IGhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvZmlsZXMvbGlzdD9sb2NhdGlvbj0mbWVkaWF0eXBlcz1pbWFnZS9qcGVnOyZmZWF0dXJlcz0mZXRhZ1wiO1xyXG4gICAgICBsZXQgaGVhZGVycyA9IHsgXHJcbiAgICAgICAgXCJPQ1MtQVBJUkVRVUVTVFwiOiBcInRydWVcIixcclxuICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCYXNpYyBcIitCYXNlNjQuZW5jb2RlKHVzZXJuYW1lKyc6JytwYXNzd29yZClcclxuICAgICAgfSBcclxuXHJcbiAgICAgIEh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICB0cnkgeyAgIFxyXG4gICAgICAgICAgZGF0YSA9IHJlc3BvbnNlLmNvbnRlbnQudG9KU09OKCk7XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvclwiLCBlKTtcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgIHJldHVybjsgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihkYXRhPT1udWxsKSB7XHJcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvciBEYXRhIG51bGxcIiwgbnVsbCk7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBsZXQgYWxidW1zID0gZGF0YS5hbGJ1bXM7ICBcclxuICAgICAgICAvLyBlcnJvciBsb2FkaW5nXHJcbiAgICAgICAgaWYoYWxidW1zPT1udWxsKSB7XHJcbiAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBjYWxsT2soKTtcclxuXHJcbiAgICAgIH0sIChlKT0+IHtcclxuICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3JcIiwgZSk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfSk7ICAgICAgIFxyXG4gICAgfVxyXG59XHJcbiJdfQ==