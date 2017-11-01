"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GalleryItem = /** @class */ (function () {
    function GalleryItem(nodeid, data, title, description, path, src, url, loaded, mtime, owner, 
        // album attributes
        isAlbum, items, totAlbums, totImages) {
        if (data === void 0) { data = ""; }
        if (title === void 0) { title = ""; }
        if (description === void 0) { description = ""; }
        if (path === void 0) { path = ""; }
        if (src === void 0) { src = ""; }
        if (url === void 0) { url = ""; }
        if (loaded === void 0) { loaded = false; }
        if (mtime === void 0) { mtime = ""; }
        if (owner === void 0) { owner = ""; }
        if (isAlbum === void 0) { isAlbum = false; }
        if (items === void 0) { items = null; }
        if (totAlbums === void 0) { totAlbums = 0; }
        if (totImages === void 0) { totImages = 0; }
        this.nodeid = nodeid;
        this.data = data;
        this.title = title;
        this.description = description;
        this.path = path;
        this.src = src;
        this.url = url;
        this.loaded = loaded;
        this.mtime = mtime;
        this.owner = owner;
        this.isAlbum = isAlbum;
        this.items = items;
        this.totAlbums = totAlbums;
        this.totImages = totImages;
    }
    return GalleryItem;
}());
exports.GalleryItem = GalleryItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2FsbGVyeS5pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFDSSxxQkFDVyxNQUFlLEVBQ2YsSUFBYSxFQUNiLEtBQWtCLEVBQ2xCLFdBQXdCLEVBQ3hCLElBQWdCLEVBQ2hCLEdBQWdCLEVBQ2hCLEdBQWdCLEVBQ2hCLE1BQXVCLEVBQ3ZCLEtBQWtCLEVBQ2xCLEtBQWtCO1FBRXpCLG1CQUFtQjtRQUNaLE9BQXdCLEVBQ3hCLEtBQWdDLEVBQ2hDLFNBQXFCLEVBQ3JCLFNBQXFCO1FBZHJCLHFCQUFBLEVBQUEsU0FBYTtRQUNiLHNCQUFBLEVBQUEsVUFBa0I7UUFDbEIsNEJBQUEsRUFBQSxnQkFBd0I7UUFDeEIscUJBQUEsRUFBQSxTQUFnQjtRQUNoQixvQkFBQSxFQUFBLFFBQWdCO1FBQ2hCLG9CQUFBLEVBQUEsUUFBZ0I7UUFDaEIsdUJBQUEsRUFBQSxjQUF1QjtRQUN2QixzQkFBQSxFQUFBLFVBQWtCO1FBQ2xCLHNCQUFBLEVBQUEsVUFBa0I7UUFHbEIsd0JBQUEsRUFBQSxlQUF3QjtRQUN4QixzQkFBQSxFQUFBLFlBQWdDO1FBQ2hDLDBCQUFBLEVBQUEsYUFBcUI7UUFDckIsMEJBQUEsRUFBQSxhQUFxQjtRQWZyQixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQ2YsU0FBSSxHQUFKLElBQUksQ0FBUztRQUNiLFVBQUssR0FBTCxLQUFLLENBQWE7UUFDbEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixRQUFHLEdBQUgsR0FBRyxDQUFhO1FBQ2hCLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFDaEIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFDdkIsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUNsQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBR2xCLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQTJCO1FBQ2hDLGNBQVMsR0FBVCxTQUFTLENBQVk7UUFDckIsY0FBUyxHQUFULFNBQVMsQ0FBWTtJQUM3QixDQUFDO0lBQ1Isa0JBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBbkJZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEdhbGxlcnlJdGVtIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBub2RlaWQ/OiBzdHJpbmcsXHJcbiAgICAgICAgcHVibGljIGRhdGE6IHt9ID0gXCJcIixcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCIsIFxyXG4gICAgICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJcIiwgXHJcbiAgICAgICAgcHVibGljIHBhdGg6c3RyaW5nID0gXCJcIixcclxuICAgICAgICBwdWJsaWMgc3JjOiBzdHJpbmcgPSBcIlwiLFxyXG4gICAgICAgIHB1YmxpYyB1cmw6IHN0cmluZyA9IFwiXCIsICAgICAgICBcclxuICAgICAgICBwdWJsaWMgbG9hZGVkOiBib29sZWFuID0gZmFsc2UsIFxyXG4gICAgICAgIHB1YmxpYyBtdGltZTogc3RyaW5nID0gXCJcIiwgXHJcbiAgICAgICAgcHVibGljIG93bmVyOiBzdHJpbmcgPSBcIlwiLFxyXG5cclxuICAgICAgICAvLyBhbGJ1bSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgcHVibGljIGlzQWxidW06IGJvb2xlYW4gPSBmYWxzZSxcclxuICAgICAgICBwdWJsaWMgaXRlbXM6IEFycmF5PEdhbGxlcnlJdGVtPiA9IG51bGwsICAgICAgICBcclxuICAgICAgICBwdWJsaWMgdG90QWxidW1zOiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyB0b3RJbWFnZXM6IG51bWJlciA9IDBcclxuICAgICkge31cclxufSJdfQ==