"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GalleryItem = /** @class */ (function () {
    function GalleryItem(nodeid, isAlbum, items, data, title, description, path, src, url, loaded, mtime, owner, totAlbum, totImages) {
        if (isAlbum === void 0) { isAlbum = false; }
        if (items === void 0) { items = null; }
        if (data === void 0) { data = ""; }
        if (title === void 0) { title = ""; }
        if (description === void 0) { description = ""; }
        if (path === void 0) { path = ""; }
        if (src === void 0) { src = ""; }
        if (url === void 0) { url = ""; }
        if (loaded === void 0) { loaded = false; }
        if (mtime === void 0) { mtime = ""; }
        if (owner === void 0) { owner = ""; }
        if (totAlbum === void 0) { totAlbum = ""; }
        if (totImages === void 0) { totImages = ""; }
        this.nodeid = nodeid;
        this.isAlbum = isAlbum;
        this.items = items;
        this.data = data;
        this.title = title;
        this.description = description;
        this.path = path;
        this.src = src;
        this.url = url;
        this.loaded = loaded;
        this.mtime = mtime;
        this.owner = owner;
        this.totAlbum = totAlbum;
        this.totImages = totImages;
    }
    return GalleryItem;
}());
exports.GalleryItem = GalleryItem;
