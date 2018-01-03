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
