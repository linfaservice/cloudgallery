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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2FsbGVyeS5pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFDSSxxQkFDVyxNQUFlLEVBQ2YsT0FBd0IsRUFDeEIsS0FBZ0MsRUFDaEMsSUFBYSxFQUNiLEtBQWtCLEVBQ2xCLFdBQXdCLEVBQ3hCLElBQWdCLEVBQ2hCLEdBQWdCLEVBQ2hCLEdBQWdCLEVBQ2hCLE1BQXVCLEVBQ3ZCLEtBQWtCLEVBQ2xCLEtBQWtCLEVBQ2xCLFFBQXFCLEVBQ3JCLFNBQXNCO1FBWnRCLHdCQUFBLEVBQUEsZUFBd0I7UUFDeEIsc0JBQUEsRUFBQSxZQUFnQztRQUNoQyxxQkFBQSxFQUFBLFNBQWE7UUFDYixzQkFBQSxFQUFBLFVBQWtCO1FBQ2xCLDRCQUFBLEVBQUEsZ0JBQXdCO1FBQ3hCLHFCQUFBLEVBQUEsU0FBZ0I7UUFDaEIsb0JBQUEsRUFBQSxRQUFnQjtRQUNoQixvQkFBQSxFQUFBLFFBQWdCO1FBQ2hCLHVCQUFBLEVBQUEsY0FBdUI7UUFDdkIsc0JBQUEsRUFBQSxVQUFrQjtRQUNsQixzQkFBQSxFQUFBLFVBQWtCO1FBQ2xCLHlCQUFBLEVBQUEsYUFBcUI7UUFDckIsMEJBQUEsRUFBQSxjQUFzQjtRQWJ0QixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQ2YsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBMkI7UUFDaEMsU0FBSSxHQUFKLElBQUksQ0FBUztRQUNiLFVBQUssR0FBTCxLQUFLLENBQWE7UUFDbEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixRQUFHLEdBQUgsR0FBRyxDQUFhO1FBQ2hCLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFDaEIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFDdkIsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUNsQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQ2xCLGFBQVEsR0FBUixRQUFRLENBQWE7UUFDckIsY0FBUyxHQUFULFNBQVMsQ0FBYTtJQUNqQyxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQUFDLEFBakJELElBaUJDO0FBakJZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEdhbGxlcnlJdGVtIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBub2RlaWQ/OiBzdHJpbmcsXHJcbiAgICAgICAgcHVibGljIGlzQWxidW06IGJvb2xlYW4gPSBmYWxzZSwgXHJcbiAgICAgICAgcHVibGljIGl0ZW1zOiBBcnJheTxHYWxsZXJ5SXRlbT4gPSBudWxsLFxyXG4gICAgICAgIHB1YmxpYyBkYXRhOiB7fSA9IFwiXCIsXHJcbiAgICAgICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiLCBcclxuICAgICAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiXCIsIFxyXG4gICAgICAgIHB1YmxpYyBwYXRoOnN0cmluZyA9IFwiXCIsXHJcbiAgICAgICAgcHVibGljIHNyYzogc3RyaW5nID0gXCJcIixcclxuICAgICAgICBwdWJsaWMgdXJsOiBzdHJpbmcgPSBcIlwiLCAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGxvYWRlZDogYm9vbGVhbiA9IGZhbHNlLCBcclxuICAgICAgICBwdWJsaWMgbXRpbWU6IHN0cmluZyA9IFwiXCIsIFxyXG4gICAgICAgIHB1YmxpYyBvd25lcjogc3RyaW5nID0gXCJcIixcclxuICAgICAgICBwdWJsaWMgdG90QWxidW06IHN0cmluZyA9IFwiXCIsXHJcbiAgICAgICAgcHVibGljIHRvdEltYWdlczogc3RyaW5nID0gXCJcIikge1xyXG4gICAgfVxyXG59Il19