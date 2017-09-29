"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var util_1 = require("../../common/util");
var dialogs_1 = require("nativescript-angular/directives/dialogs");
var Http = require("tns-core-modules/http");
var SocialShare = require("nativescript-social-share");
var image_source_1 = require("image-source");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var Settings = require("application-settings");
var Base64 = require("base-64");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var ImageModalComponent = /** @class */ (function () {
    function ImageModalComponent(params, page, translate, fonticon, util) {
        this.params = params;
        this.page = page;
        this.translate = translate;
        this.fonticon = fonticon;
        this.util = util;
        this.language = Platform.device.language;
        this.translate.setDefaultLang("en");
        this.translate.use(Platform.device.language.split("-")[0]);
        this.host = Settings.getString("host");
        this.username = Settings.getString("username");
        this.password = Settings.getString("password");
        this.rootdir = Settings.getString("rootdir");
        this.rootdir = (this.rootdir == null) ? "" : this.rootdir;
        this.headers = {
            "OCS-APIREQUEST": "true",
            "Authorization": "Basic " + Base64.encode(this.username + ':' + this.password)
        };
        this.item = params.context.item;
        this.loader = params.context.loader;
    }
    ImageModalComponent.prototype.ngOnInit = function () {
    };
    ImageModalComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.loader.hideLoader();
        // load high resolution image in background
        //console.log("Image Loading: " + this.item.url + "/500/500");
        if (!this.item.loaded) {
            Http.request({
                url: this.item.url + "/500/500",
                method: "GET",
                headers: this.headers
            }).then(function (response) {
                response.content.toImage()
                    .then(function (image) {
                    var base64 = image.toBase64String("jpg");
                    var highsrc = base64;
                    _this.item.src = highsrc;
                    _this.item.loaded = true;
                })
                    .catch(function (error) {
                    //util.log("error", error);
                });
            }, function (e) {
                //Toast.makeText("Si è verificato un problema durante il caricamento dell'immagine ad alta risoluzione").show();
            });
        }
    };
    ImageModalComponent.prototype.close = function () {
        this.params.closeCallback({
            "close": true
        });
    };
    ImageModalComponent.prototype.onTouchEffect = function (e) {
        if (e.type = "tap" && e.action == "down") {
            e.view.style.opacity = "0.5";
        }
        if (e.type = "tap" && e.action == "up") {
            e.view.style.opacity = "1";
        }
    };
    ImageModalComponent.prototype.onTap = function (item) {
        var image = new image_source_1.ImageSource();
        image.loadFromBase64(item.src);
        SocialShare.shareImage(image, this.translate.instant("Share") + " " + item.title);
    };
    ImageModalComponent = __decorate([
        core_1.Component({
            selector: "imagemodal",
            templateUrl: "pages/gallery/image-modal.html",
            styleUrls: ["pages/gallery/image-modal.css"],
            providers: []
        }),
        __metadata("design:paramtypes", [dialogs_1.ModalDialogParams,
            page_1.Page,
            ng2_translate_1.TranslateService,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            util_1.Util])
    ], ImageModalComponent);
    return ImageModalComponent;
}());
exports.ImageModalComponent = ImageModalComponent;
