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
var element_registry_1 = require("nativescript-angular/element-registry");
element_registry_1.registerElement("Slide", function () { return require("nativescript-slides").Slide; });
element_registry_1.registerElement("SlideContainer", function () { return require("nativescript-slides").SlideContainer; });
var ImageModalComponent = /** @class */ (function () {
    function ImageModalComponent(params, page, translate, fonticon, util) {
        this.params = params;
        this.page = page;
        this.translate = translate;
        this.fonticon = fonticon;
        this.util = util;
        this.message_class = "";
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
        this.item = params.context.item;
        this.loader = params.context.loader;
    }
    ImageModalComponent.prototype.ngOnInit = function () {
        this.buildSlider();
    };
    ImageModalComponent.prototype.buildSlider = function () {
        this.images.push({
            title: 'image 1',
            source: 'data:image/jpg;base64,' + this.item.src
        });
        this.images.push({
            title: 'image 2',
            source: 'data:image/jpg;base64,' + this.item.src
        });
        this.images.push({
            title: 'image 3',
            source: 'data:image/jpg;base64,' + this.item.src
        });
    };
    ImageModalComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.loader.hideLoader();
        //let SlidesXml = this.slides.nativeElement;
        //SlidesXml.constructView();    
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
                    _this.images[0].src = highsrc;
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
    ImageModalComponent.prototype.onSwipe = function (args) {
        this.util.log("Message", "swipe " + args.direction);
        if (args.direction == 1)
            this.message_class = "swipe_out_right";
        if (args.direction == 2)
            this.message_class = "swipe_out_left";
    };
    __decorate([
        core_1.ViewChild("slides"),
        __metadata("design:type", core_1.ElementRef)
    ], ImageModalComponent.prototype, "slides", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtbW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW1hZ2UtbW9kYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUF5RTtBQUN6RSwwQ0FBeUM7QUFDekMsbUVBQTRFO0FBRzVFLDRDQUE4QztBQUM5Qyx1REFBeUQ7QUFDekQsNkNBQTJDO0FBQzNDLG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsK0NBQWlEO0FBQ2pELGdDQUFtQztBQUNuQyx1RUFBK0Q7QUFFL0QsMEVBQXNFO0FBQ3RFLGtDQUFlLENBQUMsT0FBTyxFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLEVBQXBDLENBQW9DLENBQUMsQ0FBQztBQUNyRSxrQ0FBZSxDQUFDLGdCQUFnQixFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxjQUFjLEVBQTdDLENBQTZDLENBQUMsQ0FBQztBQVV2RjtJQWtCRSw2QkFDVSxNQUF5QixFQUN6QixJQUFVLEVBQ1YsU0FBMkIsRUFDM0IsUUFBNEIsRUFDNUIsSUFBVTtRQUpWLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQ3pCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBWFosa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFHbkIsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQVdsQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxD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Q0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBRSxDQUFDLENBQUM7WUFBQyxJQUFJLENBQUMsYUFBYSxHQUFHLGlCQUFpQixDQUFDO1FBQzdELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUUsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQztJQUM5RCxDQUFDO0lBbkhvQjtRQUFwQixnQkFBUyxDQUFDLFFBQVEsQ0FBQztrQ0FBUyxpQkFBVTt1REFBQztJQWhCN0IsbUJBQW1CO1FBUi9CLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBRSxDQUFDLCtCQUErQixDQUFDO1lBQzVDLFNBQVMsRUFBRSxFQUFFO1NBQ2QsQ0FBQzt5Q0FzQmtCLDJCQUFpQjtZQUNuQixXQUFJO1lBQ0MsZ0NBQWdCO1lBQ2pCLDhDQUFrQjtZQUN0QixXQUFJO09BdkJULG1CQUFtQixDQXFJL0I7SUFBRCwwQkFBQztDQUFBLEFBcklELElBcUlDO0FBcklZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgRWxlbWVudFJlZiwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgeyBNb2RhbERpYWxvZ1BhcmFtcyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9kaXJlY3RpdmVzL2RpYWxvZ3NcIjtcclxuaW1wb3J0IExvYWRlciBmcm9tIFwiLi4vLi4vY29tbW9uL2xvYWRlclwiO1xyXG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xyXG5pbXBvcnQgKiBhcyBIdHRwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIjtcclxuaW1wb3J0ICogYXMgU29jaWFsU2hhcmUgZnJvbSAnbmF0aXZlc2NyaXB0LXNvY2lhbC1zaGFyZSc7XHJcbmltcG9ydCB7IEltYWdlU291cmNlIH0gZnJvbSBcImltYWdlLXNvdXJjZVwiO1xyXG5pbXBvcnQgKiBhcyBQbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XHJcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyAgQmFzZTY0IGZyb20gXCJiYXNlLTY0XCI7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5cclxuaW1wb3J0IHtyZWdpc3RlckVsZW1lbnR9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5XCI7XHJcbnJlZ2lzdGVyRWxlbWVudChcIlNsaWRlXCIsICgpID0+IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtc2xpZGVzXCIpLlNsaWRlKTtcclxucmVnaXN0ZXJFbGVtZW50KFwiU2xpZGVDb250YWluZXJcIiwgKCkgPT4gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1zbGlkZXNcIikuU2xpZGVDb250YWluZXIpO1xyXG4gXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcImltYWdlbW9kYWxcIixcclxuICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9nYWxsZXJ5L2ltYWdlLW1vZGFsLmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcInBhZ2VzL2dhbGxlcnkvaW1hZ2UtbW9kYWwuY3NzXCJdLFxyXG4gIHByb3ZpZGVyczogW11cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VNb2RhbENvbXBvbmVudCB7XHJcblxyXG4gIHByaXZhdGUgbGFuZ3VhZ2U7XHJcbiAgcHJpdmF0ZSBob3N0O1xyXG4gIHByaXZhdGUgdXNlcm5hbWU7XHJcbiAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICBwcml2YXRlIHJvb3RkaXI7XHJcbiAgcHJpdmF0ZSBoZWFkZXJzOyAgXHJcblxyXG4gIHByaXZhdGUgaXRlbTsgXHJcbiAgcHJpdmF0ZSBsb2FkZXI7XHJcblxyXG4gIHByaXZhdGUgbWVzc2FnZV9jbGFzcyA9IFwiXCI7XHJcblxyXG5cclxuICBwcml2YXRlIGltYWdlcyA9IFtdO1xyXG4gIEBWaWV3Q2hpbGQoXCJzbGlkZXNcIikgc2xpZGVzOiBFbGVtZW50UmVmO1xyXG4gIFxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcGFyYW1zOiBNb2RhbERpYWxvZ1BhcmFtcywgXHJcbiAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXHJcbiAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcclxuICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgIHByaXZhdGUgdXRpbDogVXRpbFxyXG4gICkgIHtcclxuXHJcbiAgICB0aGlzLmxhbmd1YWdlID0gUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlO1xyXG4gICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoXCJlblwiKTtcclxuICAgIHRoaXMudHJhbnNsYXRlLnVzZShQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdKTtcclxuIFxyXG4gICAgdGhpcy5ob3N0ID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdFwiKTtcclxuICAgIHRoaXMudXNlcm5hbWUgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VybmFtZVwiKTtcclxuICAgIHRoaXMucGFzc3dvcmQgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJwYXNzd29yZFwiKTtcclxuICAgIHRoaXMucm9vdGRpciA9IFNldHRpbmdzLmdldFN0cmluZyhcInJvb3RkaXJcIik7ICBcclxuICAgIHRoaXMucm9vdGRpciA9ICh0aGlzLnJvb3RkaXI9PW51bGwpPyBcIlwiOnRoaXMucm9vdGRpcjtcclxuICAgIHRoaXMuaGVhZGVycyA9IHsgXHJcbiAgICAgIFwiT0NTLUFQSVJFUVVFU1RcIjogXCJ0cnVlXCIsXHJcbiAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJhc2ljIFwiK0Jhc2U2NC5lbmNvZGUodGhpcy51c2VybmFtZSsnOicrdGhpcy5wYXNzd29yZClcclxuICAgIH0gXHJcblxyXG4gICAgdGhpcy5pdGVtID0gcGFyYW1zLmNvbnRleHQuaXRlbTtcclxuICAgIHRoaXMubG9hZGVyID0gcGFyYW1zLmNvbnRleHQubG9hZGVyO1xyXG4gICBcclxuICB9XHJcbiBcclxuICBuZ09uSW5pdCgpIHsgICAgXHJcbiAgICB0aGlzLmJ1aWxkU2xpZGVyKCk7ICBcclxuICB9ICAgIFxyXG5cclxuICBidWlsZFNsaWRlcigpIHtcclxuICAgIHRoaXMuaW1hZ2VzLnB1c2goXHJcbiAgICAgIHtcclxuICAgICAgICAgIHRpdGxlOiAnaW1hZ2UgMScsXHJcbiAgICAgICAgICBzb3VyY2U6ICdkYXRhOmltYWdlL2pwZztiYXNlNjQsJyArIHRoaXMuaXRlbS5zcmNcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIHRoaXMuaW1hZ2VzLnB1c2goXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aXRsZTogJ2ltYWdlIDInLFxyXG4gICAgICAgICAgICBzb3VyY2U6ICdkYXRhOmltYWdlL2pwZztiYXNlNjQsJyArIHRoaXMuaXRlbS5zcmNcclxuICAgICAgICB9XHJcbiAgICApO1xyXG4gICAgdGhpcy5pbWFnZXMucHVzaChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnaW1hZ2UgMycsXHJcbiAgICAgICAgICAgIHNvdXJjZTogJ2RhdGE6aW1hZ2UvanBnO2Jhc2U2NCwnICsgdGhpcy5pdGVtLnNyY1xyXG4gICAgICAgIH1cclxuICAgICk7ICAgIFxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkgeyAgXHJcbiAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgLy9sZXQgU2xpZGVzWG1sID0gdGhpcy5zbGlkZXMubmF0aXZlRWxlbWVudDtcclxuICAgIC8vU2xpZGVzWG1sLmNvbnN0cnVjdFZpZXcoKTsgICAgXHJcblxyXG4gICAgLy8gbG9hZCBoaWdoIHJlc29sdXRpb24gaW1hZ2UgaW4gYmFja2dyb3VuZFxyXG4gICAgLy9jb25zb2xlLmxvZyhcIkltYWdlIExvYWRpbmc6IFwiICsgdGhpcy5pdGVtLnVybCArIFwiLzUwMC81MDBcIik7XHJcblxyXG4gICAgaWYoIXRoaXMuaXRlbS5sb2FkZWQpIHtcclxuICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgIHVybDogdGhpcy5pdGVtLnVybCArIFwiLzUwMC81MDBcIixcclxuICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVyc1xyXG4gICAgICB9KS50aGVuKChyZXNwb25zZTphbnkpPT4ge1xyXG5cclxuICAgICAgICAgIHJlc3BvbnNlLmNvbnRlbnQudG9JbWFnZSgpXHJcbiAgICAgICAgICAgIC50aGVuKChpbWFnZSk9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IGJhc2U2NCA9IGltYWdlLnRvQmFzZTY0U3RyaW5nKFwianBnXCIpO1xyXG4gICAgICAgICAgICAgIGxldCBoaWdoc3JjID0gYmFzZTY0O1xyXG4gICAgICAgICAgICAgIHRoaXMuaXRlbS5zcmMgPSBoaWdoc3JjO1xyXG4gICAgICAgICAgICAgIHRoaXMuaXRlbS5sb2FkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLmltYWdlc1swXS5zcmMgPSBoaWdoc3JjO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+IHtcclxuICAgICAgICAgICAgICAvL3V0aWwubG9nKFwiZXJyb3JcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTsgIFxyXG5cclxuICAgICAgfSwgKGUpPT4ge1xyXG4gICAgICAgICAgLy9Ub2FzdC5tYWtlVGV4dChcIlNpIMOoIHZlcmlmaWNhdG8gdW4gcHJvYmxlbWEgZHVyYW50ZSBpbCBjYXJpY2FtZW50byBkZWxsJ2ltbWFnaW5lIGFkIGFsdGEgcmlzb2x1emlvbmVcIikuc2hvdygpO1xyXG4gICAgICB9KTsgICAgICAgXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2UoKSB7XHJcbiAgICAgIHRoaXMucGFyYW1zLmNsb3NlQ2FsbGJhY2soe1xyXG4gICAgICAgIFwiY2xvc2VcIjogdHJ1ZVxyXG4gICAgICB9KTsgXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25Ub3VjaEVmZmVjdChlKSB7XHJcbiAgICAgIGlmKGUudHlwZT1cInRhcFwiICYmIGUuYWN0aW9uPT1cImRvd25cIikgeyBcclxuICAgICAgICAgIGUudmlldy5zdHlsZS5vcGFjaXR5ID0gXCIwLjVcIjsgXHJcbiAgICAgIH0gXHJcbiAgICAgIGlmKGUudHlwZT1cInRhcFwiICYmIGUuYWN0aW9uPT1cInVwXCIpIHsgXHJcbiAgICAgICAgICBlLnZpZXcuc3R5bGUub3BhY2l0eSA9IFwiMVwiOyBcclxuICAgICAgfSAgICAgICBcclxuICB9ICBcclxuXHJcbiAgb25UYXAoaXRlbSkge1xyXG4gICAgbGV0IGltYWdlID0gbmV3IEltYWdlU291cmNlKCk7XHJcbiAgICBpbWFnZS5sb2FkRnJvbUJhc2U2NChpdGVtLnNyYyk7XHJcblxyXG4gICAgU29jaWFsU2hhcmUuc2hhcmVJbWFnZShpbWFnZSwgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIlNoYXJlXCIpICsgXCIgXCIgKyBpdGVtLnRpdGxlKTsgIFxyXG4gIH1cclxuXHJcbiAgb25Td2lwZShhcmdzKSB7IFxyXG4gICAgdGhpcy51dGlsLmxvZyhcIk1lc3NhZ2VcIiwgXCJzd2lwZSBcIiArIGFyZ3MuZGlyZWN0aW9uKTtcclxuICAgIGlmKGFyZ3MuZGlyZWN0aW9uPT0xKSB0aGlzLm1lc3NhZ2VfY2xhc3MgPSBcInN3aXBlX291dF9yaWdodFwiO1xyXG4gICAgaWYoYXJncy5kaXJlY3Rpb249PTIpIHRoaXMubWVzc2FnZV9jbGFzcyA9IFwic3dpcGVfb3V0X2xlZnRcIjtcclxuICB9ICAgXHJcbiBcclxufVxyXG4iXX0=