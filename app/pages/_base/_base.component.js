"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var angular_1 = require("nativescript-telerik-ui-pro/sidedrawer/angular");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var util_1 = require("../../common/util");
var BaseComponent = /** @class */ (function () {
    function BaseComponent(page, util, router, route) {
        this.page = page;
        this.util = util;
        this.util = new util_1.Util(router, route);
        this.pages = [];
    }
    BaseComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = false;
    };
    BaseComponent.prototype.ngAfterViewInit = function () {
        this.drawer = this.drawerComponent.sideDrawer;
    };
    BaseComponent.prototype.onMenuTapped = function (args) {
        this.util.log("Function", "onMenuTapped");
        //...
        this.drawer.closeDrawer();
    };
    BaseComponent.prototype.toggleDrawer = function () {
        this.util.log("Function", "toggleDrawer");
        this.drawer.toggleDrawerState();
    };
    BaseComponent.prototype.home = function () {
        this.util.navigateSection("home");
    };
    __decorate([
        core_1.ViewChild(angular_1.RadSideDrawerComponent),
        __metadata("design:type", angular_1.RadSideDrawerComponent)
    ], BaseComponent.prototype, "drawerComponent", void 0);
    BaseComponent = __decorate([
        core_1.Component({
            selector: "base",
            templateUrl: "pages/_base/_base.html",
            styleUrls: ["pages/_base/_base-common.css"],
            providers: [util_1.Util]
        }),
        __metadata("design:paramtypes", [page_1.Page,
            util_1.Util,
            router_2.RouterExtensions,
            router_1.Router])
    ], BaseComponent);
    return BaseComponent;
}());
exports.BaseComponent = BaseComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2Jhc2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiX2Jhc2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUE2RDtBQUM3RCwwRUFBd0c7QUFDeEcsMENBQXlDO0FBQ3pDLHNEQUErRDtBQUkvRCwwQ0FBeUM7QUFVekM7SUFTSSx1QkFDZ0IsSUFBVSxFQUNWLElBQVUsRUFDbEIsTUFBd0IsRUFDeEIsS0FBYTtRQUhMLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBSXRCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFDWixDQUFDO0lBQ04sQ0FBQztJQUVNLGdDQUFRLEdBQWY7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDdEMsQ0FBQztJQUVNLHVDQUFlLEdBQXRCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQztJQUNsRCxDQUFDO0lBRU0sb0NBQVksR0FBbkIsVUFBb0IsSUFBSTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFaEQsS0FBSztRQUVDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVHLG9DQUFZLEdBQW5CO1FBQ08sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRU0sNEJBQUksR0FBWDtRQUNPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUF2Q0Q7UUFEQyxnQkFBUyxDQUFDLGdDQUFzQixDQUFDO2tDQUNWLGdDQUFzQjswREFBQztJQUx0QyxhQUFhO1FBUHpCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTTtZQUNoQixXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFNBQVMsRUFBRSxDQUFDLDhCQUE4QixDQUFDO1lBQzNDLFNBQVMsRUFBRSxDQUFDLFdBQUksQ0FBQztTQUNsQixDQUFDO3lDQVl3QixXQUFJO1lBQ0osV0FBSTtZQUNWLHlCQUFnQjtZQUNqQixlQUFNO09BYlosYUFBYSxDQThDekI7SUFBRCxvQkFBQztDQUFBLEFBOUNELElBOENDO0FBOUNZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgVmlld0NoaWxkLCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBSYWRTaWRlRHJhd2VyQ29tcG9uZW50LCBTaWRlRHJhd2VyVHlwZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXJpay11aS1wcm8vc2lkZWRyYXdlci9hbmd1bGFyXCI7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgVmlldyB9IGZyb20gJ3VpL2NvcmUvdmlldyc7XHJcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gXCJ1dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsXCI7XHJcblxyXG4gIFxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJiYXNlXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvX2Jhc2UvX2Jhc2UuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvX2Jhc2UvX2Jhc2UtY29tbW9uLmNzc1wiXSxcclxuICBwcm92aWRlcnM6IFtVdGlsXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgIHJvdXRlcjogUm91dGVyRXh0ZW5zaW9ucztcclxuIFxyXG4gICAgQFZpZXdDaGlsZChSYWRTaWRlRHJhd2VyQ29tcG9uZW50KSBcclxuICAgIHB1YmxpYyBkcmF3ZXJDb21wb25lbnQ6IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQ7XHJcbiAgICBwdWJsaWMgZHJhd2VyOiBTaWRlRHJhd2VyVHlwZTtcclxuICAgIHB1YmxpYyBwYWdlczpBcnJheTxPYmplY3Q+O1xyXG4gXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IgKFxyXG4gICAgICAgICAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsIFxyXG4gICAgICAgICAgICBwcml2YXRlIHV0aWw6IFV0aWwsIFxyXG4gICAgICAgICAgICByb3V0ZXI6IFJvdXRlckV4dGVuc2lvbnMsIFxyXG4gICAgICAgICAgICByb3V0ZTogUm91dGVyKSB7XHJcblxyXG4gICAgICAgIHRoaXMudXRpbCA9IG5ldyBVdGlsKHJvdXRlciwgcm91dGUpO1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2VzID0gW1xyXG4gICAgICAgIF07ICAgIFxyXG4gICAgfSBcclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cdFxyXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICB0aGlzLmRyYXdlciA9IHRoaXMuZHJhd2VyQ29tcG9uZW50LnNpZGVEcmF3ZXI7XHJcbiAgICB9XHJcbiBcclxuICAgIHB1YmxpYyBvbk1lbnVUYXBwZWQoYXJncykge1xyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJGdW5jdGlvblwiLCBcIm9uTWVudVRhcHBlZFwiKTtcclxuXHJcblx0XHQvLy4uLlxyXG5cdFx0XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuY2xvc2VEcmF3ZXIoKTsgXHJcbiAgICB9XHJcblx0XHJcblx0cHVibGljIHRvZ2dsZURyYXdlcigpIHtcclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiRnVuY3Rpb25cIiwgXCJ0b2dnbGVEcmF3ZXJcIik7XHJcblx0XHR0aGlzLmRyYXdlci50b2dnbGVEcmF3ZXJTdGF0ZSgpO1xyXG5cdH0gXHJcblx0XHJcblx0cHVibGljIGhvbWUoKSB7XHJcbiAgICAgICAgdGhpcy51dGlsLm5hdmlnYXRlU2VjdGlvbihcImhvbWVcIik7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==