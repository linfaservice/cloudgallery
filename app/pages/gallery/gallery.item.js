"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GalleryItem = /** @class */ (function () {
    function GalleryItem(id, isAlbum, title, description, path, src, mtime, owner) {
        this.id = id;
        this.isAlbum = isAlbum;
        this.title = title;
        this.description = description;
        this.path = path;
        this.src = src;
        this.mtime = mtime;
        this.owner = owner;
    }
    return GalleryItem;
}());
exports.GalleryItem = GalleryItem;
