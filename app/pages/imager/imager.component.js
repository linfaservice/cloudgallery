"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var application = require("application");
var application_1 = require("application");
var util_1 = require("../../common/util");
var loader_1 = require("../../common/loader");
var SocialShare = require("nativescript-social-share");
var image_source_1 = require("image-source");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var Settings = require("application-settings");
var Base64 = require("base-64");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var gallery_cache_1 = require("../../common/gallery.cache");
var element_registry_1 = require("nativescript-angular/element-registry");
element_registry_1.registerElement("Slide", function () { return require("nativescript-slides").Slide; });
element_registry_1.registerElement("SlideContainer", function () { return require("nativescript-slides").SlideContainer; });
var ImagerComponent = /** @class */ (function () {
    function ImagerComponent(page, translate, fonticon, util, cache, loader) {
        this.page = page;
        this.translate = translate;
        this.fonticon = fonticon;
        this.util = util;
        this.cache = cache;
        this.loader = loader;
        this.images = [];
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
    }
    ImagerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = false;
        this.buildSlider();
        if (application.android) {
            application.android.on(application_1.AndroidApplication.activityBackPressedEvent, function (data) {
                data.cancel = true; // prevents default back button behavior
                _this.back();
            });
        }
        // search position of selected image
        var k = 0;
        var currentImageIndex = 0;
        var currentImageUrl = this.cache.currentImage.url;
        for (var i in this.cache.currentAlbum.items) {
            var img = this.cache.currentAlbum.items[i];
            if (img.url == currentImageUrl) {
                currentImageIndex = k;
                break;
            }
            k++;
        }
        setTimeout(function () {
            var slideContainer = _this.slideContainerView.nativeElement;
            slideContainer.constructView();
            slideContainer.goToSlide(currentImageIndex);
        }, 10);
    };
    ImagerComponent.prototype.back = function () {
        this.util.navigateBack();
    };
    ImagerComponent.prototype.buildSlider = function () {
        for (var i in this.cache.currentAlbum.items) {
            var image = this.cache.currentAlbum.items[i];
            this.images.push(image);
        }
    };
    ImagerComponent.prototype.ngAfterViewInit = function () {
        this.loader.hideLoader();
        // load high resolution image in background
        //console.log("Image Loading: " + this.item.url + "/500/500");
        /*
        if(!this.item.loaded) {
          Http.request({
              url: this.item.url + "/500/500",
              method: "GET",
              headers: this.headers
          }).then((response:any)=> {
    
              response.content.toImage()
                .then((image)=> {
                  let base64 = image.toBase64String("jpg");
                  let highsrc = base64;
                  this.item.src = highsrc;
                  this.item.loaded = true;
    
                  this.images[0].src = highsrc;
                })
                .catch((error)=> {
                  //util.log("error", error);
                });
    
          }, (e)=> {
              //Toast.makeText("Si è verificato un problema durante il caricamento dell'immagine ad alta risoluzione").show();
          });
        }
        */
    };
    ImagerComponent.prototype.onTap = function (item) {
        var image = new image_source_1.ImageSource();
        image.loadFromBase64(item.src);
        SocialShare.shareImage(image, this.translate.instant("Share") + " " + item.title);
    };
    ImagerComponent.prototype.onSwipe = function (event, item) {
        this.util.log("onSlide", event);
    };
    __decorate([
        core_1.ViewChild("slideContainer"),
        __metadata("design:type", core_1.ElementRef)
    ], ImagerComponent.prototype, "slideContainerView", void 0);
    ImagerComponent = __decorate([
        core_1.Component({
            selector: "imager",
            templateUrl: "pages/imager/imager.html",
            styleUrls: ["pages/imager/imager.css"],
            providers: []
        }),
        __metadata("design:paramtypes", [page_1.Page,
            ng2_translate_1.TranslateService,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            util_1.Util,
            gallery_cache_1.default,
            loader_1.default])
    ], ImagerComponent);
    return ImagerComponent;
}());
exports.ImagerComponent = ImagerComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImltYWdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBK0I7QUFDL0Isc0NBQXlFO0FBQ3pFLHlDQUEyQztBQUMzQywyQ0FBc0Y7QUFDdEYsMENBQXlDO0FBQ3pDLDhDQUF5QztBQUd6Qyx1REFBeUQ7QUFDekQsNkNBQTJDO0FBQzNDLG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsK0NBQWlEO0FBQ2pELGdDQUFtQztBQUNuQyx1RUFBK0Q7QUFFL0QsNERBQXNEO0FBRXRELDBFQUFzRTtBQUN0RSxrQ0FBZSxDQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxFQUFwQyxDQUFvQyxDQUFDLENBQUM7QUFDckUsa0NBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsY0FBYyxFQUE3QyxDQUE2QyxDQUFDLENBQUM7QUFVdkY7SUFhRSx5QkFDVSxJQUFVLEVBQ1YsU0FBMkIsRUFDM0IsUUFBNEIsRUFDNUIsSUFBVSxFQUNWLEtBQW1CLEVBQ25CLE1BQWM7UUFMZCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLFVBQUssR0FBTCxLQUFLLENBQWM7UUFDbkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVZqQixXQUFNLEdBQWUsRUFBRSxDQUFDO1FBYTdCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFB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ImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgRWxlbWVudFJlZiwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCB7IEFuZHJvaWRBcHBsaWNhdGlvbiwgQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuLi8uLi9jb21tb24vbG9hZGVyXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcbmltcG9ydCAqIGFzIEh0dHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvaHR0cFwiO1xyXG5pbXBvcnQgKiBhcyBTb2NpYWxTaGFyZSBmcm9tICduYXRpdmVzY3JpcHQtc29jaWFsLXNoYXJlJztcclxuaW1wb3J0IHsgSW1hZ2VTb3VyY2UgfSBmcm9tIFwiaW1hZ2Utc291cmNlXCI7XHJcbmltcG9ydCAqIGFzIFBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSBcIm5nMi10cmFuc2xhdGVcIjtcclxuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzICBCYXNlNjQgZnJvbSBcImJhc2UtNjRcIjtcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCB7IEdhbGxlcnlJdGVtIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9nYWxsZXJ5Lml0ZW1cIjtcclxuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbGxlcnkuY2FjaGVcIjtcclxuXHJcbmltcG9ydCB7cmVnaXN0ZXJFbGVtZW50fSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeVwiO1xyXG5yZWdpc3RlckVsZW1lbnQoXCJTbGlkZVwiLCAoKSA9PiByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXNsaWRlc1wiKS5TbGlkZSk7XHJcbnJlZ2lzdGVyRWxlbWVudChcIlNsaWRlQ29udGFpbmVyXCIsICgpID0+IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtc2xpZGVzXCIpLlNsaWRlQ29udGFpbmVyKTtcclxuICBcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiaW1hZ2VyXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvaW1hZ2VyL2ltYWdlci5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9pbWFnZXIvaW1hZ2VyLmNzc1wiXSxcclxuICBwcm92aWRlcnM6IFtdXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlckNvbXBvbmVudCB7XHJcblxyXG4gIHByaXZhdGUgbGFuZ3VhZ2U7XHJcbiAgcHJpdmF0ZSBob3N0O1xyXG4gIHByaXZhdGUgdXNlcm5hbWU7XHJcbiAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICBwcml2YXRlIHJvb3RkaXI7XHJcbiAgcHJpdmF0ZSBoZWFkZXJzOyAgXHJcblxyXG4gIHB1YmxpYyBpbWFnZXM6IEFycmF5PGFueT4gPSBbXTtcclxuXHJcbiAgQFZpZXdDaGlsZChcInNsaWRlQ29udGFpbmVyXCIpIHNsaWRlQ29udGFpbmVyVmlldzogRWxlbWVudFJlZjtcclxuICBcclxuICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXHJcbiAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcclxuICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgIHByaXZhdGUgdXRpbDogVXRpbCxcclxuICAgIHByaXZhdGUgY2FjaGU6IEdhbGxlcnlDYWNoZSxcclxuICAgIHByaXZhdGUgbG9hZGVyOiBMb2FkZXJcclxuICApICB7IFxyXG5cclxuICAgIHRoaXMubGFuZ3VhZ2UgPSBQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2U7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZyhcImVuXCIpO1xyXG4gICAgdGhpcy50cmFuc2xhdGUudXNlKFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZS5zcGxpdChcIi1cIilbMF0pO1xyXG4gXHJcbiAgICB0aGlzLmhvc3QgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0XCIpO1xyXG4gICAgdGhpcy51c2VybmFtZSA9IFNldHRpbmdzLmdldFN0cmluZyhcInVzZXJuYW1lXCIpO1xyXG4gICAgdGhpcy5wYXNzd29yZCA9IFNldHRpbmdzLmdldFN0cmluZyhcInBhc3N3b3JkXCIpO1xyXG4gICAgdGhpcy5yb290ZGlyID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicm9vdGRpclwiKTsgIFxyXG4gICAgdGhpcy5yb290ZGlyID0gKHRoaXMucm9vdGRpcj09bnVsbCk/IFwiXCI6dGhpcy5yb290ZGlyO1xyXG4gICAgdGhpcy5oZWFkZXJzID0geyBcclxuICAgICAgXCJPQ1MtQVBJUkVRVUVTVFwiOiBcInRydWVcIixcclxuICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmFzaWMgXCIrQmFzZTY0LmVuY29kZSh0aGlzLnVzZXJuYW1lKyc6Jyt0aGlzLnBhc3N3b3JkKVxyXG4gICAgfSBcclxuICAgXHJcbiAgfVxyXG4gXHJcbiAgbmdPbkluaXQoKSB7ICAgIFxyXG4gICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IGZhbHNlOyAgICAgICBcclxuICAgIHRoaXMuYnVpbGRTbGlkZXIoKTtcclxuXHJcbiAgICBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xyXG4gICAgICBhcHBsaWNhdGlvbi5hbmRyb2lkLm9uKFxyXG4gICAgICAgICAgQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgXHJcbiAgICAgICAgICAoZGF0YTogQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEpID0+IHtcclxuICAgICAgICAgICAgICBkYXRhLmNhbmNlbCA9IHRydWU7IC8vIHByZXZlbnRzIGRlZmF1bHQgYmFjayBidXR0b24gYmVoYXZpb3JcclxuICAgICAgICAgICAgICB0aGlzLmJhY2soKTtcclxuICAgICAgICAgIH0gXHJcbiAgICAgICk7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNlYXJjaCBwb3NpdGlvbiBvZiBzZWxlY3RlZCBpbWFnZVxyXG4gICAgbGV0IGsgPSAwO1xyXG4gICAgbGV0IGN1cnJlbnRJbWFnZUluZGV4ID0gMDtcclxuICAgIGxldCBjdXJyZW50SW1hZ2VVcmwgPSB0aGlzLmNhY2hlLmN1cnJlbnRJbWFnZS51cmw7XHJcbiAgICBmb3IobGV0IGkgaW4gdGhpcy5jYWNoZS5jdXJyZW50QWxidW0uaXRlbXMpIHtcclxuICAgICAgbGV0IGltZyA9IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLml0ZW1zW2ldO1xyXG4gICAgICBpZihpbWcudXJsPT1jdXJyZW50SW1hZ2VVcmwpIHtcclxuICAgICAgICBjdXJyZW50SW1hZ2VJbmRleCA9IGs7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgaysrO1xyXG4gICAgfVxyXG4gXHJcbiAgICBzZXRUaW1lb3V0KCgpPT57IFxyXG4gICAgICBsZXQgc2xpZGVDb250YWluZXIgPSB0aGlzLnNsaWRlQ29udGFpbmVyVmlldy5uYXRpdmVFbGVtZW50O1xyXG4gICAgICBzbGlkZUNvbnRhaW5lci5jb25zdHJ1Y3RWaWV3KCk7ICAgIFxyXG4gICAgICBzbGlkZUNvbnRhaW5lci5nb1RvU2xpZGUoY3VycmVudEltYWdlSW5kZXgpO1xyXG4gICAgfSwgMTApOyAgICAgXHJcbiAgfSAgICBcclxuXHJcbiAgYmFjaygpIHsgXHJcbiAgICB0aGlzLnV0aWwubmF2aWdhdGVCYWNrKCk7XHJcbiAgfVxyXG5cclxuICBcclxuICBidWlsZFNsaWRlcigpIHtcclxuICAgIGZvcihsZXQgaSBpbiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5pdGVtcykge1xyXG4gICAgICBsZXQgaW1hZ2UgPSB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5pdGVtc1tpXTtcclxuICAgICAgdGhpcy5pbWFnZXMucHVzaChpbWFnZSk7XHJcbiAgICB9ICAgICAgIFxyXG4gIH1cclxuICAgXHJcbiAgXHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHsgICAgICAgXHJcbiAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgLy8gbG9hZCBoaWdoIHJlc29sdXRpb24gaW1hZ2UgaW4gYmFja2dyb3VuZFxyXG4gICAgLy9jb25zb2xlLmxvZyhcIkltYWdlIExvYWRpbmc6IFwiICsgdGhpcy5pdGVtLnVybCArIFwiLzUwMC81MDBcIik7XHJcblxyXG4gICAgLypcclxuICAgIGlmKCF0aGlzLml0ZW0ubG9hZGVkKSB7XHJcbiAgICAgIEh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgICB1cmw6IHRoaXMuaXRlbS51cmwgKyBcIi81MDAvNTAwXCIsXHJcbiAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnNcclxuICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuXHJcbiAgICAgICAgICByZXNwb25zZS5jb250ZW50LnRvSW1hZ2UoKVxyXG4gICAgICAgICAgICAudGhlbigoaW1hZ2UpPT4ge1xyXG4gICAgICAgICAgICAgIGxldCBiYXNlNjQgPSBpbWFnZS50b0Jhc2U2NFN0cmluZyhcImpwZ1wiKTtcclxuICAgICAgICAgICAgICBsZXQgaGlnaHNyYyA9IGJhc2U2NDtcclxuICAgICAgICAgICAgICB0aGlzLml0ZW0uc3JjID0gaGlnaHNyYztcclxuICAgICAgICAgICAgICB0aGlzLml0ZW0ubG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5pbWFnZXNbMF0uc3JjID0gaGlnaHNyYztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PiB7XHJcbiAgICAgICAgICAgICAgLy91dGlsLmxvZyhcImVycm9yXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgfSk7ICBcclxuXHJcbiAgICAgIH0sIChlKT0+IHtcclxuICAgICAgICAgIC8vVG9hc3QubWFrZVRleHQoXCJTaSDDqCB2ZXJpZmljYXRvIHVuIHByb2JsZW1hIGR1cmFudGUgaWwgY2FyaWNhbWVudG8gZGVsbCdpbW1hZ2luZSBhZCBhbHRhIHJpc29sdXppb25lXCIpLnNob3coKTtcclxuICAgICAgfSk7ICAgICAgIFxyXG4gICAgfVxyXG4gICAgKi9cclxuICB9XHJcblxyXG4gIG9uVGFwKGl0ZW0pIHsgXHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VTb3VyY2UoKTtcclxuICAgIGltYWdlLmxvYWRGcm9tQmFzZTY0KGl0ZW0uc3JjKTtcclxuICAgIFNvY2lhbFNoYXJlLnNoYXJlSW1hZ2UoaW1hZ2UsIHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJTaGFyZVwiKSArIFwiIFwiICsgaXRlbS50aXRsZSk7ICBcclxuICB9IFxyXG5cclxuICBvblN3aXBlKGV2ZW50LCBpdGVtKSB7XHJcbiAgICB0aGlzLnV0aWwubG9nKFwib25TbGlkZVwiLCBldmVudCk7XHJcbiAgfVxyXG4gXHJcbn1cclxuIl19