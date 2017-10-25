"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var util_1 = require("../../common/util");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var LoaderComponent = /** @class */ (function () {
    function LoaderComponent(page, translate, fonticon, util, modalService, vcRef) {
        this.page = page;
        this.translate = translate;
        this.fonticon = fonticon;
        this.util = util;
        this.modalService = modalService;
        this.vcRef = vcRef;
        this.language = Platform.device.language;
        this.translate.setDefaultLang("en");
        this.translate.use(Platform.device.language.split("-")[0]);
    }
    LoaderComponent_1 = LoaderComponent;
    LoaderComponent.prototype.ngOnInit = function () {
    };
    LoaderComponent.prototype.ngAfterViewInit = function () {
    };
    LoaderComponent.prototype.showLoader = function (msg) {
        var options = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modalService.showModal(LoaderComponent_1, options)
            .then(function (result) {
        });
    };
    LoaderComponent.prototype.hideLoader = function () {
        /*
          this.params.closeCallback({
            "close": true
          });
        */
    };
    LoaderComponent.prototype.onTouchEffect = function (e) {
        if (e.type = "tap" && e.action == "down") {
            e.view.style.opacity = "0.5";
        }
        if (e.type = "tap" && e.action == "up") {
            e.view.style.opacity = "1";
        }
    };
    LoaderComponent = LoaderComponent_1 = __decorate([
        core_1.Component({
            selector: "loader",
            templateUrl: "components/loader/loader.html",
            styleUrls: ["components/loader/loader.css"],
            providers: [modal_dialog_1.ModalDialogService]
        }),
        __metadata("design:paramtypes", [page_1.Page,
            ng2_translate_1.TranslateService,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            util_1.Util,
            modal_dialog_1.ModalDialogService,
            core_1.ViewContainerRef])
    ], LoaderComponent);
    return LoaderComponent;
    var LoaderComponent_1;
}());
exports.LoaderComponent = LoaderComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBK0I7QUFDL0Isc0NBQW9FO0FBQ3BFLDBDQUF5QztBQUN6QyxrRUFBdUU7QUFFdkUsbUNBQXFDO0FBQ3JDLCtDQUFpRDtBQUNqRCx1RUFBK0Q7QUFZL0Q7SUFJRSx5QkFDVSxJQUFVLEVBQ1YsU0FBMkIsRUFDM0IsUUFBNEIsRUFDNUIsSUFBVSxFQUNWLFlBQWdDLEVBQ2hDLEtBQXVCO1FBTHZCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBRy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQzt3QkFoQlUsZUFBZTtJQWtCMUIsa0NBQVEsR0FBUjtJQUNBLENBQUM7SUFFRCx5Q0FBZSxHQUFmO0lBRUEsQ0FBQztJQUVELG9DQUFVLEdBQVYsVUFBVyxHQUFHO1FBQ1osSUFBSSxPQUFPLEdBQUc7WUFDWixPQUFPLEVBQUUsRUFDUjtZQUNELFVBQVUsRUFBRSxLQUFLO1lBQ2pCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLO1NBQzdCLENBQUM7UUFFRixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxpQkFBZSxFQUFFLE9BQU8sQ0FBQzthQUNwRCxJQUFJLENBQUMsVUFBQyxNQUFXO1FBRWxCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9DQUFVLEdBQVY7UUFDRTs7OztVQUlFO0lBQ0osQ0FBQztJQUVELHVDQUFhLEdBQWIsVUFBYyxDQUFDO1FBQ1gsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDakMsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQy9CLENBQUM7SUFDTCxDQUFDO0lBdERVLGVBQWU7UUFSM0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFdBQVcsRUFBRSwrQkFBK0I7WUFDNUMsU0FBUyxFQUFFLENBQUMsOEJBQThCLENBQUM7WUFDM0MsU0FBUyxFQUFFLENBQUMsaUNBQWtCLENBQUM7U0FDaEMsQ0FBQzt5Q0FRZ0IsV0FBSTtZQUNDLGdDQUFnQjtZQUNqQiw4Q0FBa0I7WUFDdEIsV0FBSTtZQUNJLGlDQUFrQjtZQUN6Qix1QkFBZ0I7T0FWdEIsZUFBZSxDQXdEM0I7SUFBRCxzQkFBQzs7Q0FBQSxBQXhERCxJQXdEQztBQXhEWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0aWxcIjtcclxuaW1wb3J0IHsgTW9kYWxEaWFsb2dTZXJ2aWNlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xyXG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xyXG5pbXBvcnQgKiBhcyBQbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5cclxuIFxyXG4gXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcImxvYWRlclwiLFxyXG4gIHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbG9hZGVyL2xvYWRlci5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJjb21wb25lbnRzL2xvYWRlci9sb2FkZXIuY3NzXCJdLFxyXG4gIHByb3ZpZGVyczogW01vZGFsRGlhbG9nU2VydmljZV1cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZGVyQ29tcG9uZW50IHtcclxuXHJcbiAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGZvbnRpY29uOiBUTlNGb250SWNvblNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICBwcml2YXRlIG1vZGFsU2VydmljZTogTW9kYWxEaWFsb2dTZXJ2aWNlLCBcclxuICAgIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsICAgIFxyXG4gICkgIHtcclxuXHJcbiAgICB0aGlzLmxhbmd1YWdlID0gUGxhdGZvcm0uZGV2aWNlLmxhbmd1YWdlO1xyXG4gICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoXCJlblwiKTtcclxuICAgIHRoaXMudHJhbnNsYXRlLnVzZShQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdKTtcclxuICB9XHJcbiBcclxuICBuZ09uSW5pdCgpIHsgICAgXHJcbiAgfSAgICBcclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkgeyAgXHJcblxyXG4gIH1cclxuXHJcbiAgc2hvd0xvYWRlcihtc2cpIHtcclxuICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICBjb250ZXh0OiB7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bGxzY3JlZW46IGZhbHNlLFxyXG4gICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZjUmVmXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubW9kYWxTZXJ2aWNlLnNob3dNb2RhbChMb2FkZXJDb21wb25lbnQsIG9wdGlvbnMpXHJcbiAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHsgXHJcblxyXG4gICAgfSk7IFxyXG4gIH1cclxuXHJcbiAgaGlkZUxvYWRlcigpIHtcclxuICAgIC8qXHJcbiAgICAgIHRoaXMucGFyYW1zLmNsb3NlQ2FsbGJhY2soe1xyXG4gICAgICAgIFwiY2xvc2VcIjogdHJ1ZVxyXG4gICAgICB9KTsgXHJcbiAgICAqL1xyXG4gIH1cclxuXHJcbiAgb25Ub3VjaEVmZmVjdChlKSB7XHJcbiAgICAgIGlmKGUudHlwZT1cInRhcFwiICYmIGUuYWN0aW9uPT1cImRvd25cIikgeyBcclxuICAgICAgICAgIGUudmlldy5zdHlsZS5vcGFjaXR5ID0gXCIwLjVcIjsgXHJcbiAgICAgIH0gXHJcbiAgICAgIGlmKGUudHlwZT1cInRhcFwiICYmIGUuYWN0aW9uPT1cInVwXCIpIHsgXHJcbiAgICAgICAgICBlLnZpZXcuc3R5bGUub3BhY2l0eSA9IFwiMVwiOyBcclxuICAgICAgfSAgICAgICBcclxuICB9ICBcclxuIFxyXG59XHJcbiJdfQ==