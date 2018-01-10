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
