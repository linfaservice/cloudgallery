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
        var staggeredLayout = new listview_1.ListViewStaggeredLayout();
        this.util.log("Initial screen orientation: ", platform_1.screen.mainScreen.widthDIPs + "x" + platform_1.screen.mainScreen.heightDIPs);
        if (platform_1.screen.mainScreen.widthDIPs > platform_1.screen.mainScreen.heightDIPs) {
            this.setOrientation({ newValue: "landscape" });
        }
        else {
            this.setOrientation({ newValue: "portrait" });
        }
    };
    GalleryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.actionBarHidden = false;
        this.util.log("Page Init Gallery", null);
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
        application_1.on("orientationChanged", function (e) { _this.setOrientation(e); });
    };
    GalleryComponent.prototype.ngOnDestroy = function () {
        application_1.off("orientationChanged", this.setOrientation);
    };
    GalleryComponent.prototype.setOrientation = function (e) {
        this.util.log("Set orientation: ", e.newValue);
        if (e.newValue == "portrait") {
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
    };
    GalleryComponent.prototype.clearCurrent = function () {
        while (this.current.length > 0) {
            this.current.pop();
        }
    };
    GalleryComponent.prototype.home = function () {
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
        //this.util.log("Load Gallery", item); 
        this.util.log("Load Gallery", null);
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
                    _this.util.log("Error", e);
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
                _this.loader.hideLoader();
                _this.scanImages(data.files, nodeid);
            }, function (e) {
                Toast.makeText(_this.translate.instant("Error loading. Please retry")).show();
                _this.util.log("Error", e);
                _this.loader.hideLoader();
                return;
            });
        }
        this.cache.history.push({ path: this.cache.currentAlbum.path, nodeid: this.cache.currentAlbum.nodeid });
    };
    GalleryComponent.prototype.scanImages = function (files, nodeid) {
        var _this = this;
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
        var _loop_1 = function (i) {
            this_1.imageScanner = timer.setTimeout(function () { _this.loadImages(nodeid, files[files.length - 1 - (+i)]); }, 300 * (+i));
        };
        var this_1 = this;
        for (var i in files) {
            _loop_1(i);
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
                            _this.util.log("error", error);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxsZXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUErQjtBQUMvQixzQ0FBb0U7QUFDcEUsMENBQXlDO0FBQ3pDLDhDQUF5QztBQUN6QywwREFBd0Q7QUFDeEQsNERBQXNEO0FBQ3RELDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsMkVBQXlFO0FBQ3pFLGtFQUF1RTtBQUN2RSxpRUFBOEQ7QUFFOUQsNENBQTZDO0FBQzdDLGlFQUEyRjtBQUMzRiw2QkFBK0I7QUFDL0IsK0NBQWlEO0FBQ2pELG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsMkNBQWlOO0FBRWpOLGdDQUFtQztBQUNuQyx5Q0FBMkM7QUFDM0MsMkNBQXNGO0FBQ3RGLHNDQUFxQztBQUNyQyxvREFBc0Q7QUFDdEQsMENBQTRDO0FBQzVDLCtEQUF5RDtBQUV6RCw2RUFBK0U7QUFDL0UscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsUUFBUSxFQUF6QyxDQUF5QyxDQUFDLENBQUM7QUFXbkc7SUFpQ0ksMEJBQ1UsSUFBVSxFQUNYLElBQVUsRUFDVCxRQUE0QixFQUM1QixZQUFnQyxFQUNoQyxLQUF1QixFQUN2QixTQUEyQixFQUMzQixLQUFtQjtRQVA3QixpQkFvQ0M7UUFuQ1MsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNYLFNBQUksR0FBSixJQUFJLENBQU07UUFDVCxhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUFDaEMsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFDdkIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0IsVUFBSyxHQUFMLEtBQUssQ0FBYztRQXpCN0I7Ozs7VUFJRTtRQUVGLGlCQUFpQjtRQUNqQixlQUFlO1FBQ2YsZ0JBQWdCO1FB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LENBQUM7U0FDaEMsQ0FBQzt5Q0FxQ2tCLFdBQUk7WUFDTCxXQUFJO1lBQ0MsOENBQWtCO1lBQ2QsaUNBQWtCO1lBQ3pCLHVCQUFnQjtZQUNaLGdDQUFnQjtZQUNwQix1QkFBWTtPQXhDcEIsZ0JBQWdCLENBcWM1QjtJQUFELHVCQUFDO0NBQUEsQUFyY0QsSUFxY0M7QUFyY1ksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuLi8uLi9jb21tb24vbG9hZGVyXCI7XHJcbmltcG9ydCB7IEdhbGxlcnlJdGVtIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9nYWxsZXJ5Lml0ZW1cIjtcclxuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbGxlcnkuY2FjaGVcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XHJcbmltcG9ydCB7IEltYWdlTW9kYWxDb21wb25lbnQgfSBmcm9tIFwiLi9pbWFnZS1tb2RhbC5jb21wb25lbnRcIjtcclxuaW1wb3J0ICogYXMgSW1hZ2VTb3VyY2VNb2R1bGUgZnJvbSBcImltYWdlLXNvdXJjZVwiO1xyXG5pbXBvcnQgKiBhcyBIdHRwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIlxyXG5pbXBvcnQgeyBSYWRMaXN0VmlldywgTGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXQgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL2xpc3R2aWV3XCJcclxuaW1wb3J0ICogYXMgdGltZXIgZnJvbSBcInRpbWVyXCI7XHJcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBQbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IG9uIGFzIGFwcGxpY2F0aW9uT24sIG9mZiBhcyBhcHBsaWNhdGlvbk9mZiwgbGF1bmNoRXZlbnQsIHN1c3BlbmRFdmVudCwgcmVzdW1lRXZlbnQsIGV4aXRFdmVudCwgbG93TWVtb3J5RXZlbnQsIHVuY2F1Z2h0RXJyb3JFdmVudCwgQXBwbGljYXRpb25FdmVudERhdGEsIHN0YXJ0IGFzIGFwcGxpY2F0aW9uU3RhcnQgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0ICogYXMgdXRmOCBmcm9tIFwidXRmOFwiOyBcclxuaW1wb3J0ICogYXMgIEJhc2U2NCBmcm9tIFwiYmFzZS02NFwiO1xyXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBjb25maXJtIH0gZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuaW1wb3J0ICogYXMgYXBwdmVyc2lvbiBmcm9tIFwibmF0aXZlc2NyaXB0LWFwcHZlcnNpb25cIjsgXHJcbmltcG9ydCAqIGFzIGVtYWlsIGZyb20gXCJuYXRpdmVzY3JpcHQtZW1haWxcIjtcclxuaW1wb3J0IHtzY3JlZW59IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtL3BsYXRmb3JtXCJcclxuXHJcbmltcG9ydCAqIGFzIGVsZW1lbnRSZWdpc3RyeU1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcclxuZWxlbWVudFJlZ2lzdHJ5TW9kdWxlLnJlZ2lzdGVyRWxlbWVudChcIkNhcmRWaWV3XCIsICgpID0+IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtY2FyZHZpZXdcIikuQ2FyZFZpZXcpO1xyXG5cclxuICBcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiZ2FsbGVyeVwiLFxyXG4gIHRlbXBsYXRlVXJsOiBcInBhZ2VzL2dhbGxlcnkvZ2FsbGVyeS5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9nYWxsZXJ5L2dhbGxlcnkuY3NzXCJdLFxyXG4gIHByb3ZpZGVyczogW01vZGFsRGlhbG9nU2VydmljZV1cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgR2FsbGVyeUNvbXBvbmVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuICAgIHByaXZhdGUgdmVyc2lvbjtcclxuXHJcbiAgICBwcml2YXRlIGhvc3Q7XHJcbiAgICBwcml2YXRlIHVzZXJuYW1lO1xyXG4gICAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICAgIHByaXZhdGUgcm9vdGRpcjtcclxuICAgIHByaXZhdGUgaGVhZGVycztcclxuXHJcbiAgICBwcml2YXRlIHJhZExpc3Q6IFJhZExpc3RWaWV3O1xyXG4gICAgcHJpdmF0ZSBuQ29sTWluO1xyXG4gICAgcHJpdmF0ZSBuQ29sTWF4O1xyXG5cclxuICAgIC8qXHJcbiAgICBwcml2YXRlIGltYWdlcyA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8T2JzZXJ2YWJsZUFycmF5PEdhbGxlcnlJdGVtPj4oKTtcclxuICAgIHByaXZhdGUgY3VycmVudCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICBwcml2YXRlIGhpc3RvcnkgPSBuZXcgQXJyYXkoKTtcclxuICAgICovXHJcblxyXG4gICAgLy9wcml2YXRlIG5vZGVpZDtcclxuICAgIC8vcHJpdmF0ZSBwYXRoO1xyXG4gICAgLy9wcml2YXRlIHRpdGxlO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICBwcml2YXRlIHByb2dyZXNzTnVtID0gMDtcclxuICAgIHByaXZhdGUgcHJvZ3Jlc3NUb3QgPSAwO1xyXG4gICAgcHJpdmF0ZSBwcm9ncmVzc1ZhbCA9IDA7XHJcbiAgICBwcml2YXRlIGZvb3RlciA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuICAgIHByaXZhdGUgaW1hZ2VTY2FubmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG5cdCAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSBtb2RhbFNlcnZpY2U6IE1vZGFsRGlhbG9nU2VydmljZSwgXHJcbiAgICAgIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsXHJcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgICBwcml2YXRlIGNhY2hlOiBHYWxsZXJ5Q2FjaGVcclxuICAgICkgIHtcclxuXHJcbiAgICAgIC8vY2FsYyBkaW1lbnNpb25zIGZvciByZXNwb25zaXZlIHZpZXdcclxuICAgICAgbGV0IG5Db2wxID0gTWF0aC5mbG9vcihzY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzLzMyMCkqMztcclxuICAgICAgbGV0IG5Db2wyID0gTWF0aC5mbG9vcihzY3JlZW4ubWFpblNjcmVlbi53aWR0aERJUHMvMzIwKSozO1xyXG4gICAgICBpZihuQ29sMT5uQ29sMikgeyB0aGlzLm5Db2xNYXg9bkNvbDE7IHRoaXMubkNvbE1pbj1uQ29sMn1cclxuICAgICAgZWxzZSB7IHRoaXMubkNvbE1heD1uQ29sMjsgdGhpcy5uQ29sTWluPW5Db2wxfVxyXG5cclxuICAgICAgYXBwdmVyc2lvbi5nZXRWZXJzaW9uTmFtZSgpLnRoZW4oKHY6IHN0cmluZyk9PiB7XHJcbiAgICAgICAgICB0aGlzLnZlcnNpb24gPSBcIlZlcnNpb24gXCIgKyB2O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2U7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKFwiZW5cIik7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnVzZShQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdKS5zdWJzY3JpYmUoKCk9PiB7XHJcbiAgICAgICAgdGhpcy5ob3N0ID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdFwiKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcm5hbWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IFNldHRpbmdzLmdldFN0cmluZyhcInBhc3N3b3JkXCIpO1xyXG4gICAgICAgIHRoaXMucm9vdGRpciA9IFNldHRpbmdzLmdldFN0cmluZyhcInJvb3RkaXJcIik7ICBcclxuICAgICAgICB0aGlzLnJvb3RkaXIgPSAodGhpcy5yb290ZGlyPT1udWxsKT8gXCJcIjp0aGlzLnJvb3RkaXI7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0geyBcclxuICAgICAgICAgIFwiT0NTLUFQSVJFUVVFU1RcIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCYXNpYyBcIitCYXNlNjQuZW5jb2RlKHRoaXMudXNlcm5hbWUrJzonK3RoaXMucGFzc3dvcmQpXHJcbiAgICAgICAgfSAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmNhY2hlLmltYWdlcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICB0aGlzLmhvbWUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SYWRMaXN0TG9hZGVkKGFyZ3MpIHtcclxuICAgICAgdGhpcy5yYWRMaXN0ID0gPFJhZExpc3RWaWV3PmFyZ3Mub2JqZWN0OyAgXHJcbiAgICAgIGxldCBzdGFnZ2VyZWRMYXlvdXQgPSBuZXcgTGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXQoKTtcclxuXHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJJbml0aWFsIHNjcmVlbiBvcmllbnRhdGlvbjogXCIsIHNjcmVlbi5tYWluU2NyZWVuLndpZHRoRElQcyArIFwieFwiICsgc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0RElQcyk7XHJcbiAgICAgIGlmKHNjcmVlbi5tYWluU2NyZWVuLndpZHRoRElQcz5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzKSB7XHJcbiAgICAgICAgdGhpcy5zZXRPcmllbnRhdGlvbih7bmV3VmFsdWU6IFwibGFuZHNjYXBlXCJ9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldE9yaWVudGF0aW9uKHtuZXdWYWx1ZTogXCJwb3J0cmFpdFwifSk7XHJcbiAgICAgIH0gICAgIFxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJQYWdlIEluaXQgR2FsbGVyeVwiLCBudWxsKTsgICAgICBcclxuXHJcbiAgICAgIGlmIChhcHBsaWNhdGlvbi5hbmRyb2lkKSB7XHJcbiAgICAgICAgYXBwbGljYXRpb24uYW5kcm9pZC5vbihcclxuICAgICAgICAgICAgQW5kcm9pZEFwcGxpY2F0aW9uLmFjdGl2aXR5QmFja1ByZXNzZWRFdmVudCwgXHJcbiAgICAgICAgICAgIChkYXRhOiBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5jYW5jZWwgPSB0cnVlOyAvLyBwcmV2ZW50cyBkZWZhdWx0IGJhY2sgYnV0dG9uIGJlaGF2aW9yXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2soKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICApOyAgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgLypcclxuICAgICAgYXBwbGljYXRpb25PbihyZXN1bWVFdmVudCwgKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKT0+IHtcclxuICAgICAgICAgIHRoaXMubG9hZEdhbGxlcnkoe3BhdGg6IHRoaXMucGF0aCwgbm9kZWlkOiB0aGlzLm5vZGVpZH0pO1xyXG4gICAgICB9KTsgICBcclxuICAgICAgKi8gXHJcblxyXG4gICAgICBhcHBsaWNhdGlvbk9uKFwib3JpZW50YXRpb25DaGFuZ2VkXCIsIChlKT0+eyB0aGlzLnNldE9yaWVudGF0aW9uKGUpOyB9KTsgICBcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgYXBwbGljYXRpb25PZmYoXCJvcmllbnRhdGlvbkNoYW5nZWRcIiwgdGhpcy5zZXRPcmllbnRhdGlvbik7XHJcbiAgICB9ICAgIFxyXG4gXHJcbiAgICBzZXRPcmllbnRhdGlvbihlKSB7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJTZXQgb3JpZW50YXRpb246IFwiLCBlLm5ld1ZhbHVlKTtcclxuICAgICAgaWYoZS5uZXdWYWx1ZSA9PSBcInBvcnRyYWl0XCIpIHtcclxuICAgICAgICAgIGxldCBzdGFnZ2VyZWRMYXlvdXQgPSBuZXcgTGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXQoKTtcclxuICAgICAgICAgIHN0YWdnZXJlZExheW91dC5zcGFuQ291bnQgPSB0aGlzLm5Db2xNaW47XHJcbiAgICAgICAgICBzdGFnZ2VyZWRMYXlvdXQuc2Nyb2xsRGlyZWN0aW9uID0gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgICAgdGhpcy5yYWRMaXN0Lmxpc3RWaWV3TGF5b3V0ID0gc3RhZ2dlcmVkTGF5b3V0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHN0YWdnZXJlZExheW91dCA9IG5ldyBMaXN0Vmlld1N0YWdnZXJlZExheW91dCgpO1xyXG4gICAgICAgICAgc3RhZ2dlcmVkTGF5b3V0LnNwYW5Db3VudCA9IHRoaXMubkNvbE1heDtcclxuICAgICAgICAgIHN0YWdnZXJlZExheW91dC5zY3JvbGxEaXJlY3Rpb24gPSBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgICB0aGlzLnJhZExpc3QubGlzdFZpZXdMYXlvdXQgPSBzdGFnZ2VyZWRMYXlvdXQ7XHJcbiAgICAgIH0gICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsZWFyQ3VycmVudCgpIHtcclxuICAgICAgd2hpbGUodGhpcy5jdXJyZW50Lmxlbmd0aD4wKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50LnBvcCgpOyAgIFxyXG4gICAgICB9XHJcbiAgICB9ICBcclxuXHJcbiAgICBwcml2YXRlIGhvbWUoKSB7XHJcbiAgICAgIHRoaXMuY2FjaGUuaGlzdG9yeSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoID0gdGhpcy5yb290ZGlyOyBcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkID0gXCIvXCI7XHJcbiAgICAgIHRoaXMubG9hZEdhbGxlcnkoe1xyXG4gICAgICAgIHBhdGg6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGgsIFxyXG4gICAgICAgIG5vZGVpZDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmFjaygpIHtcclxuICAgICAgaWYodGhpcy5jYWNoZS5oaXN0b3J5Lmxlbmd0aD4xKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLmNhY2hlLmhpc3RvcnkucG9wKCk7XHJcbiAgICAgICAgbGV0IGJhY2sgPSB0aGlzLmNhY2hlLmhpc3RvcnkucG9wKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkR2FsbGVyeShiYWNrKTsgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXhpdD9cIiksXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZXhpdD9cIiksXHJcbiAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIlllc1wiKSxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIk5vXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkJhY2sgY29uZmlybSBleGl0P1wiLCBudWxsKTsgXHJcbiAgICAgICAgY29uZmlybShvcHRpb25zKS50aGVuKChyZXN1bHQ6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkJhY2tcIiwgcmVzdWx0KTsgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5leGl0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleGl0KCkge1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJob3N0XCIsIFwiXCIpO1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJ1c2VybmFtZVwiLCBcIlwiKTtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicGFzc3dvcmRcIiwgXCJcIik7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInJvb3RkaXJcIiwgXCJcIik7ICAgICAgICBcclxuICAgICAgdGhpcy51dGlsLm5hdmlnYXRlKFwic2V0dGluZ3NcIik7XHJcbiAgICB9XHJcbiBcclxuICAgIHByaXZhdGUgbG9hZEdhbGxlcnkoaXRlbSkge1xyXG4gICAgICAgXHJcbiAgICAgIHRoaXMubG9hZGVyLnNob3dMb2FkZXIodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkxvYWRpbmcgYWxidW1z4oCmXCIpKTtcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwiTG9hZCBHYWxsZXJ5XCIsIGl0ZW0pOyBcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkxvYWQgR2FsbGVyeVwiLCBudWxsKTsgXHJcblxyXG4gICAgICBsZXQgcGF0aCA9IGl0ZW0ucGF0aDtcclxuICAgICAgbGV0IG5vZGVpZCA9IGl0ZW0ubm9kZWlkO1xyXG5cclxuICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbbm9kZWlkXT09bnVsbCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW25vZGVpZF0gPSBuZXcgR2FsbGVyeUl0ZW0oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jbGVhckN1cnJlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZm9vdGVyID0gXCJcIjtcclxuXHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCA9IG5vZGVpZDtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCA9IHBhdGg7XHJcbiAgICAgIGxldCBwYXRoX2NodW5rID0gcGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlID0gcGF0aF9jaHVua1twYXRoX2NodW5rLmxlbmd0aC0xXTtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGUgPSAodGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGU9PVwiXCIpPyB0aGlzLmhvc3Quc3BsaXQoXCIvL1wiKVsxXSA6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlO1xyXG5cclxuICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDA7XHJcblxyXG4gICAgICAvLyBzdHJpbmcgc2FuaXRpemVcclxuICAgICAgbGV0IHBhdGhzYW4gPSB0aGlzLnV0aWwucmVwbGFjZUFsbChwYXRoLCBcIiZcIiwgXCIlMjZcIik7ICAgICAgXHJcbiAgICAgIGxldCB1cmwgPSB0aGlzLmhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvZmlsZXMvbGlzdD9sb2NhdGlvbj1cIitwYXRoc2FuK1wiJm1lZGlhdHlwZXM9aW1hZ2UvanBlZztpbWFnZS9naWY7aW1hZ2UvcG5nO2ltYWdlL3gteGJpdG1hcDtpbWFnZS9ibXAmZmVhdHVyZXM9JmV0YWdcIjtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkdFVCBsaXN0XCIsIG51bGwpO1xyXG5cclxuICAgICAgLy8gdHJ5IGZyb20gY2FjaGUgZmlyc3RcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwiR2V0IEFsYnVtIENhY2hlXCIsIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0pO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiR2V0IEFsYnVtIENhY2hlOiBcIiArIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCwgbnVsbCk7XHJcbiAgICAgIGlmKHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0ubG9hZGVkKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIEZvdW5kISBSZXRyaWV2aW5nIGZyb20gY2FjaGVcIiwgbnVsbCk7XHJcbiAgICAgICAgZm9yKGxldCBhIGluIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMpIHtcclxuICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtc1thXTtcclxuICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIkNhY2hlIGFsYnVtIGFkZGVkXCIsIGl0ZW0pO1xyXG4gICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIGFsYnVtIGFkZGVkOiBcIiArIGEsIG51bGwpO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlRm9vdGVyKHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0udG90QWxidW1zLCAwKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uZGF0YTtcclxuXHJcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHRvbyBmYXN0IDopXHJcbiAgICAgICAgdGltZXIuc2V0VGltZW91dCgoKT0+IHsgXHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7IFxyXG4gICAgICAgICAgdGhpcy5zY2FuSW1hZ2VzKGRhdGEuZmlsZXMsIG5vZGVpZCk7XHJcbiAgICAgICAgfSwgODAwKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJDYWNoZSBOb3QgRm91bmQgOiggUmV0cmlldmluZyBmcm9tIGNsb3Vk4oCmXCIsIG51bGwpO1xyXG4gICAgICBcclxuICAgICAgICBIdHRwLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnNcclxuICAgICAgICB9KS50aGVuKChyZXNwb25zZTphbnkpPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGRhdGEgPSByZXNwb25zZS5jb250ZW50LnRvSlNPTigpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgbG9hZGluZy4gUGxlYXNlIHJldHJ5XCIpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yXCIsIGUpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoZGF0YT09bnVsbCkge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3IgRGF0YSBudWxsXCIsIG51bGwpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcInJlc3BvbnNlIHRvIFwiLCBwYXRoK1wiKFwiK25vZGVpZCtcIiksIGN1cnJlbnQgYWxidW06XCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpO1xyXG4gICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiUmVzcG9uc2UgdG8gKFwiK25vZGVpZCtcIiksIEN1cnJlbnQgYWxidW06XCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsYnVtcyA9IGRhdGEuYWxidW1zOyAgXHJcbiAgICAgICAgICAgIC8vIGVycm9yIGxvYWRpbmdcclxuICAgICAgICAgICAgaWYoYWxidW1zPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSBleGl0IGFuZCByZWNvbmZpZ3VyZVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0b3RBbGJ1bXMgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzVG90ID0gYWxidW1zLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSA9IDA7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiBpbiBhbGJ1bXMpIHtcclxuICAgICAgICAgICAgICBpZihhbGJ1bXNbal0uc2l6ZSE9MCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFsYnVtT2JqID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5wYXRoID0gYWxidW1zW2pdLnBhdGg7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGF0aF9jaHVuayA9IGFsYnVtT2JqLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRfY2h1bmsgPSB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLnRpdGxlID0gcGF0aF9jaHVua1twYXRoX2NodW5rLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLmlzQWxidW0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmouc3JjID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLm5vZGVpZCA9IGFsYnVtc1tqXS5ub2RlaWQ7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihhbGJ1bU9iai5wYXRoPT1kYXRhLmFsYnVtcGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBleGNsdWRlcyBjdXJyZW50IGFsYnVtXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYocGF0aF9jaHVuay5sZW5ndGg+Y3VycmVudF9jaHVuay5sZW5ndGgrMSkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBleGNsdWRlcyBtb3JlIGxldmVscyBhbGJ1bXNcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC5wdXNoKGFsYnVtT2JqKTtcclxuICAgICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcz09bnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMgPSBuZXcgQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcy5wdXNoKGFsYnVtT2JqKTtcclxuICAgICAgICAgICAgICAgICAgdG90QWxidW1zKys7XHJcbiAgICAgICAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIkFsYnVtIGFkZGVkIHRvIFwiK25vZGVpZCtcIjpcIiwgYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiQWxidW0gYWRkZWQgdG8gXCIrbm9kZWlkLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSsrO1xyXG4gICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAodGhpcy5wcm9ncmVzc051bSoxMDApL3RoaXMucHJvZ3Jlc3NUb3Q7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAxMDA7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS50b3RBbGJ1bXMgPSB0b3RBbGJ1bXM7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIlNldCBBbGJ1bSBDYWNoZVwiLCB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdKTtcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIlNldCBBbGJ1bSBDYWNoZTogXCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVGb290ZXIodG90QWxidW1zLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnNjYW5JbWFnZXMoZGF0YS5maWxlcywgbm9kZWlkKTtcclxuIFxyXG4gICAgICAgICAgfSwgKGUpPT4ge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3JcIiwgZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH0pOyBcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jYWNoZS5oaXN0b3J5LnB1c2goe3BhdGg6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGgsIG5vZGVpZDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2NhbkltYWdlcyhmaWxlcywgbm9kZWlkKSB7XHJcbiAgICAgIC8vIGNoZWNrcyBmb3IgYXZhaWxhYmxlIGltYWdlc1xyXG4gICAgICBsZXQgdG9TaG93TG9hZGVyID0gZmFsc2U7XHJcbiAgICAgIGxldCB0b3RGaWxlcyA9IDA7XHJcbiAgICAgIGxldCB0b3RBbGJ1bXMgPSB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLnRvdEFsYnVtcztcclxuXHJcbiAgICAgIGZvcihsZXQgaSBpbiBmaWxlcykge1xyXG4gICAgICAgIGxldCBmaWxlcGF0aCA9IFwiXCI7XHJcbiAgICAgICAgbGV0IGZpbGVwYXRoX2NodW5rID0gZmlsZXNbaV0ucGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgZm9yKGxldCBjPTA7IGM8ZmlsZXBhdGhfY2h1bmsubGVuZ3RoLTE7IGMrKykge1xyXG4gICAgICAgICAgZmlsZXBhdGggKz0gZmlsZXBhdGhfY2h1bmtbY10gKyBcIi9cIlxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihmaWxlcGF0aD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCtcIi9cIikge1xyXG4gICAgICAgICAgdG90RmlsZXMrKztcclxuICAgICAgICAgIHRvU2hvd0xvYWRlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZih0b1Nob3dMb2FkZXIpIHtcclxuICAgICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJMb2FkaW5nIGltYWdlc+KAplwiKSk7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc051bSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc1RvdCA9IHRvdEZpbGVzO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUZvb3Rlcih0b3RBbGJ1bXMsIHRvdEZpbGVzKTtcclxuICAgICAgfSBcclxuXHJcbiAgICAgIGZvcihsZXQgaSBpbiBmaWxlcykgeyBcclxuICAgICAgICB0aGlzLmltYWdlU2Nhbm5lciA9IHRpbWVyLnNldFRpbWVvdXQoXHJcbiAgICAgICAgICAoKT0+IHsgdGhpcy5sb2FkSW1hZ2VzKG5vZGVpZCwgZmlsZXNbZmlsZXMubGVuZ3RoLTEtKCtpKV0pIH0sIFxyXG4gICAgICAgICAgMzAwKigraSkpO1xyXG4gICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZEltYWdlcyhhbGJ1bWlkLCBpdGVtKSB7XHJcbiAgICAgIGlmKGFsYnVtaWQ9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCkgeyBcclxuICAgICAgICBsZXQgZmlsZXBhdGggPSBcIlwiO1xyXG4gICAgICAgIGxldCBmaWxlcGF0aF9jaHVuayA9IGl0ZW0ucGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgZm9yKGxldCBjPTA7IGM8ZmlsZXBhdGhfY2h1bmsubGVuZ3RoLTE7IGMrKykge1xyXG4gICAgICAgICAgZmlsZXBhdGggKz0gZmlsZXBhdGhfY2h1bmtbY10gKyBcIi9cIlxyXG4gICAgICAgIH1cclxuIFxyXG4gICAgICAgIGlmKGZpbGVwYXRoPT10aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoK1wiL1wiKSB7XHJcbiAgICAgICAgICBsZXQgaW1ndXJscm9vdCA9IHRoaXMuaG9zdCtcIi9pbmRleC5waHAvYXBwcy9nYWxsZXJ5L2FwaS9wcmV2aWV3L1wiICsgaXRlbS5ub2RlaWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICBIdHRwLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgIHVybDogaW1ndXJscm9vdCArIFwiLzE1MC8xNTBcIixcclxuICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzXHJcbiAgICAgICAgICB9KS50aGVuKChyZXNwb25zZTphbnkpPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYoYWxidW1pZD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkKSB7IFxyXG4gICAgICAgICAgICAgIGxldCBpbWdPYmogPSBuZXcgR2FsbGVyeUl0ZW0oKTtcclxuICAgICAgICAgICAgICByZXNwb25zZS5jb250ZW50LnRvSW1hZ2UoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGltYWdlKT0+IHtcclxuICAgICAgICAgICAgICAgICAgbGV0IGJhc2U2NCA9IGltYWdlLnRvQmFzZTY0U3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai5zcmMgPSBiYXNlNjQ7XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai50aXRsZSA9IGZpbGVwYXRoX2NodW5rW2ZpbGVwYXRoX2NodW5rLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgICAgICAgaW1nT2JqLnVybCA9IGltZ3VybHJvb3Q7XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai5tdGltZSA9IGl0ZW0ubXRpbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQucHVzaChpbWdPYmopO1xyXG4gICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmltYWdlcz09bnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaW1hZ2VzID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaW1hZ2VzW2l0ZW0ubm9kZWlkXSA9IGltZ09iajtcclxuICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSsrO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzVmFsID0gKHRoaXMucHJvZ3Jlc3NOdW0qMTAwKS90aGlzLnByb2dyZXNzVG90O1xyXG4gICAgICAgICAgICAgICAgICAvL3RoaXMudXRpbC5sb2coXCJmaWxlIGFkZGVkIHRvIFwiK2FsYnVtaWQrXCI6IFwiLCBcIihcIiArIGl0ZW0ubm9kZWlkICsgXCIpIFwiICsgaXRlbS5wYXRoICsgXCIgLSBcIiArIGl0ZW0ubXRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRmlsZSBhZGRlZCB0byBcIithbGJ1bWlkK1wiIChcIiArIGl0ZW0ubm9kZWlkICsgXCIpIC0gXCIgKyBpdGVtLm10aW1lLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+IHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcImVycm9yXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pOyAgXHJcblxyXG5cdFx0XHRcdC8vIGhpZGUgdGhlIGxvYWRlciB3aGVuIGZpcnN0IGltYWdlIGluIGRpcmVjdG9yeSBpcyBsb2FkZWRcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRpbWVyLmNsZWFyVGltZW91dCh0aGlzLmltYWdlU2Nhbm5lcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUZvb3RlcihudW1BbGJ1bXMsIG51bUZpbGVzKSB7XHJcbiAgICAgIGxldCBmb290ZXJBbGJ1bSA9IChudW1BbGJ1bXM+MCk/IG51bUFsYnVtcyArIFwiIFwiICsgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkNvbGxlY3Rpb25zXCIpIDogXCJcIjtcclxuICAgICAgbGV0IGZvb3RlckZpbGVzID0gKG51bUZpbGVzPjApPyBudW1GaWxlcyArIFwiIFwiICsgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkZpbGVzXCIpIDogXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgPSBcIlwiO1xyXG4gICAgICB0aGlzLmZvb3RlciArPSBmb290ZXJBbGJ1bTtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gKG51bUFsYnVtcz4wICYmIG51bUZpbGVzPjApPyBcIiAvIFwiIDogXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gZm9vdGVyRmlsZXM7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJ1cGRhdGVGb290ZXJcIiwgdGhpcy5mb290ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVGFwRm9sZGVyKGl0ZW0pIHtcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwidGFwXCIsIGl0ZW0pO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiVGFwIGl0ZW0gZm9sZGVyXCIsIG51bGwpO1xyXG4gICAgICB0aGlzLmxvYWRHYWxsZXJ5KGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVGFwSW1hZ2UoaXRlbSkge1xyXG4gICAgICAvL3RoaXMudXRpbC5sb2coXCJ0YXBcIiwgaXRlbS50aXRsZSk7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJUYXAgaXRlbSBpbWFnZVwiLCBudWxsKTtcclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBpbWFnZeKAplwiKSk7IFxyXG5cclxuICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBjb250ZXh0OiB7XHJcbiAgICAgICAgICAgIGxvYWRlcjogdGhpcy5sb2FkZXIsXHJcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWZcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMubW9kYWxTZXJ2aWNlLnNob3dNb2RhbChJbWFnZU1vZGFsQ29tcG9uZW50LCBvcHRpb25zKVxyXG4gICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHsgICAgICBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZExvZygpIHtcclxuICAgICAgaWYodGhpcy51dGlsLkRFQlVHICYmIHRoaXMudXRpbC5MT0dUT1NFVFRJTkdTKSB7XHJcbiAgICAgICAgZW1haWwuY29tcG9zZSh7XHJcbiAgICAgICAgICBzdWJqZWN0OiBcIkNsb3VkIEdhbGxlcnkgTG9nXCIsXHJcbiAgICAgICAgICBib2R5OiBTZXR0aW5ncy5nZXRTdHJpbmcoXCJfTE9HXCIpLFxyXG4gICAgICAgICAgdG86IFsnaW5mb0BsaW5mYXNlcnZpY2UuaXQnXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgIFxyXG5cclxufVxyXG4iXX0=