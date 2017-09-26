"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gallery_item_1 = require("./gallery.item");
var GalleryCache = /** @class */ (function () {
    function GalleryCache() {
        this.images = new Array();
        this.currentAlbum = new gallery_item_1.GalleryItem();
        this.history = new Array();
    }
    GalleryCache = __decorate([
        core_1.Injectable()
    ], GalleryCache);
    return GalleryCache;
}());
exports.default = GalleryCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdhbGxlcnkuY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsK0NBQTZDO0FBSTdDO0lBREE7UUFHVyxXQUFNLEdBQUcsSUFBSSxLQUFLLEVBQWUsQ0FBQztRQUNsQyxpQkFBWSxHQUFHLElBQUksMEJBQVcsRUFBRSxDQUFDO1FBQ2pDLFlBQU8sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBRWpDLENBQUM7SUFOb0IsWUFBWTtRQURoQyxpQkFBVSxFQUFFO09BQ1EsWUFBWSxDQU1oQztJQUFELG1CQUFDO0NBQUEsQUFORCxJQU1DO2tCQU5vQixZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBHYWxsZXJ5SXRlbSB9IGZyb20gXCIuL2dhbGxlcnkuaXRlbVwiO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FsbGVyeUNhY2hlIHtcclxuXHJcbiAgICBwdWJsaWMgaW1hZ2VzID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgcHVibGljIGN1cnJlbnRBbGJ1bSA9IG5ldyBHYWxsZXJ5SXRlbSgpOyAgXHJcbiAgICBwdWJsaWMgaGlzdG9yeSA9IG5ldyBBcnJheSgpOyAgICBcclxuICAgIFxyXG59Il19