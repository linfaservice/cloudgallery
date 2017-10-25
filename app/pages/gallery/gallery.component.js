"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var util_1 = require("../../common/util");
var loader_1 = require("../../common/loader");
var gallery_item_1 = require("../../common/gallery.item");
var gallery_cache_1 = require("../../common/gallery.cache");
var Toast = require("nativescript-toast");
var nativescript_ngx_fonticon_1 = require("nativescript-ngx-fonticon");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var image_modal_component_1 = require("./image-modal.component");
var Http = require("tns-core-modules/http");
var listview_1 = require("nativescript-telerik-ui-pro/listview");
var timer = require("timer");
var Settings = require("application-settings");
var Platform = require("platform");
var ng2_translate_1 = require("ng2-translate");
var application_1 = require("application");
var Base64 = require("base-64");
var application = require("application");
var application_2 = require("application");
var dialogs_1 = require("ui/dialogs");
var appversion = require("nativescript-appversion");
var email = require("nativescript-email");
var platform_1 = require("tns-core-modules/platform/platform");
var elementRegistryModule = require("nativescript-angular/element-registry");
elementRegistryModule.registerElement("CardView", function () { return require("nativescript-cardview").CardView; });
var GalleryComponent = /** @class */ (function () {
    function GalleryComponent(page, util, fonticon, modalService, vcRef, translate, cache) {
        var _this = this;
        this.page = page;
        this.util = util;
        this.fonticon = fonticon;
        this.modalService = modalService;
        this.vcRef = vcRef;
        this.translate = translate;
        this.cache = cache;
        /*
        private images = new ObservableArray<ObservableArray<GalleryItem>>();
        private current = new ObservableArray<GalleryItem>();
        private history = new Array();
        */
        //private nodeid;
        //private path;
        //private title;
        this.current = new observable_array_1.ObservableArray();
        this.progressNum = 0;
        this.progressTot = 0;
        this.progressVal = 0;
        this.footer = "";
        this.loader = new loader_1.default();
        //calc dimensions for responsive view
        var nCol1 = Math.floor(platform_1.screen.mainScreen.heightDIPs / 320) * 3;
        var nCol2 = Math.floor(platform_1.screen.mainScreen.widthDIPs / 320) * 3;
        if (nCol1 > nCol2) {
            this.nColMax = nCol1;
            this.nColMin = nCol2;
        }
        else {
            this.nColMax = nCol2;
            this.nColMin = nCol1;
        }
        this.util.log("Responsive columns: ", this.nColMax + " or " + this.nColMin);
        appversion.getVersionName().then(function (v) {
            _this.version = "Version " + v;
        });
        this.language = Platform.device.language;
        this.translate.setDefaultLang("en");
        this.translate.use(Platform.device.language.split("-")[0]).subscribe(function () {
            _this.host = Settings.getString("host");
            _this.username = Settings.getString("username");
            _this.password = Settings.getString("password");
            _this.rootdir = Settings.getString("rootdir");
            _this.rootdir = (_this.rootdir == null) ? "" : _this.rootdir;
            _this.headers = {
                "OCS-APIREQUEST": "true",
                "Authorization": "Basic " + Base64.encode(_this.username + ':' + _this.password)
            };
            _this.cache.images = new Array();
            _this.home();
        });
    }
    GalleryComponent.prototype.onRadListLoaded = function (args) {
        this.radList = args.object;
        this.util.log("View Size: " + this.radList.getMeasuredWidth() + "x" + this.radList.getMeasuredHeight(), null);
        this.util.log("Initial screen orientation: ", platform_1.screen.mainScreen.widthDIPs + "x" + platform_1.screen.mainScreen.heightDIPs);
        if (platform_1.screen.mainScreen.widthDIPs > platform_1.screen.mainScreen.heightDIPs) {
            this.orientation = "landscape";
        }
        else {
            this.orientation = "portrait";
        }
        this.updateView();
    };
    GalleryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = false;
        this.util.log("Page Init Gallery", null);
        this.updateView();
        if (application.android) {
            application.android.on(application_2.AndroidApplication.activityBackPressedEvent, function (data) {
                data.cancel = true; // prevents default back button behavior
                _this.back();
            });
        }
        /*
        applicationOn(resumeEvent, (args: ApplicationEventData)=> {
            this.loadGallery({path: this.path, nodeid: this.nodeid});
        });
        */
        application_1.on("orientationChanged", function (e) {
            _this.orientation = e.newValue;
            _this.updateView();
        });
    };
    GalleryComponent.prototype.ngOnDestroy = function () {
        application_1.off("orientationChanged", this.updateView);
    };
    GalleryComponent.prototype.updateView = function () {
        try {
            this.util.log("Update view on orientation: ", this.orientation);
            if (this.orientation == "portrait") {
                var staggeredLayout = new listview_1.ListViewStaggeredLayout();
                staggeredLayout.spanCount = this.nColMin;
                staggeredLayout.scrollDirection = "Vertical";
                this.radList.listViewLayout = staggeredLayout;
            }
            else {
                var staggeredLayout = new listview_1.ListViewStaggeredLayout();
                staggeredLayout.spanCount = this.nColMax;
                staggeredLayout.scrollDirection = "Vertical";
                this.radList.listViewLayout = staggeredLayout;
            }
        }
        catch (e) {
            this.util.log("Error update view", e);
        }
    };
    GalleryComponent.prototype.clearCurrent = function () {
        while (this.current.length > 0) {
            this.current.pop();
        }
    };
    GalleryComponent.prototype.home = function () {
        this.util.log("home", null);
        this.cache.history = new Array();
        this.cache.currentAlbum.path = this.rootdir;
        this.cache.currentAlbum.nodeid = "/";
        this.loadGallery({
            path: this.cache.currentAlbum.path,
            nodeid: this.cache.currentAlbum.nodeid
        });
    };
    GalleryComponent.prototype.back = function () {
        var _this = this;
        if (this.cache.history.length > 1) {
            var current = this.cache.history.pop();
            var back = this.cache.history.pop();
            this.loadGallery(back);
        }
        else {
            var options = {
                title: this.translate.instant("Exit?"),
                message: this.translate.instant("Are you sure you want to exit?"),
                okButtonText: this.translate.instant("Yes"),
                cancelButtonText: this.translate.instant("No")
            };
            this.util.log("Back confirm exit?", null);
            dialogs_1.confirm(options).then(function (result) {
                _this.util.log("Back", result);
                if (result) {
                    _this.util.exit();
                }
            });
        }
    };
    GalleryComponent.prototype.exit = function () {
        Settings.setString("host", "");
        Settings.setString("username", "");
        Settings.setString("password", "");
        Settings.setString("rootdir", "");
        this.util.navigate("settings");
    };
    GalleryComponent.prototype.loadGallery = function (item) {
        var _this = this;
        this.loader.showLoader(this.translate.instant("Loading albums…"));
        this.util.log("Load Gallery", item);
        //this.util.log("Load Gallery", null); 
        var path = item.path;
        var nodeid = item.nodeid;
        if (this.cache.images[nodeid] == null) {
            this.cache.images[nodeid] = new gallery_item_1.GalleryItem();
        }
        this.clearCurrent();
        this.footer = "";
        this.cache.currentAlbum.nodeid = nodeid;
        this.cache.currentAlbum.path = path;
        var path_chunk = path.split("/");
        this.cache.currentAlbum.title = path_chunk[path_chunk.length - 1];
        this.cache.currentAlbum.title = (this.cache.currentAlbum.title == "") ? this.host.split("//")[1] : this.cache.currentAlbum.title;
        this.progressVal = 0;
        // string sanitize
        var pathsan = this.util.replaceAll(path, "&", "%26");
        pathsan = this.util.replaceAll(pathsan, " ", "%20");
        var url = this.host + "/index.php/apps/gallery/api/files/list?location=" + pathsan + "&mediatypes=image/jpeg;image/gif;image/png;image/x-xbitmap;image/bmp&features=&etag";
        this.util.log("GET list", null);
        // try from cache first
        //this.util.log("Get Album Cache", this.cache.images[this.cache.currentAlbum.nodeid]);
        this.util.log("Get Album Cache: " + this.cache.currentAlbum.nodeid, null);
        if (this.cache.images[this.cache.currentAlbum.nodeid].loaded) {
            this.util.log("Cache Found! Retrieving from cache", null);
            for (var a in this.cache.images[this.cache.currentAlbum.nodeid].items) {
                var item_1 = this.cache.images[this.cache.currentAlbum.nodeid].items[a];
                //this.util.log("Cache album added", item);
                this.util.log("Cache album added: " + a, null);
                this.current.push(item_1);
            }
            this.updateFooter(this.cache.images[this.cache.currentAlbum.nodeid].totAlbums, 0);
            var data_1 = this.cache.images[this.cache.currentAlbum.nodeid].data;
            // otherwise too fast :)
            timer.setTimeout(function () {
                _this.loader.hideLoader();
                _this.scanImages(data_1.files, nodeid);
            }, 800);
        }
        else {
            this.util.log("Cache Not Found :( Retrieving from cloud…", null);
            Http.request({
                url: url,
                method: "GET",
                headers: this.headers
            }).then(function (response) {
                var data = null;
                try {
                    data = response.content.toJSON();
                }
                catch (e) {
                    Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                    _this.util.log("Error loading data", e);
                    _this.loader.hideLoader();
                    return;
                }
                if (data == null) {
                    Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                    _this.util.log("Error Data null", null);
                    _this.loader.hideLoader();
                    return;
                }
                //this.util.log("response to ", path+"("+nodeid+"), current album:" + this.cache.currentAlbum.nodeid);
                _this.util.log("Response to (" + nodeid + "), Current album:" + _this.cache.currentAlbum.nodeid, null);
                var albums = data.albums;
                // error loading
                if (albums == null) {
                    Toast.makeText(_this.translate.instant("Error loading. Please exit and reconfigure")).show();
                    _this.loader.hideLoader();
                    return;
                }
                var totAlbums = 0;
                _this.progressTot = albums.length;
                _this.progressNum = 0;
                for (var j in albums) {
                    if (albums[j].size != 0) {
                        var albumObj = new gallery_item_1.GalleryItem();
                        albumObj.path = albums[j].path;
                        var path_chunk_1 = albumObj.path.split("/");
                        var current_chunk = _this.cache.currentAlbum.path.split("/");
                        albumObj.title = path_chunk_1[path_chunk_1.length - 1];
                        albumObj.isAlbum = true;
                        albumObj.src = "";
                        albumObj.nodeid = albums[j].nodeid;
                        albumObj.items = new Array();
                        if (albumObj.path == data.albumpath) {
                            // excludes current album
                        }
                        else if (path_chunk_1.length > current_chunk.length + 1) {
                            // excludes more levels albums
                        }
                        else {
                            _this.current.push(albumObj);
                            if (_this.cache.images[_this.cache.currentAlbum.nodeid].items == null) {
                                _this.cache.images[_this.cache.currentAlbum.nodeid].items = new Array();
                            }
                            _this.cache.images[_this.cache.currentAlbum.nodeid].items.push(albumObj);
                            totAlbums++;
                            //this.util.log("Album added to "+nodeid+":", albumObj);
                            _this.util.log("Album added to " + nodeid, null);
                        }
                    }
                    _this.progressNum++;
                    _this.progressVal = (_this.progressNum * 100) / _this.progressTot;
                }
                _this.progressVal = 100;
                _this.cache.images[_this.cache.currentAlbum.nodeid].loaded = true;
                _this.cache.images[_this.cache.currentAlbum.nodeid].totAlbums = totAlbums;
                _this.cache.images[_this.cache.currentAlbum.nodeid].data = data;
                //this.util.log("Set Album Cache", this.cache.images[this.cache.currentAlbum.nodeid]);
                _this.util.log("Set Album Cache: " + _this.cache.currentAlbum.nodeid, null);
                _this.updateFooter(totAlbums, 0);
                _this.updateView();
                _this.scanImages(data.files, nodeid);
            }, function (e) {
                Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                _this.util.log("Error Http", e);
                console.log(e);
                _this.loader.hideLoader();
                return;
            });
        }
        this.cache.history.push({ path: this.cache.currentAlbum.path, nodeid: this.cache.currentAlbum.nodeid });
    };
    GalleryComponent.prototype.scanImages = function (files, nodeid) {
        var _this = this;
        try {
            // checks for available images
            var toShowLoader = false;
            var totFiles = 0;
            var totAlbums = this.cache.images[this.cache.currentAlbum.nodeid].totAlbums;
            for (var i in files) {
                var filepath = "";
                var filepath_chunk = files[i].path.split("/");
                for (var c = 0; c < filepath_chunk.length - 1; c++) {
                    filepath += filepath_chunk[c] + "/";
                }
                if (filepath == this.cache.currentAlbum.path + "/") {
                    totFiles++;
                    toShowLoader = true;
                }
            }
            if (toShowLoader) {
                this.loader.showLoader(this.translate.instant("Loading images…"));
                this.progressNum = 0;
                this.progressTot = totFiles;
                this.progressVal = 0;
                this.updateFooter(totAlbums, totFiles);
            }
            else {
                this.loader.hideLoader();
            }
            var _loop_1 = function (i) {
                this_1.imageScanner = timer.setTimeout(function () { _this.loadImages(nodeid, files[files.length - 1 - (+i)]); }, 200 * (+i));
            };
            var this_1 = this;
            for (var i in files) {
                _loop_1(i);
            }
        }
        catch (e) {
            this.util.log("Error scan images", e);
            Toast.makeText(this.translate.instant("Error loading. Please retry")).show();
        }
    };
    GalleryComponent.prototype.loadImages = function (albumid, item) {
        var _this = this;
        if (albumid == this.cache.currentAlbum.nodeid) {
            var filepath = "";
            var filepath_chunk_1 = item.path.split("/");
            for (var c = 0; c < filepath_chunk_1.length - 1; c++) {
                filepath += filepath_chunk_1[c] + "/";
            }
            if (filepath == this.cache.currentAlbum.path + "/") {
                var imgurlroot_1 = this.host + "/index.php/apps/gallery/api/preview/" + item.nodeid;
                Http.request({
                    url: imgurlroot_1 + "/150/150",
                    method: "GET",
                    headers: this.headers
                }).then(function (response) {
                    if (albumid == _this.cache.currentAlbum.nodeid) {
                        var imgObj_1 = new gallery_item_1.GalleryItem();
                        response.content.toImage()
                            .then(function (image) {
                            var base64 = image.toBase64String();
                            imgObj_1.src = base64;
                            imgObj_1.title = filepath_chunk_1[filepath_chunk_1.length - 1];
                            imgObj_1.url = imgurlroot_1;
                            imgObj_1.mtime = item.mtime;
                            _this.current.push(imgObj_1);
                            /*
                            if(this.cache.images[this.cache.currentAlbum.nodeid].images==null) {
                              this.cache.images[this.cache.currentAlbum.nodeid].images = new Array<GalleryItem>();
                            }
                            this.cache.images[this.cache.currentAlbum.nodeid].images[item.nodeid] = imgObj;
                            */
                            _this.progressNum++;
                            _this.progressVal = (_this.progressNum * 100) / _this.progressTot;
                            //this.util.log("file added to "+albumid+": ", "(" + item.nodeid + ") " + item.path + " - " + item.mtime);
                            _this.util.log("File added to " + albumid + " (" + item.nodeid + ") - " + item.mtime, null);
                        })
                            .catch(function (error) {
                            _this.util.log("Error toImage", error);
                        });
                        // hide the loader when first image in directory is loaded
                        _this.loader.hideLoader();
                    }
                }, function (e) {
                    Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                });
            }
        }
        else {
            timer.clearTimeout(this.imageScanner);
        }
    };
    GalleryComponent.prototype.updateFooter = function (numAlbums, numFiles) {
        var footerAlbum = (numAlbums > 0) ? numAlbums + " " + this.translate.instant("Collections") : "";
        var footerFiles = (numFiles > 0) ? numFiles + " " + this.translate.instant("Files") : "";
        this.footer = "";
        this.footer += footerAlbum;
        this.footer += (numAlbums > 0 && numFiles > 0) ? " / " : "";
        this.footer += footerFiles;
        this.util.log("updateFooter", this.footer);
    };
    GalleryComponent.prototype.onTapFolder = function (item) {
        //this.util.log("tap", item);
        this.util.log("Tap item folder", null);
        this.loadGallery(item);
    };
    GalleryComponent.prototype.onTapImage = function (item) {
        //this.util.log("tap", item.title);
        this.util.log("Tap item image", null);
        this.loader.showLoader(this.translate.instant("Loading image…"));
        var options = {
            context: {
                loader: this.loader,
                item: item
            },
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modalService.showModal(image_modal_component_1.ImageModalComponent, options)
            .then(function (result) {
        });
    };
    GalleryComponent.prototype.sendLog = function () {
        if (this.util.DEBUG && this.util.LOGTOSETTINGS) {
            email.compose({
                subject: "Cloud Gallery Log",
                body: Settings.getString("_LOG"),
                to: ['info@linfaservice.it']
            });
        }
    };
    GalleryComponent = __decorate([
        core_1.Component({
            selector: "gallery",
            templateUrl: "pages/gallery/gallery.html",
            styleUrls: ["pages/gallery/gallery.css"],
            providers: [modal_dialog_1.ModalDialogService]
        }),
        __metadata("design:paramtypes", [page_1.Page,
            util_1.Util,
            nativescript_ngx_fonticon_1.TNSFontIconService,
            modal_dialog_1.ModalDialogService,
            core_1.ViewContainerRef,
            ng2_translate_1.TranslateService,
            gallery_cache_1.default])
    ], GalleryComponent);
    return GalleryComponent;
}());
exports.GalleryComponent = GalleryComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxsZXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUErQjtBQUMvQixzQ0FBb0U7QUFDcEUsMENBQXlDO0FBQ3pDLDhDQUF5QztBQUN6QywwREFBd0Q7QUFDeEQsNERBQXNEO0FBQ3RELDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsMkVBQXlFO0FBQ3pFLGtFQUF1RTtBQUN2RSxpRUFBOEQ7QUFFOUQsNENBQTZDO0FBQzdDLGlFQUEyRjtBQUMzRiw2QkFBK0I7QUFDL0IsK0NBQWlEO0FBQ2pELG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsMkNBQWlOO0FBRWpOLGdDQUFtQztBQUNuQyx5Q0FBMkM7QUFDM0MsMkNBQXNGO0FBQ3RGLHNDQUFxQztBQUNyQyxvREFBc0Q7QUFDdEQsMENBQTRDO0FBQzVDLCtEQUF5RDtBQUV6RCw2RUFBK0U7QUFDL0UscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsUUFBUSxFQUF6QyxDQUF5QyxDQUFDLENBQUM7QUFXbkc7SUFrQ0ksMEJBQ1UsSUFBVSxFQUNYLElBQVUsRUFDVCxRQUE0QixFQUM1QixZQUFnQyxFQUNoQyxLQUF1QixFQUN2QixTQUEyQixFQUMzQixLQUFtQjtRQVA3QixpQkFzQ0M7UUFyQ1MsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNYLFNBQUksR0FBSixJQUFJLENBQU07UUFDVCxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUFDaEMsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFDdkIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsVUFBSyxHQUFMLEtBQUssQ0FBYztRQXpCN0I7Ozs7VUFJRTtRQUVGLGlCQUFpQjtRQUNqQixlQUFlO1FBQ2YsZ0JBQWdCO1FB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c0NrQixXQUFJO1lBQ0wsV0FBSTtZQUNDLDhDQUFrQjtZQUNkLGlDQUFrQjtZQUN6Qix1QkFBZ0I7WUFDWixnQ0FBZ0I7WUFDcEIsdUJBQVk7T0F6Q3BCLGdCQUFnQixDQStkNUI7SUFBRCx1QkFBQztDQUFBLEFBL2RELElBK2RDO0FBL2RZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0aWxcIjtcclxuaW1wb3J0IExvYWRlciBmcm9tIFwiLi4vLi4vY29tbW9uL2xvYWRlclwiO1xyXG5pbXBvcnQgeyBHYWxsZXJ5SXRlbSB9IGZyb20gXCIuLi8uLi9jb21tb24vZ2FsbGVyeS5pdGVtXCI7XHJcbmltcG9ydCBHYWxsZXJ5Q2FjaGUgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYWxsZXJ5LmNhY2hlXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUtYXJyYXlcIjtcclxuaW1wb3J0IHsgTW9kYWxEaWFsb2dTZXJ2aWNlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBJbWFnZU1vZGFsQ29tcG9uZW50IH0gZnJvbSBcIi4vaW1hZ2UtbW9kYWwuY29tcG9uZW50XCI7XHJcbmltcG9ydCAqIGFzIEltYWdlU291cmNlTW9kdWxlIGZyb20gXCJpbWFnZS1zb3VyY2VcIjtcclxuaW1wb3J0ICogYXMgSHR0cCBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9odHRwXCJcclxuaW1wb3J0IHsgUmFkTGlzdFZpZXcsIExpc3RWaWV3U3RhZ2dlcmVkTGF5b3V0IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpLXByby9saXN0dmlld1wiXHJcbmltcG9ydCAqIGFzIHRpbWVyIGZyb20gXCJ0aW1lclwiO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgUGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBvbiBhcyBhcHBsaWNhdGlvbk9uLCBvZmYgYXMgYXBwbGljYXRpb25PZmYsIGxhdW5jaEV2ZW50LCBzdXNwZW5kRXZlbnQsIHJlc3VtZUV2ZW50LCBleGl0RXZlbnQsIGxvd01lbW9yeUV2ZW50LCB1bmNhdWdodEVycm9yRXZlbnQsIEFwcGxpY2F0aW9uRXZlbnREYXRhLCBzdGFydCBhcyBhcHBsaWNhdGlvblN0YXJ0IH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCAqIGFzIHV0ZjggZnJvbSBcInV0ZjhcIjsgXHJcbmltcG9ydCAqIGFzICBCYXNlNjQgZnJvbSBcImJhc2UtNjRcIjtcclxuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCB7IEFuZHJvaWRBcHBsaWNhdGlvbiwgQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgY29uZmlybSB9IGZyb20gXCJ1aS9kaWFsb2dzXCI7XHJcbmltcG9ydCAqIGFzIGFwcHZlcnNpb24gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hcHB2ZXJzaW9uXCI7IFxyXG5pbXBvcnQgKiBhcyBlbWFpbCBmcm9tIFwibmF0aXZlc2NyaXB0LWVtYWlsXCI7XHJcbmltcG9ydCB7c2NyZWVufSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybS9wbGF0Zm9ybVwiXHJcblxyXG5pbXBvcnQgKiBhcyBlbGVtZW50UmVnaXN0cnlNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XHJcbmVsZW1lbnRSZWdpc3RyeU1vZHVsZS5yZWdpc3RlckVsZW1lbnQoXCJDYXJkVmlld1wiLCAoKSA9PiByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWNhcmR2aWV3XCIpLkNhcmRWaWV3KTtcclxuXHJcbiAgXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcImdhbGxlcnlcIixcclxuICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9nYWxsZXJ5L2dhbGxlcnkuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wicGFnZXMvZ2FsbGVyeS9nYWxsZXJ5LmNzc1wiXSxcclxuICBwcm92aWRlcnM6IFtNb2RhbERpYWxvZ1NlcnZpY2VdXHJcbn0pXHJcbiBcclxuXHJcbmV4cG9ydCBjbGFzcyBHYWxsZXJ5Q29tcG9uZW50IHtcclxuXHJcbiAgICBwcml2YXRlIGxhbmd1YWdlO1xyXG4gICAgcHJpdmF0ZSB2ZXJzaW9uO1xyXG5cclxuICAgIHByaXZhdGUgaG9zdDtcclxuICAgIHByaXZhdGUgdXNlcm5hbWU7XHJcbiAgICBwcml2YXRlIHBhc3N3b3JkO1xyXG4gICAgcHJpdmF0ZSByb290ZGlyO1xyXG4gICAgcHJpdmF0ZSBoZWFkZXJzO1xyXG5cclxuICAgIHByaXZhdGUgcmFkTGlzdDogUmFkTGlzdFZpZXc7XHJcbiAgICBwcml2YXRlIG9yaWVudGF0aW9uO1xyXG4gICAgcHJpdmF0ZSBuQ29sTWluO1xyXG4gICAgcHJpdmF0ZSBuQ29sTWF4O1xyXG5cclxuICAgIC8qXHJcbiAgICBwcml2YXRlIGltYWdlcyA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8T2JzZXJ2YWJsZUFycmF5PEdhbGxlcnlJdGVtPj4oKTtcclxuICAgIHByaXZhdGUgY3VycmVudCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICBwcml2YXRlIGhpc3RvcnkgPSBuZXcgQXJyYXkoKTtcclxuICAgICovXHJcblxyXG4gICAgLy9wcml2YXRlIG5vZGVpZDtcclxuICAgIC8vcHJpdmF0ZSBwYXRoO1xyXG4gICAgLy9wcml2YXRlIHRpdGxlO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICBwcml2YXRlIHByb2dyZXNzTnVtID0gMDtcclxuICAgIHByaXZhdGUgcHJvZ3Jlc3NUb3QgPSAwO1xyXG4gICAgcHJpdmF0ZSBwcm9ncmVzc1ZhbCA9IDA7XHJcbiAgICBwcml2YXRlIGZvb3RlciA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuICAgIHByaXZhdGUgaW1hZ2VTY2FubmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG5cdCAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSBtb2RhbFNlcnZpY2U6IE1vZGFsRGlhbG9nU2VydmljZSwgXHJcbiAgICAgIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsXHJcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgICBwcml2YXRlIGNhY2hlOiBHYWxsZXJ5Q2FjaGVcclxuICAgICkgIHtcclxuXHJcbiAgICAgIC8vY2FsYyBkaW1lbnNpb25zIGZvciByZXNwb25zaXZlIHZpZXdcclxuICAgICAgbGV0IG5Db2wxID0gTWF0aC5mbG9vcihzY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzLzMyMCkqMztcclxuICAgICAgbGV0IG5Db2wyID0gTWF0aC5mbG9vcihzY3JlZW4ubWFpblNjcmVlbi53aWR0aERJUHMvMzIwKSozO1xyXG4gICAgICBpZihuQ29sMT5uQ29sMikgeyB0aGlzLm5Db2xNYXg9bkNvbDE7IHRoaXMubkNvbE1pbj1uQ29sMn1cclxuICAgICAgZWxzZSB7IHRoaXMubkNvbE1heD1uQ29sMjsgdGhpcy5uQ29sTWluPW5Db2wxfVxyXG4gICAgICBcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlJlc3BvbnNpdmUgY29sdW1uczogXCIsIHRoaXMubkNvbE1heCArIFwiIG9yIFwiICsgdGhpcy5uQ29sTWluKTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgYXBwdmVyc2lvbi5nZXRWZXJzaW9uTmFtZSgpLnRoZW4oKHY6IHN0cmluZyk9PiB7XHJcbiAgICAgICAgICB0aGlzLnZlcnNpb24gPSBcIlZlcnNpb24gXCIgKyB2O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2U7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKFwiZW5cIik7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnVzZShQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdKS5zdWJzY3JpYmUoKCk9PiB7XHJcbiAgICAgICAgdGhpcy5ob3N0ID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdFwiKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcm5hbWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IFNldHRpbmdzLmdldFN0cmluZyhcInBhc3N3b3JkXCIpO1xyXG4gICAgICAgIHRoaXMucm9vdGRpciA9IFNldHRpbmdzLmdldFN0cmluZyhcInJvb3RkaXJcIik7ICBcclxuICAgICAgICB0aGlzLnJvb3RkaXIgPSAodGhpcy5yb290ZGlyPT1udWxsKT8gXCJcIjp0aGlzLnJvb3RkaXI7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0geyBcclxuICAgICAgICAgIFwiT0NTLUFQSVJFUVVFU1RcIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCYXNpYyBcIitCYXNlNjQuZW5jb2RlKHRoaXMudXNlcm5hbWUrJzonK3RoaXMucGFzc3dvcmQpXHJcbiAgICAgICAgfSAgICBcclxuXHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXMgPSBuZXcgQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICAgICAgdGhpcy5ob21lKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmFkTGlzdExvYWRlZChhcmdzKSB7XHJcbiAgICAgIHRoaXMucmFkTGlzdCA9IDxSYWRMaXN0Vmlldz5hcmdzLm9iamVjdDsgIFxyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiVmlldyBTaXplOiBcIiArIHRoaXMucmFkTGlzdC5nZXRNZWFzdXJlZFdpZHRoKCkgKyBcInhcIiArIHRoaXMucmFkTGlzdC5nZXRNZWFzdXJlZEhlaWdodCgpLCBudWxsKTtcclxuXHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJJbml0aWFsIHNjcmVlbiBvcmllbnRhdGlvbjogXCIsIHNjcmVlbi5tYWluU2NyZWVuLndpZHRoRElQcyArIFwieFwiICsgc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0RElQcyk7XHJcbiAgICAgIGlmKHNjcmVlbi5tYWluU2NyZWVuLndpZHRoRElQcz5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzKSB7XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IFwibGFuZHNjYXBlXCI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IFwicG9ydHJhaXRcIjtcclxuICAgICAgfSAgXHJcbiAgICAgIHRoaXMudXBkYXRlVmlldygpOyAgIFxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJQYWdlIEluaXQgR2FsbGVyeVwiLCBudWxsKTsgXHJcbiAgICAgIHRoaXMudXBkYXRlVmlldygpOyAgICAgIFxyXG5cclxuICAgICAgaWYgKGFwcGxpY2F0aW9uLmFuZHJvaWQpIHtcclxuICAgICAgICBhcHBsaWNhdGlvbi5hbmRyb2lkLm9uKFxyXG4gICAgICAgICAgICBBbmRyb2lkQXBwbGljYXRpb24uYWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50LCBcclxuICAgICAgICAgICAgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmNhbmNlbCA9IHRydWU7IC8vIHByZXZlbnRzIGRlZmF1bHQgYmFjayBidXR0b24gYmVoYXZpb3JcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFjaygpO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICk7ICAgICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKlxyXG4gICAgICBhcHBsaWNhdGlvbk9uKHJlc3VtZUV2ZW50LCAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2FkR2FsbGVyeSh7cGF0aDogdGhpcy5wYXRoLCBub2RlaWQ6IHRoaXMubm9kZWlkfSk7XHJcbiAgICAgIH0pOyAgIFxyXG4gICAgICAqLyBcclxuXHJcbiAgICAgIGFwcGxpY2F0aW9uT24oXCJvcmllbnRhdGlvbkNoYW5nZWRcIiwgKGUpPT57IFxyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBlLm5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpOyBcclxuICAgICAgfSk7ICAgXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAgIGFwcGxpY2F0aW9uT2ZmKFwib3JpZW50YXRpb25DaGFuZ2VkXCIsIHRoaXMudXBkYXRlVmlldyk7XHJcbiAgICB9ICAgIFxyXG4gXHJcbiAgICB1cGRhdGVWaWV3KCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJVcGRhdGUgdmlldyBvbiBvcmllbnRhdGlvbjogXCIsIHRoaXMub3JpZW50YXRpb24pO1xyXG4gICAgICAgIGlmKHRoaXMub3JpZW50YXRpb24gPT0gXCJwb3J0cmFpdFwiKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFnZ2VyZWRMYXlvdXQgPSBuZXcgTGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXQoKTtcclxuICAgICAgICAgICAgc3RhZ2dlcmVkTGF5b3V0LnNwYW5Db3VudCA9IHRoaXMubkNvbE1pbjtcclxuICAgICAgICAgICAgc3RhZ2dlcmVkTGF5b3V0LnNjcm9sbERpcmVjdGlvbiA9IFwiVmVydGljYWxcIjtcclxuICAgICAgICAgICAgdGhpcy5yYWRMaXN0Lmxpc3RWaWV3TGF5b3V0ID0gc3RhZ2dlcmVkTGF5b3V0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFnZ2VyZWRMYXlvdXQgPSBuZXcgTGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXQoKTtcclxuICAgICAgICAgICAgc3RhZ2dlcmVkTGF5b3V0LnNwYW5Db3VudCA9IHRoaXMubkNvbE1heDtcclxuICAgICAgICAgICAgc3RhZ2dlcmVkTGF5b3V0LnNjcm9sbERpcmVjdGlvbiA9IFwiVmVydGljYWxcIjtcclxuICAgICAgICAgICAgdGhpcy5yYWRMaXN0Lmxpc3RWaWV3TGF5b3V0ID0gc3RhZ2dlcmVkTGF5b3V0O1xyXG4gICAgICAgIH0gICAgICBcclxuICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yIHVwZGF0ZSB2aWV3XCIsIGUpO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGVhckN1cnJlbnQoKSB7XHJcbiAgICAgIHdoaWxlKHRoaXMuY3VycmVudC5sZW5ndGg+MCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudC5wb3AoKTsgICBcclxuICAgICAgfVxyXG4gICAgfSAgXHJcblxyXG4gICAgcHJpdmF0ZSBob21lKCkge1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiaG9tZVwiLCBudWxsKTtcclxuICAgICAgdGhpcy5jYWNoZS5oaXN0b3J5ID0gbmV3IEFycmF5KCk7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGggPSB0aGlzLnJvb3RkaXI7IFxyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQgPSBcIi9cIjtcclxuICAgICAgdGhpcy5sb2FkR2FsbGVyeSh7XHJcbiAgICAgICAgcGF0aDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCwgXHJcbiAgICAgICAgbm9kZWlkOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBiYWNrKCkge1xyXG4gICAgICBpZih0aGlzLmNhY2hlLmhpc3RvcnkubGVuZ3RoPjEpIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IHRoaXMuY2FjaGUuaGlzdG9yeS5wb3AoKTtcclxuICAgICAgICBsZXQgYmFjayA9IHRoaXMuY2FjaGUuaGlzdG9yeS5wb3AoKTtcclxuICAgICAgICB0aGlzLmxvYWRHYWxsZXJ5KGJhY2spOyBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFeGl0P1wiKSxcclxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBleGl0P1wiKSxcclxuICAgICAgICAgICAgb2tCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiWWVzXCIpLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTm9cIilcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiQmFjayBjb25maXJtIGV4aXQ/XCIsIG51bGwpOyBcclxuICAgICAgICBjb25maXJtKG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiQmFja1wiLCByZXN1bHQpOyAgICAgICAgICBcclxuICAgICAgICAgICAgaWYocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmV4aXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4aXQoKSB7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcImhvc3RcIiwgXCJcIik7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInVzZXJuYW1lXCIsIFwiXCIpO1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJwYXNzd29yZFwiLCBcIlwiKTtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicm9vdGRpclwiLCBcIlwiKTsgICAgICAgIFxyXG4gICAgICB0aGlzLnV0aWwubmF2aWdhdGUoXCJzZXR0aW5nc1wiKTtcclxuICAgIH1cclxuIFxyXG4gICAgcHJpdmF0ZSBsb2FkR2FsbGVyeShpdGVtKSB7XHJcbiAgICAgICBcclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBhbGJ1bXPigKZcIikpO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiTG9hZCBHYWxsZXJ5XCIsIGl0ZW0pOyBcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwiTG9hZCBHYWxsZXJ5XCIsIG51bGwpOyBcclxuXHJcbiAgICAgIGxldCBwYXRoID0gaXRlbS5wYXRoO1xyXG4gICAgICBsZXQgbm9kZWlkID0gaXRlbS5ub2RlaWQ7XHJcblxyXG4gICAgICBpZih0aGlzLmNhY2hlLmltYWdlc1tub2RlaWRdPT1udWxsKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbbm9kZWlkXSA9IG5ldyBHYWxsZXJ5SXRlbSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNsZWFyQ3VycmVudCgpO1xyXG5cclxuICAgICAgdGhpcy5mb290ZXIgPSBcIlwiO1xyXG5cclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkID0gbm9kZWlkO1xyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoID0gcGF0aDtcclxuICAgICAgbGV0IHBhdGhfY2h1bmsgPSBwYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGUgPSBwYXRoX2NodW5rW3BhdGhfY2h1bmsubGVuZ3RoLTFdO1xyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50aXRsZSA9ICh0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50aXRsZT09XCJcIik/IHRoaXMuaG9zdC5zcGxpdChcIi8vXCIpWzFdIDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGU7XHJcblxyXG4gICAgICB0aGlzLnByb2dyZXNzVmFsID0gMDtcclxuXHJcbiAgICAgIC8vIHN0cmluZyBzYW5pdGl6ZVxyXG4gICAgICBsZXQgcGF0aHNhbiA9IHRoaXMudXRpbC5yZXBsYWNlQWxsKHBhdGgsIFwiJlwiLCBcIiUyNlwiKTsgXHJcbiAgICAgIHBhdGhzYW4gPSB0aGlzLnV0aWwucmVwbGFjZUFsbChwYXRoc2FuLCBcIiBcIiwgXCIlMjBcIik7ICAgICAgIFxyXG4gICAgICBsZXQgdXJsID0gdGhpcy5ob3N0K1wiL2luZGV4LnBocC9hcHBzL2dhbGxlcnkvYXBpL2ZpbGVzL2xpc3Q/bG9jYXRpb249XCIrcGF0aHNhbitcIiZtZWRpYXR5cGVzPWltYWdlL2pwZWc7aW1hZ2UvZ2lmO2ltYWdlL3BuZztpbWFnZS94LXhiaXRtYXA7aW1hZ2UvYm1wJmZlYXR1cmVzPSZldGFnXCI7XHJcblxyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiR0VUIGxpc3RcIiwgbnVsbCk7XHJcblxyXG4gICAgICAvLyB0cnkgZnJvbSBjYWNoZSBmaXJzdFxyXG4gICAgICAvL3RoaXMudXRpbC5sb2coXCJHZXQgQWxidW0gQ2FjaGVcIiwgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXSk7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJHZXQgQWxidW0gQ2FjaGU6IFwiICsgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkLCBudWxsKTtcclxuICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5sb2FkZWQpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiQ2FjaGUgRm91bmQhIFJldHJpZXZpbmcgZnJvbSBjYWNoZVwiLCBudWxsKTtcclxuICAgICAgICBmb3IobGV0IGEgaW4gdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcykge1xyXG4gICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zW2FdO1xyXG4gICAgICAgICAgLy90aGlzLnV0aWwubG9nKFwiQ2FjaGUgYWxidW0gYWRkZWRcIiwgaXRlbSk7XHJcbiAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiQ2FjaGUgYWxidW0gYWRkZWQ6IFwiICsgYSwgbnVsbCk7XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnQucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVGb290ZXIodGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS50b3RBbGJ1bXMsIDApO1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5kYXRhO1xyXG5cclxuICAgICAgICAvLyBvdGhlcndpc2UgdG9vIGZhc3QgOilcclxuICAgICAgICB0aW1lci5zZXRUaW1lb3V0KCgpPT4geyBcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTsgXHJcbiAgICAgICAgICB0aGlzLnNjYW5JbWFnZXMoZGF0YS5maWxlcywgbm9kZWlkKTtcclxuICAgICAgICB9LCA4MDApO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIE5vdCBGb3VuZCA6KCBSZXRyaWV2aW5nIGZyb20gY2xvdWTigKZcIiwgbnVsbCk7XHJcbiAgICAgIFxyXG4gICAgICAgIEh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVyc1xyXG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlOmFueSk9PiB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgZGF0YSA9IHJlc3BvbnNlLmNvbnRlbnQudG9KU09OKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3IgbG9hZGluZyBkYXRhXCIsIGUpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoZGF0YT09bnVsbCkge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3IgRGF0YSBudWxsXCIsIG51bGwpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcInJlc3BvbnNlIHRvIFwiLCBwYXRoK1wiKFwiK25vZGVpZCtcIiksIGN1cnJlbnQgYWxidW06XCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpO1xyXG4gICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiUmVzcG9uc2UgdG8gKFwiK25vZGVpZCtcIiksIEN1cnJlbnQgYWxidW06XCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsYnVtcyA9IGRhdGEuYWxidW1zOyAgXHJcbiAgICAgICAgICAgIC8vIGVycm9yIGxvYWRpbmdcclxuICAgICAgICAgICAgaWYoYWxidW1zPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSBleGl0IGFuZCByZWNvbmZpZ3VyZVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0b3RBbGJ1bXMgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzVG90ID0gYWxidW1zLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSA9IDA7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiBpbiBhbGJ1bXMpIHtcclxuICAgICAgICAgICAgICBpZihhbGJ1bXNbal0uc2l6ZSE9MCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFsYnVtT2JqID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5wYXRoID0gYWxidW1zW2pdLnBhdGg7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGF0aF9jaHVuayA9IGFsYnVtT2JqLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRfY2h1bmsgPSB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLnRpdGxlID0gcGF0aF9jaHVua1twYXRoX2NodW5rLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLmlzQWxidW0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmouc3JjID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLm5vZGVpZCA9IGFsYnVtc1tqXS5ub2RlaWQ7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihhbGJ1bU9iai5wYXRoPT1kYXRhLmFsYnVtcGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBleGNsdWRlcyBjdXJyZW50IGFsYnVtXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYocGF0aF9jaHVuay5sZW5ndGg+Y3VycmVudF9jaHVuay5sZW5ndGgrMSkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBleGNsdWRlcyBtb3JlIGxldmVscyBhbGJ1bXNcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC5wdXNoKGFsYnVtT2JqKTtcclxuICAgICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcz09bnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMgPSBuZXcgQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcy5wdXNoKGFsYnVtT2JqKTtcclxuICAgICAgICAgICAgICAgICAgdG90QWxidW1zKys7XHJcbiAgICAgICAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIkFsYnVtIGFkZGVkIHRvIFwiK25vZGVpZCtcIjpcIiwgYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiQWxidW0gYWRkZWQgdG8gXCIrbm9kZWlkLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSsrO1xyXG4gICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAodGhpcy5wcm9ncmVzc051bSoxMDApL3RoaXMucHJvZ3Jlc3NUb3Q7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAxMDA7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS50b3RBbGJ1bXMgPSB0b3RBbGJ1bXM7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIlNldCBBbGJ1bSBDYWNoZVwiLCB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdKTtcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIlNldCBBbGJ1bSBDYWNoZTogXCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVGb290ZXIodG90QWxidW1zLCAwKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7IFxyXG4gICAgICAgICAgICB0aGlzLnNjYW5JbWFnZXMoZGF0YS5maWxlcywgbm9kZWlkKTtcclxuXHJcbiAgICAgICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvciBIdHRwXCIsIGUpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9KTsgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2FjaGUuaGlzdG9yeS5wdXNoKHtwYXRoOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoLCBub2RlaWQ6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZH0pOyBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNjYW5JbWFnZXMoZmlsZXMsIG5vZGVpZCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIC8vIGNoZWNrcyBmb3IgYXZhaWxhYmxlIGltYWdlc1xyXG4gICAgICAgIGxldCB0b1Nob3dMb2FkZXIgPSBmYWxzZTtcclxuICAgICAgICBsZXQgdG90RmlsZXMgPSAwO1xyXG4gICAgICAgIGxldCB0b3RBbGJ1bXMgPSB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLnRvdEFsYnVtcztcclxuXHJcbiAgICAgICAgZm9yKGxldCBpIGluIGZpbGVzKSB7XHJcbiAgICAgICAgICBsZXQgZmlsZXBhdGggPSBcIlwiO1xyXG4gICAgICAgICAgbGV0IGZpbGVwYXRoX2NodW5rID0gZmlsZXNbaV0ucGF0aC5zcGxpdChcIi9cIik7XHJcblxyXG4gICAgICAgICAgZm9yKGxldCBjPTA7IGM8ZmlsZXBhdGhfY2h1bmsubGVuZ3RoLTE7IGMrKykge1xyXG4gICAgICAgICAgICBmaWxlcGF0aCArPSBmaWxlcGF0aF9jaHVua1tjXSArIFwiL1wiXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYoZmlsZXBhdGg9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGgrXCIvXCIpIHtcclxuICAgICAgICAgICAgdG90RmlsZXMrKztcclxuICAgICAgICAgICAgdG9TaG93TG9hZGVyID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodG9TaG93TG9hZGVyKSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJMb2FkaW5nIGltYWdlc+KAplwiKSk7ICAgICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5wcm9ncmVzc051bSA9IDA7XHJcbiAgICAgICAgICB0aGlzLnByb2dyZXNzVG90ID0gdG90RmlsZXM7XHJcbiAgICAgICAgICB0aGlzLnByb2dyZXNzVmFsID0gMDtcclxuXHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZUZvb3Rlcih0b3RBbGJ1bXMsIHRvdEZpbGVzKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpIGluIGZpbGVzKSB7IFxyXG4gICAgICAgICAgdGhpcy5pbWFnZVNjYW5uZXIgPSB0aW1lci5zZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKT0+IHsgdGhpcy5sb2FkSW1hZ2VzKG5vZGVpZCwgZmlsZXNbZmlsZXMubGVuZ3RoLTEtKCtpKV0pIH0sIFxyXG4gICAgICAgICAgICAyMDAqKCtpKSk7XHJcbiAgICAgICAgfSAgXHJcblxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3Igc2NhbiBpbWFnZXNcIiwgZSk7XHJcbiAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICB9ICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRJbWFnZXMoYWxidW1pZCwgaXRlbSkge1xyXG4gICAgICBpZihhbGJ1bWlkPT10aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpIHsgXHJcbiAgICAgICAgbGV0IGZpbGVwYXRoID0gXCJcIjtcclxuICAgICAgICBsZXQgZmlsZXBhdGhfY2h1bmsgPSBpdGVtLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIGZvcihsZXQgYz0wOyBjPGZpbGVwYXRoX2NodW5rLmxlbmd0aC0xOyBjKyspIHtcclxuICAgICAgICAgIGZpbGVwYXRoICs9IGZpbGVwYXRoX2NodW5rW2NdICsgXCIvXCJcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICBpZihmaWxlcGF0aD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCtcIi9cIikge1xyXG4gICAgICAgICAgbGV0IGltZ3VybHJvb3QgPSB0aGlzLmhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvcHJldmlldy9cIiArIGl0ZW0ubm9kZWlkO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IGltZ3VybHJvb3QgKyBcIi8xNTAvMTUwXCIsXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVyc1xyXG4gICAgICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmKGFsYnVtaWQ9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCkgeyBcclxuICAgICAgICAgICAgICBsZXQgaW1nT2JqID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuY29udGVudC50b0ltYWdlKClcclxuICAgICAgICAgICAgICAgIC50aGVuKChpbWFnZSk9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBiYXNlNjQgPSBpbWFnZS50b0Jhc2U2NFN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmouc3JjID0gYmFzZTY0O1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoudGl0bGUgPSBmaWxlcGF0aF9jaHVua1tmaWxlcGF0aF9jaHVuay5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai51cmwgPSBpbWd1cmxyb290O1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoubXRpbWUgPSBpdGVtLm10aW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goaW1nT2JqKTtcclxuICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pbWFnZXM9PW51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmltYWdlcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmltYWdlc1tpdGVtLm5vZGVpZF0gPSBpbWdPYmo7XHJcbiAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NOdW0rKztcclxuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9ICh0aGlzLnByb2dyZXNzTnVtKjEwMCkvdGhpcy5wcm9ncmVzc1RvdDtcclxuICAgICAgICAgICAgICAgICAgLy90aGlzLnV0aWwubG9nKFwiZmlsZSBhZGRlZCB0byBcIithbGJ1bWlkK1wiOiBcIiwgXCIoXCIgKyBpdGVtLm5vZGVpZCArIFwiKSBcIiArIGl0ZW0ucGF0aCArIFwiIC0gXCIgKyBpdGVtLm10aW1lKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkZpbGUgYWRkZWQgdG8gXCIrYWxidW1pZCtcIiAoXCIgKyBpdGVtLm5vZGVpZCArIFwiKSAtIFwiICsgaXRlbS5tdGltZSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvciB0b0ltYWdlXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pOyAgXHJcblxyXG5cdFx0XHRcdCAgICAgIC8vIGhpZGUgdGhlIGxvYWRlciB3aGVuIGZpcnN0IGltYWdlIGluIGRpcmVjdG9yeSBpcyBsb2FkZWRcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRpbWVyLmNsZWFyVGltZW91dCh0aGlzLmltYWdlU2Nhbm5lcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUZvb3RlcihudW1BbGJ1bXMsIG51bUZpbGVzKSB7XHJcbiAgICAgIGxldCBmb290ZXJBbGJ1bSA9IChudW1BbGJ1bXM+MCk/IG51bUFsYnVtcyArIFwiIFwiICsgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkNvbGxlY3Rpb25zXCIpIDogXCJcIjtcclxuICAgICAgbGV0IGZvb3RlckZpbGVzID0gKG51bUZpbGVzPjApPyBudW1GaWxlcyArIFwiIFwiICsgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkZpbGVzXCIpIDogXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgPSBcIlwiO1xyXG4gICAgICB0aGlzLmZvb3RlciArPSBmb290ZXJBbGJ1bTtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gKG51bUFsYnVtcz4wICYmIG51bUZpbGVzPjApPyBcIiAvIFwiIDogXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gZm9vdGVyRmlsZXM7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJ1cGRhdGVGb290ZXJcIiwgdGhpcy5mb290ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVGFwRm9sZGVyKGl0ZW0pIHtcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwidGFwXCIsIGl0ZW0pO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiVGFwIGl0ZW0gZm9sZGVyXCIsIG51bGwpO1xyXG4gICAgICB0aGlzLmxvYWRHYWxsZXJ5KGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVGFwSW1hZ2UoaXRlbSkge1xyXG4gICAgICAvL3RoaXMudXRpbC5sb2coXCJ0YXBcIiwgaXRlbS50aXRsZSk7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJUYXAgaXRlbSBpbWFnZVwiLCBudWxsKTtcclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBpbWFnZeKAplwiKSk7IFxyXG5cclxuICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBjb250ZXh0OiB7XHJcbiAgICAgICAgICAgIGxvYWRlcjogdGhpcy5sb2FkZXIsXHJcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWZcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMubW9kYWxTZXJ2aWNlLnNob3dNb2RhbChJbWFnZU1vZGFsQ29tcG9uZW50LCBvcHRpb25zKVxyXG4gICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHsgICAgICBcclxuICAgICAgfSk7XHJcbiAgICB9IFxyXG5cclxuICAgIHNlbmRMb2coKSB7XHJcbiAgICAgIGlmKHRoaXMudXRpbC5ERUJVRyAmJiB0aGlzLnV0aWwuTE9HVE9TRVRUSU5HUykge1xyXG4gICAgICAgIGVtYWlsLmNvbXBvc2Uoe1xyXG4gICAgICAgICAgc3ViamVjdDogXCJDbG91ZCBHYWxsZXJ5IExvZ1wiLFxyXG4gICAgICAgICAgYm9keTogU2V0dGluZ3MuZ2V0U3RyaW5nKFwiX0xPR1wiKSxcclxuICAgICAgICAgIHRvOiBbJ2luZm9AbGluZmFzZXJ2aWNlLml0J11cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICBcclxuXHJcbn1cclxuIl19