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
