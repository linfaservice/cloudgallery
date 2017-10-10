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
        this.util.log("Open link for language: ", this.translate.currentLang);
        var link = "https://www.operweb.com/nextcloud-gallery-en/";
        if (this.translate.currentLang == "it")
            link = "https://www.operweb.com/nextcloud-gallery/";
        util.openUrl(link);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dGluZ3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsMENBQTRDO0FBQzVDLHVFQUErRDtBQUMvRCwrQ0FBaUQ7QUFDakQsa0NBQW9DO0FBQ3BDLG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsNENBQTZDO0FBQzdDLGdDQUFtQztBQUNuQyw4Q0FBeUM7QUFZekM7SUFXSSwyQkFDVSxJQUFVLEVBQ1gsSUFBVSxFQUNULFFBQTRCLEVBQzVCLFNBQTJCO1FBSDNCLFNBQUksR0FBSixJQUFJLENBQU07UUFDWCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFON0IsV0FBTSxHQUFHLElBQUksZ0JBQU0sRUFBRSxDQUFDO1FBUTVCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyxvQ0FBUSxHQUFoQjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRU8sZ0NBQUksR0FBWjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FB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RUFBRSxDQUFDLG9DQUFvQyxDQUFDO1lBQ2pELFNBQVMsRUFBRSxDQUFDLFdBQUksQ0FBQztTQUNsQixDQUFDO3lDQWVrQixXQUFJO1lBQ0wsV0FBSTtZQUNDLDhDQUFrQjtZQUNqQixnQ0FBZ0I7T0FmNUIsaUJBQWlCLENBNEg3QjtJQUFELHdCQUFDO0NBQUEsQUE1SEQsSUE0SEM7QUE1SFksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xyXG5pbXBvcnQgeyBUTlNGb250SWNvblNlcnZpY2UgfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcclxuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcInV0aWxzL3V0aWxzXCI7XHJcbmltcG9ydCAqIGFzIFBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcclxuaW1wb3J0ICogYXMgSHR0cCBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9odHRwXCJcclxuaW1wb3J0ICogYXMgIEJhc2U2NCBmcm9tIFwiYmFzZS02NFwiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuLi8uLi9jb21tb24vbG9hZGVyXCI7XHJcblxyXG5cclxuICBcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwic2V0dGluZ3NcIixcclxuICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9zZXR0aW5ncy9zZXR0aW5ncy5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9zZXR0aW5ncy9zZXR0aW5ncy1jb21tb24uY3NzXCJdLFxyXG4gIHByb3ZpZGVyczogW1V0aWxdXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29tcG9uZW50IHtcclxuIFxyXG4gICAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuXHJcbiAgICBwcml2YXRlIGhvc3Q7XHJcbiAgICBwcml2YXRlIHVzZXJuYW1lO1xyXG4gICAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICAgIHByaXZhdGUgcm9vdGRpcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XHJcbiBcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG5cdCAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2VcclxuICAgICkgIHtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlBhZ2UgSW5pdFwiLCBcIlNldHRpbmdzXCIpO1xyXG5cclxuICAgICAgdGhpcy5sYW5ndWFnZSA9IFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoXCJlblwiKTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUudXNlKFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZS5zcGxpdChcIi1cIilbMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbmdPbkluaXQoKSB7XHJcbiAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSB0cnVlO1xyXG4gICAgfSAgICBcclxuIFxyXG4gICAgcHJpdmF0ZSBiYWNrKCkge1xyXG4gICAgICB0aGlzLnV0aWwubmF2aWdhdGVCYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc1dlbGxDb25maWd1cmVkKCkge1xyXG4gICAgICBsZXQgY29uZmlndXJlZCA9IHRydWU7XHJcbiAgICAgIGlmKHRoaXMuaG9zdD09bnVsbCB8fCB0aGlzLmhvc3Q9PVwiXCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgaWYodGhpcy51c2VybmFtZT09bnVsbCB8fCB0aGlzLnVzZXJuYW1lPT1cIlwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKHRoaXMucGFzc3dvcmQ9PW51bGwgfHwgdGhpcy5wYXNzd29yZD09XCJcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZighdGhpcy5ob3N0LnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSkge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJOZXh0Y2xvdWQgYWRkcmVzcyBtdXN0IHN0YXJ0IHdpdGggaHR0cHM6Ly9cIikpLnNob3coKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vaWYoIW9rTG9naW4oKSkgY29uZmlndXJlZCA9IGZhbHNlO1xyXG4gICAgICByZXR1cm4gY29uZmlndXJlZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNhdmUoKSB7XHJcblxyXG4gICAgICBpZih0aGlzLmlzV2VsbENvbmZpZ3VyZWQoKSkge1xyXG4gICAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcImhvc3RcIiwgdGhpcy51dGlsLnJlcGxhY2VBbGwodGhpcy5ob3N0LCBcIiBcIiwgXCJcIikpO1xyXG4gICAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInVzZXJuYW1lXCIsIHRoaXMudXRpbC5yZXBsYWNlQWxsKHRoaXMudXNlcm5hbWUsIFwiIFwiLCBcIlwiKSk7XHJcbiAgICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicGFzc3dvcmRcIiwgdGhpcy51dGlsLnJlcGxhY2VBbGwodGhpcy5wYXNzd29yZCwgXCIgXCIsIFwiXCIpKTtcclxuICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJyb290ZGlyXCIsICh0aGlzLnJvb3RkaXI9PW51bGwpP1wiXCI6dGhpcy5yb290ZGlyLnRyaW0oKSk7IFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudHJ5Q29ubmVjdGlvbih0aGlzLmhvc3QsIHRoaXMudXNlcm5hbWUsIHRoaXMucGFzc3dvcmQsICgpPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgdGhpcy51dGlsLm5hdmlnYXRlKFwiXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgY29ubmVjdGluZy4gUGxlYXNlIGNoZWNrIHBhcmFtZXRlcnNcIikpLnNob3coKTtcclxuICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgICBwcml2YXRlIGxpbmsoKSB7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJPcGVuIGxpbmsgZm9yIGxhbmd1YWdlOiBcIiwgdGhpcy50cmFuc2xhdGUuY3VycmVudExhbmcpO1xyXG4gICAgICBsZXQgbGluayA9IFwiaHR0cHM6Ly93d3cub3BlcndlYi5jb20vbmV4dGNsb3VkLWdhbGxlcnktZW4vXCI7XHJcbiAgICAgIGlmKHRoaXMudHJhbnNsYXRlLmN1cnJlbnRMYW5nPT1cIml0XCIpIGxpbmsgPSBcImh0dHBzOi8vd3d3Lm9wZXJ3ZWIuY29tL25leHRjbG91ZC1nYWxsZXJ5L1wiO1xyXG4gICAgICB1dGlsLm9wZW5VcmwobGluayk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdHJ5Q29ubmVjdGlvbihob3N0LCB1c2VybmFtZSwgcGFzc3dvcmQsIGNhbGxPaykge1xyXG5cclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiQ2hlY2tpbmcgY29ubmVjdGlvbuKAplwiKSk7XHJcblxyXG4gICAgICBsZXQgdXJsID0gaG9zdCtcIi9pbmRleC5waHAvYXBwcy9nYWxsZXJ5L2FwaS9maWxlcy9saXN0P2xvY2F0aW9uPSZtZWRpYXR5cGVzPWltYWdlL2pwZWc7JmZlYXR1cmVzPSZldGFnXCI7XHJcbiAgICAgIGxldCBoZWFkZXJzID0geyBcclxuICAgICAgICBcIk9DUy1BUElSRVFVRVNUXCI6IFwidHJ1ZVwiLFxyXG4gICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJhc2ljIFwiK0Jhc2U2NC5lbmNvZGUodXNlcm5hbWUrJzonK3Bhc3N3b3JkKVxyXG4gICAgICB9IFxyXG5cclxuICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgaGVhZGVyczogaGVhZGVyc1xyXG4gICAgICB9KS50aGVuKChyZXNwb25zZTphbnkpPT4ge1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRyeSB7ICAgXHJcbiAgICAgICAgICBkYXRhID0gcmVzcG9uc2UuY29udGVudC50b0pTT04oKTtcclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yXCIsIGUpO1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgcmV0dXJuOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGRhdGE9PW51bGwpIHtcclxuICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yIERhdGEgbnVsbFwiLCBudWxsKTtcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgIHJldHVybjsgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGxldCBhbGJ1bXMgPSBkYXRhLmFsYnVtczsgIFxyXG4gICAgICAgIC8vIGVycm9yIGxvYWRpbmdcclxuICAgICAgICBpZihhbGJ1bXM9PW51bGwpIHtcclxuICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGNhbGxPaygpO1xyXG5cclxuICAgICAgfSwgKGUpPT4ge1xyXG4gICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBjb25uZWN0aW5nLiBQbGVhc2UgY2hlY2sgcGFyYW1ldGVyc1wiKSkuc2hvdygpO1xyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvclwiLCBlKTtcclxuICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9KTsgICAgICAgXHJcbiAgICB9XHJcbn1cclxuIl19