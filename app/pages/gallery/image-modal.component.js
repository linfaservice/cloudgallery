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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtbW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW1hZ2UtbW9kYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsbUVBQTRFO0FBRzVFLDRDQUE4QztBQUM5Qyx1REFBeUQ7QUFDekQsNkNBQTJDO0FBQzNDLG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsK0NBQWlEO0FBQ2pELGdDQUFtQztBQUNuQyx1RUFBK0Q7QUFZL0Q7SUFZRSw2QkFDVSxNQUF5QixFQUN6QixJQUFVLEVBQ1YsU0FBMkIsRUFDM0IsUUFBNEIsRUFDNUIsSUFBVTtRQUpWLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQ3pCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBR2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9B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LENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUE1RlUsbUJBQW1CO1FBUi9CLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBRSxDQUFDLCtCQUErQixDQUFDO1lBQzVDLFNBQVMsRUFBRSxFQUFFO1NBQ2QsQ0FBQzt5Q0FnQmtCLDJCQUFpQjtZQUNuQixXQUFJO1lBQ0MsZ0NBQWdCO1lBQ2pCLDhDQUFrQjtZQUN0QixXQUFJO09BakJULG1CQUFtQixDQThGL0I7SUFBRCwwQkFBQztDQUFBLEFBOUZELElBOEZDO0FBOUZZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0aWxcIjtcclxuaW1wb3J0IHsgTW9kYWxEaWFsb2dQYXJhbXMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZGlyZWN0aXZlcy9kaWFsb2dzXCI7XHJcbmltcG9ydCBMb2FkZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9sb2FkZXJcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0ICogYXMgSHR0cCBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9odHRwXCI7XHJcbmltcG9ydCAqIGFzIFNvY2lhbFNoYXJlIGZyb20gJ25hdGl2ZXNjcmlwdC1zb2NpYWwtc2hhcmUnO1xyXG5pbXBvcnQgeyBJbWFnZVNvdXJjZSB9IGZyb20gXCJpbWFnZS1zb3VyY2VcIjtcclxuaW1wb3J0ICogYXMgUGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgIEJhc2U2NCBmcm9tIFwiYmFzZS02NFwiO1xyXG5pbXBvcnQgeyBUTlNGb250SWNvblNlcnZpY2UgfSBmcm9tICduYXRpdmVzY3JpcHQtbmd4LWZvbnRpY29uJztcclxuXHJcbiBcclxuIFxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJpbWFnZW1vZGFsXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvZ2FsbGVyeS9pbWFnZS1tb2RhbC5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9nYWxsZXJ5L2ltYWdlLW1vZGFsLmNzc1wiXSxcclxuICBwcm92aWRlcnM6IFtdXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlTW9kYWxDb21wb25lbnQge1xyXG5cclxuICBwcml2YXRlIGxhbmd1YWdlO1xyXG4gIHByaXZhdGUgaG9zdDtcclxuICBwcml2YXRlIHVzZXJuYW1lO1xyXG4gIHByaXZhdGUgcGFzc3dvcmQ7XHJcbiAgcHJpdmF0ZSByb290ZGlyO1xyXG4gIHByaXZhdGUgaGVhZGVyczsgIFxyXG5cclxuICBwcml2YXRlIGl0ZW07IFxyXG4gIHByaXZhdGUgbG9hZGVyO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHBhcmFtczogTW9kYWxEaWFsb2dQYXJhbXMsIFxyXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGZvbnRpY29uOiBUTlNGb250SWNvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHV0aWw6IFV0aWxcclxuICApICB7XHJcblxyXG4gICAgdGhpcy5sYW5ndWFnZSA9IFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZTtcclxuICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKFwiZW5cIik7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZS51c2UoUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlLnNwbGl0KFwiLVwiKVswXSk7XHJcbiBcclxuICAgIHRoaXMuaG9zdCA9IFNldHRpbmdzLmdldFN0cmluZyhcImhvc3RcIik7XHJcbiAgICB0aGlzLnVzZXJuYW1lID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcm5hbWVcIik7XHJcbiAgICB0aGlzLnBhc3N3b3JkID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicGFzc3dvcmRcIik7XHJcbiAgICB0aGlzLnJvb3RkaXIgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJyb290ZGlyXCIpOyAgXHJcbiAgICB0aGlzLnJvb3RkaXIgPSAodGhpcy5yb290ZGlyPT1udWxsKT8gXCJcIjp0aGlzLnJvb3RkaXI7XHJcbiAgICB0aGlzLmhlYWRlcnMgPSB7IFxyXG4gICAgICBcIk9DUy1BUElSRVFVRVNUXCI6IFwidHJ1ZVwiLFxyXG4gICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCYXNpYyBcIitCYXNlNjQuZW5jb2RlKHRoaXMudXNlcm5hbWUrJzonK3RoaXMucGFzc3dvcmQpXHJcbiAgICB9IFxyXG5cclxuICAgIHRoaXMuaXRlbSA9IHBhcmFtcy5jb250ZXh0Lml0ZW07XHJcbiAgICB0aGlzLmxvYWRlciA9IHBhcmFtcy5jb250ZXh0LmxvYWRlcjtcclxuICAgXHJcbiAgfVxyXG4gXHJcbiAgbmdPbkluaXQoKSB7ICAgIFxyXG4gIH0gICAgXHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHsgIFxyXG4gICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgIC8vIGxvYWQgaGlnaCByZXNvbHV0aW9uIGltYWdlIGluIGJhY2tncm91bmRcclxuICAgIC8vY29uc29sZS5sb2coXCJJbWFnZSBMb2FkaW5nOiBcIiArIHRoaXMuaXRlbS51cmwgKyBcIi81MDAvNTAwXCIpO1xyXG5cclxuICAgIGlmKCF0aGlzLml0ZW0ubG9hZGVkKSB7XHJcbiAgICAgIEh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgICB1cmw6IHRoaXMuaXRlbS51cmwgKyBcIi81MDAvNTAwXCIsXHJcbiAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnNcclxuICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuXHJcbiAgICAgICAgICByZXNwb25zZS5jb250ZW50LnRvSW1hZ2UoKVxyXG4gICAgICAgICAgICAudGhlbigoaW1hZ2UpPT4ge1xyXG4gICAgICAgICAgICAgIGxldCBiYXNlNjQgPSBpbWFnZS50b0Jhc2U2NFN0cmluZyhcImpwZ1wiKTtcclxuICAgICAgICAgICAgICBsZXQgaGlnaHNyYyA9IGJhc2U2NDtcclxuICAgICAgICAgICAgICB0aGlzLml0ZW0uc3JjID0gaGlnaHNyYztcclxuICAgICAgICAgICAgICB0aGlzLml0ZW0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PiB7XHJcbiAgICAgICAgICAgICAgLy91dGlsLmxvZyhcImVycm9yXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7ICBcclxuXHJcbiAgICAgIH0sIChlKT0+IHtcclxuICAgICAgICAgIC8vVG9hc3QubWFrZVRleHQoXCJTaSDDqCB2ZXJpZmljYXRvIHVuIHByb2JsZW1hIGR1cmFudGUgaWwgY2FyaWNhbWVudG8gZGVsbCdpbW1hZ2luZSBhZCBhbHRhIHJpc29sdXppb25lXCIpLnNob3coKTtcclxuICAgICAgfSk7ICAgICAgIFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgICB0aGlzLnBhcmFtcy5jbG9zZUNhbGxiYWNrKHtcclxuICAgICAgICBcImNsb3NlXCI6IHRydWVcclxuICAgICAgfSk7IFxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVG91Y2hFZmZlY3QoZSkge1xyXG4gICAgICBpZihlLnR5cGU9XCJ0YXBcIiAmJiBlLmFjdGlvbj09XCJkb3duXCIpIHsgXHJcbiAgICAgICAgICBlLnZpZXcuc3R5bGUub3BhY2l0eSA9IFwiMC41XCI7IFxyXG4gICAgICB9IFxyXG4gICAgICBpZihlLnR5cGU9XCJ0YXBcIiAmJiBlLmFjdGlvbj09XCJ1cFwiKSB7IFxyXG4gICAgICAgICAgZS52aWV3LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjsgXHJcbiAgICAgIH0gICAgICAgXHJcbiAgfSAgXHJcblxyXG4gIG9uVGFwKGl0ZW0pIHtcclxuICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZVNvdXJjZSgpO1xyXG4gICAgaW1hZ2UubG9hZEZyb21CYXNlNjQoaXRlbS5zcmMpO1xyXG5cclxuICAgIFNvY2lhbFNoYXJlLnNoYXJlSW1hZ2UoaW1hZ2UsIHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJTaGFyZVwiKSArIFwiIFwiICsgaXRlbS50aXRsZSk7ICBcclxuICB9XHJcbiBcclxufVxyXG4iXX0=