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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3Jvb3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiX3Jvb3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQStCO0FBQy9CLHNDQUE2RDtBQUc3RCwwQ0FBeUM7QUFVekM7SUFFSSx1QkFDZ0IsSUFBVSxFQUNWLElBQVU7UUFEVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUcxQixDQUFDO0lBRU0sZ0NBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUN0QyxDQUFDO0lBWFEsYUFBYTtRQVB6QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU07WUFDaEIsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQyxTQUFTLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQztZQUMzQyxTQUFTLEVBQUUsQ0FBQyxXQUFJLENBQUM7U0FDbEIsQ0FBQzt5Q0FLd0IsV0FBSTtZQUNKLFdBQUk7T0FKakIsYUFBYSxDQWF6QjtJQUFELG9CQUFDO0NBQUEsQUFiRCxJQWFDO0FBYlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gXCJ1dGlscy91dGlsc1wiO1xyXG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi91dGlsXCI7XHJcblxyXG4gIFxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJyb290XCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvX3Jvb3QvX3Jvb3QuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvX3Jvb3QvX3Jvb3QtY29tbW9uLmNzc1wiXSxcclxuICBwcm92aWRlcnM6IFtVdGlsXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFJvb3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IgKFxyXG4gICAgICAgICAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsIFxyXG4gICAgICAgICAgICBwcml2YXRlIHV0aWw6IFV0aWxcclxuICAgICAgICApIHtcclxuXHJcbiAgICB9IFxyXG5cclxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==