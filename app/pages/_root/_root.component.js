"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var util_1 = require("../../common/util");
var RootComponent = /** @class */ (function () {
    function RootComponent(page, util) {
        this.page = page;
        this.util = util;
    }
    RootComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = false;
    };
    RootComponent = __decorate([
        core_1.Component({
            selector: "root",
            templateUrl: "pages/_root/_root.html",
            styleUrls: ["pages/_root/_root-common.css"],
            providers: [util_1.Util]
        }),
        __metadata("design:paramtypes", [page_1.Page,
            util_1.Util])
    ], RootComponent);
    return RootComponent;
}());
exports.RootComponent = RootComponent;
