"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gallery_item_1 = require("./gallery.item");
var GalleryCache = /** @class */ (function () {
    function GalleryCache() {
        this.items = new Array();
        this.currentAlbum = new gallery_item_1.GalleryItem();
        this.currentAlbum.isAlbum = true;
        this.currentImage = new gallery_item_1.GalleryItem();
        this.currentImage.isAlbum = false;
        this.history = new Array();
    }
    GalleryCache = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], GalleryCache);
    return GalleryCache;
}());
exports.default = GalleryCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdhbGxlcnkuY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsK0NBQTZDO0FBSTdDO0lBT0k7UUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFlLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLDBCQUFXLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLDBCQUFXLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssRUFBZSxDQUFDO0lBQzVDLENBQUM7SUFkZ0IsWUFBWTtRQURoQyxpQkFBVSxFQUFFOztPQUNRLFlBQVksQ0FlaEM7SUFBRCxtQkFBQztDQUFBLEFBZkQsSUFlQztrQkFmb0IsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgR2FsbGVyeUl0ZW0gfSBmcm9tIFwiLi9nYWxsZXJ5Lml0ZW1cIjtcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbGxlcnlDYWNoZSB7XHJcblxyXG4gICAgcHVibGljIGl0ZW1zOkFycmF5PEdhbGxlcnlJdGVtPjtcclxuICAgIHB1YmxpYyBjdXJyZW50QWxidW06R2FsbGVyeUl0ZW07IFxyXG4gICAgcHVibGljIGN1cnJlbnRJbWFnZTpHYWxsZXJ5SXRlbTsgIFxyXG4gICAgcHVibGljIGhpc3Rvcnk6QXJyYXk8R2FsbGVyeUl0ZW0+OyAgICBcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRBbGJ1bSA9IG5ldyBHYWxsZXJ5SXRlbSgpOyBcclxuICAgICAgICB0aGlzLmN1cnJlbnRBbGJ1bS5pc0FsYnVtID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbWFnZSA9IG5ldyBHYWxsZXJ5SXRlbSgpOyAgXHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW1hZ2UuaXNBbGJ1bSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaGlzdG9yeSA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgIH1cclxufSJdfQ==