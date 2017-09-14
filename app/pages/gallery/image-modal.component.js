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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtbW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW1hZ2UtbW9kYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsbUVBQTRFO0FBRzVFLDRDQUE4QztBQUM5Qyx1REFBeUQ7QUFDekQsNkNBQTJDO0FBQzNDLG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsK0NBQWlEO0FBQ2pELGdDQUFtQztBQUNuQyx1RUFBK0Q7QUFZL0Q7SUFZRSw2QkFDVSxNQUF5QixFQUN6QixJQUFVLEVBQ1YsU0FBMkIsRUFDM0IsUUFBNEIsRUFDNUIsSUFBVTtRQUpWLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQ3pCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBR2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9B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LENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBNUZVLG1CQUFtQjtRQVIvQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsV0FBVyxFQUFFLGdDQUFnQztZQUM3QyxTQUFTLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztZQUM1QyxTQUFTLEVBQUUsRUFBRTtTQUNkLENBQUM7eUNBZ0JrQiwyQkFBaUI7WUFDbkIsV0FBSTtZQUNDLGdDQUFnQjtZQUNqQiw4Q0FBa0I7WUFDdEIsV0FBSTtPQWpCVCxtQkFBbUIsQ0E4Ri9CO0lBQUQsMEJBQUM7Q0FBQSxBQTlGRCxJQThGQztBQTlGWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsXCI7XHJcbmltcG9ydCB7IE1vZGFsRGlhbG9nUGFyYW1zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2RpcmVjdGl2ZXMvZGlhbG9nc1wiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuLi8uLi9jb21tb24vbG9hZGVyXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcbmltcG9ydCAqIGFzIEh0dHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvaHR0cFwiO1xyXG5pbXBvcnQgKiBhcyBTb2NpYWxTaGFyZSBmcm9tICduYXRpdmVzY3JpcHQtc29jaWFsLXNoYXJlJztcclxuaW1wb3J0IHsgSW1hZ2VTb3VyY2UgfSBmcm9tIFwiaW1hZ2Utc291cmNlXCI7XHJcbmltcG9ydCAqIGFzIFBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcclxuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzICBCYXNlNjQgZnJvbSBcImJhc2UtNjRcIjtcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcblxyXG4gXHJcbiBcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiaW1hZ2Vtb2RhbFwiLFxyXG4gIHRlbXBsYXRlVXJsOiBcInBhZ2VzL2dhbGxlcnkvaW1hZ2UtbW9kYWwuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvZ2FsbGVyeS9pbWFnZS1tb2RhbC5jc3NcIl0sXHJcbiAgcHJvdmlkZXJzOiBbXVxyXG59KVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZU1vZGFsQ29tcG9uZW50IHtcclxuXHJcbiAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuICBwcml2YXRlIGhvc3Q7XHJcbiAgcHJpdmF0ZSB1c2VybmFtZTtcclxuICBwcml2YXRlIHBhc3N3b3JkO1xyXG4gIHByaXZhdGUgcm9vdGRpcjtcclxuICBwcml2YXRlIGhlYWRlcnM7ICBcclxuXHJcbiAgcHJpdmF0ZSBpdGVtOyBcclxuICBwcml2YXRlIGxvYWRlcjtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBwYXJhbXM6IE1vZGFsRGlhbG9nUGFyYW1zLCBcclxuICAgIHByaXZhdGUgcGFnZTogUGFnZSxcclxuICAgIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBmb250aWNvbjogVE5TRm9udEljb25TZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSB1dGlsOiBVdGlsXHJcbiAgKSAge1xyXG5cclxuICAgIHRoaXMubGFuZ3VhZ2UgPSBQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2U7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZyhcImVuXCIpO1xyXG4gICAgdGhpcy50cmFuc2xhdGUudXNlKFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZS5zcGxpdChcIi1cIilbMF0pO1xyXG4gXHJcbiAgICB0aGlzLmhvc3QgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0XCIpO1xyXG4gICAgdGhpcy51c2VybmFtZSA9IFNldHRpbmdzLmdldFN0cmluZyhcInVzZXJuYW1lXCIpO1xyXG4gICAgdGhpcy5wYXNzd29yZCA9IFNldHRpbmdzLmdldFN0cmluZyhcInBhc3N3b3JkXCIpO1xyXG4gICAgdGhpcy5yb290ZGlyID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicm9vdGRpclwiKTsgIFxyXG4gICAgdGhpcy5yb290ZGlyID0gKHRoaXMucm9vdGRpcj09bnVsbCk/IFwiXCI6dGhpcy5yb290ZGlyO1xyXG4gICAgdGhpcy5oZWFkZXJzID0geyBcclxuICAgICAgXCJPQ1MtQVBJUkVRVUVTVFwiOiBcInRydWVcIixcclxuICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmFzaWMgXCIrQmFzZTY0LmVuY29kZSh0aGlzLnVzZXJuYW1lKyc6Jyt0aGlzLnBhc3N3b3JkKVxyXG4gICAgfSBcclxuXHJcbiAgICB0aGlzLml0ZW0gPSBwYXJhbXMuY29udGV4dC5pdGVtO1xyXG4gICAgdGhpcy5sb2FkZXIgPSBwYXJhbXMuY29udGV4dC5sb2FkZXI7XHJcbiAgIFxyXG4gIH1cclxuIFxyXG4gIG5nT25Jbml0KCkgeyAgICBcclxuICB9ICAgIFxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7ICBcclxuICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuXHJcbiAgICAvLyBsb2FkIGhpZ2ggcmVzb2x1dGlvbiBpbWFnZSBpbiBiYWNrZ3JvdW5kXHJcbiAgICAvL2NvbnNvbGUubG9nKFwiSW1hZ2UgTG9hZGluZzogXCIgKyB0aGlzLml0ZW0udXJsICsgXCIvNTAwLzUwMFwiKTtcclxuXHJcbiAgICBpZighdGhpcy5pdGVtLmxvYWRlZCkge1xyXG4gICAgICBIdHRwLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLml0ZW0udXJsICsgXCIvNTAwLzUwMFwiLFxyXG4gICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzXHJcbiAgICAgIH0pLnRoZW4oKHJlc3BvbnNlOmFueSk9PiB7XHJcblxyXG4gICAgICAgICAgcmVzcG9uc2UuY29udGVudC50b0ltYWdlKClcclxuICAgICAgICAgICAgLnRoZW4oKGltYWdlKT0+IHtcclxuICAgICAgICAgICAgICBsZXQgYmFzZTY0ID0gaW1hZ2UudG9CYXNlNjRTdHJpbmcoXCJqcGdcIik7XHJcbiAgICAgICAgICAgICAgbGV0IGhpZ2hzcmMgPSBiYXNlNjQ7XHJcbiAgICAgICAgICAgICAgdGhpcy5pdGVtLnNyYyA9IGhpZ2hzcmM7XHJcbiAgICAgICAgICAgICAgdGhpcy5pdGVtLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT4ge1xyXG4gICAgICAgICAgICAgIC8vdXRpbC5sb2coXCJlcnJvclwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgIH0pOyAgXHJcblxyXG4gICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgICAvL1RvYXN0Lm1ha2VUZXh0KFwiU2kgw6ggdmVyaWZpY2F0byB1biBwcm9ibGVtYSBkdXJhbnRlIGlsIGNhcmljYW1lbnRvIGRlbGwnaW1tYWdpbmUgYWQgYWx0YSByaXNvbHV6aW9uZVwiKS5zaG93KCk7XHJcbiAgICAgIH0pOyAgICAgICBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbG9zZSgpIHtcclxuICAgICAgdGhpcy5wYXJhbXMuY2xvc2VDYWxsYmFjayh7XHJcbiAgICAgICAgXCJjbG9zZVwiOiB0cnVlXHJcbiAgICAgIH0pOyBcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvblRvdWNoRWZmZWN0KGUpIHtcclxuICAgICAgaWYoZS50eXBlPVwidGFwXCIgJiYgZS5hY3Rpb249PVwiZG93blwiKSB7IFxyXG4gICAgICAgICAgZS52aWV3LnN0eWxlLm9wYWNpdHkgPSBcIjAuNVwiOyBcclxuICAgICAgfSBcclxuICAgICAgaWYoZS50eXBlPVwidGFwXCIgJiYgZS5hY3Rpb249PVwidXBcIikgeyBcclxuICAgICAgICAgIGUudmlldy5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7IFxyXG4gICAgICB9ICAgICAgIFxyXG4gIH0gIFxyXG5cclxuICBvblRhcChpdGVtKSB7XHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VTb3VyY2UoKTtcclxuICAgIGltYWdlLmxvYWRGcm9tQmFzZTY0KGl0ZW0uc3JjKTtcclxuXHJcbiAgICBTb2NpYWxTaGFyZS5zaGFyZUltYWdlKGltYWdlLCB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiU2hhcmVcIikgKyBcIiBcIiArIGl0ZW0udGl0bGUpOyAgXHJcbiAgfVxyXG4gXHJcbn1cclxuIl19