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
var util = require("utils/utils");
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
    GalleryComponent.prototype.showDonateDialog = function () {
        var donate = Settings.getString("donate");
        if (donate != "ok") {
            dialogs_1.confirm({
                title: this.translate.instant("Do you like Cloud Gallery?"),
                message: this.translate.instant("Cloud Gallery is an open source project and your help can speed up development. If you like Cloud Gallery please consider to offer a donation. Thanks!"),
                okButtonText: this.translate.instant("Donate"),
                cancelButtonText: this.translate.instant("Close and not remember"),
                neutralButtonText: this.translate.instant("Remember later")
            }).then(function (result) {
                if (result != null) {
                    if (result) {
                        util.openUrl("https://paypal.me/linfaservice");
                    }
                    else {
                        Settings.setString("donate", "ok");
                    }
                }
            });
        }
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
        Settings.setString("donate", "");
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
                if (_this.cache.currentAlbum.nodeid == "/") {
                    _this.showDonateDialog();
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxsZXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUErQjtBQUMvQixzQ0FBb0U7QUFDcEUsMENBQXlDO0FBQ3pDLDhDQUF5QztBQUN6QywwREFBd0Q7QUFDeEQsNERBQXNEO0FBQ3RELDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsMkVBQXlFO0FBQ3pFLGtFQUF1RTtBQUN2RSxpRUFBOEQ7QUFFOUQsNENBQTZDO0FBQzdDLGlFQUEyRjtBQUMzRiw2QkFBK0I7QUFDL0IsK0NBQWlEO0FBQ2pELG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsMkNBQWlOO0FBRWpOLGdDQUFtQztBQUNuQyx5Q0FBMkM7QUFDM0MsMkNBQXNGO0FBQ3RGLHNDQUFxQztBQUNyQyxvREFBc0Q7QUFDdEQsMENBQTRDO0FBQzVDLCtEQUEwRDtBQUMxRCxrQ0FBb0M7QUFFcEMsNkVBQStFO0FBRS9FLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0FBV25HO0lBaUNJLDBCQUNVLElBQVUsRUFDWCxJQUFVLEVBQ1QsUUFBNEIsRUFDNUIsWUFBZ0MsRUFDaEMsS0FBdUIsRUFDdkIsU0FBMkIsRUFDM0IsS0FBbUI7UUFQN0IsaUJBb0NDO1FBbkNTLFNBQUksR0FBSixJQUFJLENBQU07UUFDWCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLFVBQUssR0FBTCxLQUFLLENBQWM7UUF6QjdCOzs7O1VBSUU7UUFFRixpQkFBaUI7UUFDakIsZUFBZTtR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QUFFLENBQUMsMkJBQTJCLENBQUM7WUFDeEMsU0FBUyxFQUFFLENBQUMsaUNBQWtCLENBQUM7U0FDaEMsQ0FBQzt5Q0FxQ2tCLFdBQUk7WUFDTCxXQUFJO1lBQ0MsOENBQWtCO1lBQ2QsaUNBQWtCO1lBQ3pCLHVCQUFnQjtZQUNaLGdDQUFnQjtZQUNwQix1QkFBWTtPQXhDcEIsZ0JBQWdCLENBZ2U1QjtJQUFELHVCQUFDO0NBQUEsQUFoZUQsSUFnZUM7QUFoZVksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXRpbFwiO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gXCIuLi8uLi9jb21tb24vbG9hZGVyXCI7XHJcbmltcG9ydCB7IEdhbGxlcnlJdGVtIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9nYWxsZXJ5Lml0ZW1cIjtcclxuaW1wb3J0IEdhbGxlcnlDYWNoZSBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbGxlcnkuY2FjaGVcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0IHsgVE5TRm9udEljb25TZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LW5neC1mb250aWNvbic7XHJcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XHJcbmltcG9ydCB7IEltYWdlTW9kYWxDb21wb25lbnQgfSBmcm9tIFwiLi9pbWFnZS1tb2RhbC5jb21wb25lbnRcIjtcclxuaW1wb3J0ICogYXMgSW1hZ2VTb3VyY2VNb2R1bGUgZnJvbSBcImltYWdlLXNvdXJjZVwiO1xyXG5pbXBvcnQgKiBhcyBIdHRwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2h0dHBcIlxyXG5pbXBvcnQgeyBSYWRMaXN0VmlldywgTGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXQgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVyaWstdWktcHJvL2xpc3R2aWV3XCJcclxuaW1wb3J0ICogYXMgdGltZXIgZnJvbSBcInRpbWVyXCI7XHJcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBQbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gXCJuZzItdHJhbnNsYXRlXCI7XHJcbmltcG9ydCB7IG9uIGFzIGFwcGxpY2F0aW9uT24sIG9mZiBhcyBhcHBsaWNhdGlvbk9mZiwgbGF1bmNoRXZlbnQsIHN1c3BlbmRFdmVudCwgcmVzdW1lRXZlbnQsIGV4aXRFdmVudCwgbG93TWVtb3J5RXZlbnQsIHVuY2F1Z2h0RXJyb3JFdmVudCwgQXBwbGljYXRpb25FdmVudERhdGEsIHN0YXJ0IGFzIGFwcGxpY2F0aW9uU3RhcnQgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0ICogYXMgdXRmOCBmcm9tIFwidXRmOFwiOyBcclxuaW1wb3J0ICogYXMgIEJhc2U2NCBmcm9tIFwiYmFzZS02NFwiO1xyXG5pbXBvcnQgKiBhcyBhcHBsaWNhdGlvbiBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgQW5kcm9pZEFwcGxpY2F0aW9uLCBBbmRyb2lkQWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50RGF0YSB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5pbXBvcnQgeyBjb25maXJtIH0gZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuaW1wb3J0ICogYXMgYXBwdmVyc2lvbiBmcm9tIFwibmF0aXZlc2NyaXB0LWFwcHZlcnNpb25cIjsgXHJcbmltcG9ydCAqIGFzIGVtYWlsIGZyb20gXCJuYXRpdmVzY3JpcHQtZW1haWxcIjtcclxuaW1wb3J0IHtzY3JlZW59IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtL3BsYXRmb3JtXCI7XHJcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcInV0aWxzL3V0aWxzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBlbGVtZW50UmVnaXN0cnlNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XHJcbmltcG9ydCB7IHNldFRpbWVvdXQgfSBmcm9tIFwidGltZXJzXCI7XHJcbmVsZW1lbnRSZWdpc3RyeU1vZHVsZS5yZWdpc3RlckVsZW1lbnQoXCJDYXJkVmlld1wiLCAoKSA9PiByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWNhcmR2aWV3XCIpLkNhcmRWaWV3KTtcclxuXHJcbiAgIFxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJnYWxsZXJ5XCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwicGFnZXMvZ2FsbGVyeS9nYWxsZXJ5Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcInBhZ2VzL2dhbGxlcnkvZ2FsbGVyeS5jc3NcIl0sXHJcbiAgcHJvdmlkZXJzOiBbTW9kYWxEaWFsb2dTZXJ2aWNlXVxyXG59KVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBHYWxsZXJ5Q29tcG9uZW50IHtcclxuXHJcbiAgICBwcml2YXRlIGxhbmd1YWdlO1xyXG4gICAgcHJpdmF0ZSB2ZXJzaW9uO1xyXG5cclxuICAgIHByaXZhdGUgaG9zdDtcclxuICAgIHByaXZhdGUgdXNlcm5hbWU7XHJcbiAgICBwcml2YXRlIHBhc3N3b3JkO1xyXG4gICAgcHJpdmF0ZSByb290ZGlyO1xyXG4gICAgcHJpdmF0ZSBoZWFkZXJzO1xyXG5cclxuICAgIHByaXZhdGUgcmFkTGlzdDogUmFkTGlzdFZpZXc7XHJcbiAgICBwcml2YXRlIG5Db2xNaW47XHJcbiAgICBwcml2YXRlIG5Db2xNYXg7XHJcblxyXG4gICAgLypcclxuICAgIHByaXZhdGUgaW1hZ2VzID0gbmV3IE9ic2VydmFibGVBcnJheTxPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+PigpO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50ID0gbmV3IE9ic2VydmFibGVBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgIHByaXZhdGUgaGlzdG9yeSA9IG5ldyBBcnJheSgpO1xyXG4gICAgKi9cclxuXHJcbiAgICAvL3ByaXZhdGUgbm9kZWlkO1xyXG4gICAgLy9wcml2YXRlIHBhdGg7XHJcbiAgICAvL3ByaXZhdGUgdGl0bGU7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50ID0gbmV3IE9ic2VydmFibGVBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgIHByaXZhdGUgcHJvZ3Jlc3NOdW0gPSAwO1xyXG4gICAgcHJpdmF0ZSBwcm9ncmVzc1RvdCA9IDA7XHJcbiAgICBwcml2YXRlIHByb2dyZXNzVmFsID0gMDtcclxuICAgIHByaXZhdGUgZm9vdGVyID0gXCJcIjtcclxuICAgIHByaXZhdGUgbG9hZGVyID0gbmV3IExvYWRlcigpO1xyXG4gICAgcHJpdmF0ZSBpbWFnZVNjYW5uZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXHJcblx0ICAgIHByaXZhdGUgdXRpbDogVXRpbCxcclxuICAgICAgcHJpdmF0ZSBmb250aWNvbjogVE5TRm9udEljb25TZXJ2aWNlLFxyXG4gICAgICBwcml2YXRlIG1vZGFsU2VydmljZTogTW9kYWxEaWFsb2dTZXJ2aWNlLCBcclxuICAgICAgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZixcclxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICAgIHByaXZhdGUgY2FjaGU6IEdhbGxlcnlDYWNoZVxyXG4gICAgKSAge1xyXG5cclxuICAgICAgLy9jYWxjIGRpbWVuc2lvbnMgZm9yIHJlc3BvbnNpdmUgdmlld1xyXG4gICAgICBsZXQgbkNvbDEgPSBNYXRoLmZsb29yKHNjcmVlbi5tYWluU2NyZWVuLmhlaWdodERJUHMvMzIwKSozO1xyXG4gICAgICBsZXQgbkNvbDIgPSBNYXRoLmZsb29yKHNjcmVlbi5tYWluU2NyZWVuLndpZHRoRElQcy8zMjApKjM7XHJcbiAgICAgIGlmKG5Db2wxPm5Db2wyKSB7IHRoaXMubkNvbE1heD1uQ29sMTsgdGhpcy5uQ29sTWluPW5Db2wyfVxyXG4gICAgICBlbHNlIHsgdGhpcy5uQ29sTWF4PW5Db2wyOyB0aGlzLm5Db2xNaW49bkNvbDF9XHJcblxyXG4gICAgICBhcHB2ZXJzaW9uLmdldFZlcnNpb25OYW1lKCkudGhlbigodjogc3RyaW5nKT0+IHtcclxuICAgICAgICAgIHRoaXMudmVyc2lvbiA9IFwiVmVyc2lvbiBcIiArIHY7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5sYW5ndWFnZSA9IFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoXCJlblwiKTtcclxuICAgICAgdGhpcy50cmFuc2xhdGUudXNlKFBsYXRmb3JtLmRldmljZS5sYW5ndWFnZS5zcGxpdChcIi1cIilbMF0pLnN1YnNjcmliZSgoKT0+IHtcclxuICAgICAgICB0aGlzLmhvc3QgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0XCIpO1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VybmFtZVwiKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicGFzc3dvcmRcIik7XHJcbiAgICAgICAgdGhpcy5yb290ZGlyID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwicm9vdGRpclwiKTsgIFxyXG4gICAgICAgIHRoaXMucm9vdGRpciA9ICh0aGlzLnJvb3RkaXI9PW51bGwpPyBcIlwiOnRoaXMucm9vdGRpcjtcclxuICAgICAgICB0aGlzLmhlYWRlcnMgPSB7IFxyXG4gICAgICAgICAgXCJPQ1MtQVBJUkVRVUVTVFwiOiBcInRydWVcIixcclxuICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJhc2ljIFwiK0Jhc2U2NC5lbmNvZGUodGhpcy51c2VybmFtZSsnOicrdGhpcy5wYXNzd29yZClcclxuICAgICAgICB9ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgICAgIHRoaXMuaG9tZSgpO1xyXG4gICAgICB9KTsgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIG9uUmFkTGlzdExvYWRlZChhcmdzKSB7XHJcbiAgICAgIHRoaXMucmFkTGlzdCA9IDxSYWRMaXN0Vmlldz5hcmdzLm9iamVjdDsgIFxyXG4gICAgICBsZXQgc3RhZ2dlcmVkTGF5b3V0ID0gbmV3IExpc3RWaWV3U3RhZ2dlcmVkTGF5b3V0KCk7XHJcblxyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiSW5pdGlhbCBzY3JlZW4gb3JpZW50YXRpb246IFwiLCBzY3JlZW4ubWFpblNjcmVlbi53aWR0aERJUHMgKyBcInhcIiArIHNjcmVlbi5tYWluU2NyZWVuLmhlaWdodERJUHMpO1xyXG4gICAgICBpZihzY3JlZW4ubWFpblNjcmVlbi53aWR0aERJUHM+c2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0RElQcykge1xyXG4gICAgICAgIHRoaXMuc2V0T3JpZW50YXRpb24oe25ld1ZhbHVlOiBcImxhbmRzY2FwZVwifSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRPcmllbnRhdGlvbih7bmV3VmFsdWU6IFwicG9ydHJhaXRcIn0pO1xyXG4gICAgICB9ICAgICBcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgdGhpcy5wYWdlLmFjdGlvbkJhckhpZGRlbiA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiUGFnZSBJbml0IEdhbGxlcnlcIiwgbnVsbCk7ICAgICAgXHJcblxyXG4gICAgICBpZiAoYXBwbGljYXRpb24uYW5kcm9pZCkge1xyXG4gICAgICAgIGFwcGxpY2F0aW9uLmFuZHJvaWQub24oXHJcbiAgICAgICAgICAgIEFuZHJvaWRBcHBsaWNhdGlvbi5hY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnQsIFxyXG4gICAgICAgICAgICAoZGF0YTogQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGRhdGEuY2FuY2VsID0gdHJ1ZTsgLy8gcHJldmVudHMgZGVmYXVsdCBiYWNrIGJ1dHRvbiBiZWhhdmlvclxyXG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrKCk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgKTsgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qXHJcbiAgICAgIGFwcGxpY2F0aW9uT24ocmVzdW1lRXZlbnQsIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSk9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRHYWxsZXJ5KHtwYXRoOiB0aGlzLnBhdGgsIG5vZGVpZDogdGhpcy5ub2RlaWR9KTtcclxuICAgICAgfSk7ICAgXHJcbiAgICAgICovXHJcblxyXG4gICAgICBhcHBsaWNhdGlvbk9uKFwib3JpZW50YXRpb25DaGFuZ2VkXCIsIChlKT0+eyB0aGlzLnNldE9yaWVudGF0aW9uKGUpOyB9KTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIG5nT25EZXN0cm95KCkge1xyXG4gICAgICBhcHBsaWNhdGlvbk9mZihcIm9yaWVudGF0aW9uQ2hhbmdlZFwiLCB0aGlzLnNldE9yaWVudGF0aW9uKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgc2V0T3JpZW50YXRpb24oZSkge1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiU2V0IG9yaWVudGF0aW9uOiBcIiwgZS5uZXdWYWx1ZSk7XHJcbiAgICAgIGlmKGUubmV3VmFsdWUgPT0gXCJwb3J0cmFpdFwiKSB7XHJcbiAgICAgICAgICBsZXQgc3RhZ2dlcmVkTGF5b3V0ID0gbmV3IExpc3RWaWV3U3RhZ2dlcmVkTGF5b3V0KCk7XHJcbiAgICAgICAgICBzdGFnZ2VyZWRMYXlvdXQuc3BhbkNvdW50ID0gdGhpcy5uQ29sTWluO1xyXG4gICAgICAgICAgc3RhZ2dlcmVkTGF5b3V0LnNjcm9sbERpcmVjdGlvbiA9IFwiVmVydGljYWxcIjtcclxuICAgICAgICAgIHRoaXMucmFkTGlzdC5saXN0Vmlld0xheW91dCA9IHN0YWdnZXJlZExheW91dDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBzdGFnZ2VyZWRMYXlvdXQgPSBuZXcgTGlzdFZpZXdTdGFnZ2VyZWRMYXlvdXQoKTtcclxuICAgICAgICAgIHN0YWdnZXJlZExheW91dC5zcGFuQ291bnQgPSB0aGlzLm5Db2xNYXg7XHJcbiAgICAgICAgICBzdGFnZ2VyZWRMYXlvdXQuc2Nyb2xsRGlyZWN0aW9uID0gXCJWZXJ0aWNhbFwiO1xyXG4gICAgICAgICAgdGhpcy5yYWRMaXN0Lmxpc3RWaWV3TGF5b3V0ID0gc3RhZ2dlcmVkTGF5b3V0O1xyXG4gICAgICB9ICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGVhckN1cnJlbnQoKSB7XHJcbiAgICAgIHdoaWxlKHRoaXMuY3VycmVudC5sZW5ndGg+MCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudC5wb3AoKTsgICBcclxuICAgICAgfVxyXG4gICAgfSAgXHJcblxyXG4gICAgcHJpdmF0ZSBob21lKCkge1xyXG4gICAgICB0aGlzLmNhY2hlLmhpc3RvcnkgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCA9IHRoaXMucm9vdGRpcjsgXHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCA9IFwiL1wiO1xyXG4gICAgICB0aGlzLmxvYWRHYWxsZXJ5KHtcclxuICAgICAgICBwYXRoOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoLCBcclxuICAgICAgICBub2RlaWQ6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZFxyXG4gICAgICB9KTsgICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dEb25hdGVEaWFsb2coKSB7XHJcbiAgICAgIGxldCBkb25hdGUgPSBTZXR0aW5ncy5nZXRTdHJpbmcoXCJkb25hdGVcIik7XHJcbiAgICAgIFxyXG4gICAgICBpZihkb25hdGUhPVwib2tcIikge1xyXG4gICAgICAgIGNvbmZpcm0oe1xyXG4gICAgICAgICAgdGl0bGU6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJEbyB5b3UgbGlrZSBDbG91ZCBHYWxsZXJ5P1wiKSxcclxuICAgICAgICAgIG1lc3NhZ2U6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJDbG91ZCBHYWxsZXJ5IGlzIGFuIG9wZW4gc291cmNlIHByb2plY3QgYW5kIHlvdXIgaGVscCBjYW4gc3BlZWQgdXAgZGV2ZWxvcG1lbnQuIElmIHlvdSBsaWtlIENsb3VkIEdhbGxlcnkgcGxlYXNlIGNvbnNpZGVyIHRvIG9mZmVyIGEgZG9uYXRpb24uIFRoYW5rcyFcIiksXHJcbiAgICAgICAgICBva0J1dHRvblRleHQ6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJEb25hdGVcIiksXHJcbiAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiQ2xvc2UgYW5kIG5vdCByZW1lbWJlclwiKSxcclxuICAgICAgICAgIG5ldXRyYWxCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiUmVtZW1iZXIgbGF0ZXJcIilcclxuICAgICAgICB9KS50aGVuKChyZXN1bHQ6Ym9vbGVhbik9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdCE9bnVsbCkge1xyXG4gICAgICAgICAgICAgIGlmKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5vcGVuVXJsKFwiaHR0cHM6Ly9wYXlwYWwubWUvbGluZmFzZXJ2aWNlXCIpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJkb25hdGVcIiwgXCJva1wiKTsgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAgXHJcbiAgICAgIH0gICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBiYWNrKCkge1xyXG4gICAgICBpZih0aGlzLmNhY2hlLmhpc3RvcnkubGVuZ3RoPjEpIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IHRoaXMuY2FjaGUuaGlzdG9yeS5wb3AoKTtcclxuICAgICAgICBsZXQgYmFjayA9IHRoaXMuY2FjaGUuaGlzdG9yeS5wb3AoKTtcclxuICAgICAgICB0aGlzLmxvYWRHYWxsZXJ5KGJhY2spOyBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFeGl0P1wiKSxcclxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBleGl0P1wiKSxcclxuICAgICAgICAgICAgb2tCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiWWVzXCIpLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTm9cIilcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiQmFjayBjb25maXJtIGV4aXQ/XCIsIG51bGwpOyBcclxuICAgICAgICBjb25maXJtKG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiQmFja1wiLCByZXN1bHQpOyAgICAgICAgICBcclxuICAgICAgICAgICAgaWYocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmV4aXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4aXQoKSB7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcImhvc3RcIiwgXCJcIik7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInVzZXJuYW1lXCIsIFwiXCIpO1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJwYXNzd29yZFwiLCBcIlwiKTtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicm9vdGRpclwiLCBcIlwiKTsgICAgIFxyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJkb25hdGVcIiwgXCJcIik7ICAgICBcclxuICAgICAgdGhpcy51dGlsLm5hdmlnYXRlKFwic2V0dGluZ3NcIik7XHJcbiAgICB9XHJcbiBcclxuICAgIHByaXZhdGUgbG9hZEdhbGxlcnkoaXRlbSkge1xyXG4gICAgICAgXHJcbiAgICAgIHRoaXMubG9hZGVyLnNob3dMb2FkZXIodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkxvYWRpbmcgYWxidW1z4oCmXCIpKTtcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwiTG9hZCBHYWxsZXJ5XCIsIGl0ZW0pOyBcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkxvYWQgR2FsbGVyeVwiLCBudWxsKTsgXHJcblxyXG4gICAgICBsZXQgcGF0aCA9IGl0ZW0ucGF0aDtcclxuICAgICAgbGV0IG5vZGVpZCA9IGl0ZW0ubm9kZWlkO1xyXG5cclxuICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbbm9kZWlkXT09bnVsbCkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW25vZGVpZF0gPSBuZXcgR2FsbGVyeUl0ZW0oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jbGVhckN1cnJlbnQoKTtcclxuXHJcbiAgICAgIHRoaXMuZm9vdGVyID0gXCJcIjtcclxuXHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCA9IG5vZGVpZDtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCA9IHBhdGg7XHJcbiAgICAgIGxldCBwYXRoX2NodW5rID0gcGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlID0gcGF0aF9jaHVua1twYXRoX2NodW5rLmxlbmd0aC0xXTtcclxuICAgICAgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGUgPSAodGhpcy5jYWNoZS5jdXJyZW50QWxidW0udGl0bGU9PVwiXCIpPyB0aGlzLmhvc3Quc3BsaXQoXCIvL1wiKVsxXSA6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlO1xyXG5cclxuICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDA7XHJcblxyXG4gICAgICAvLyBzdHJpbmcgc2FuaXRpemVcclxuICAgICAgbGV0IHBhdGhzYW4gPSB0aGlzLnV0aWwucmVwbGFjZUFsbChwYXRoLCBcIiZcIiwgXCIlMjZcIik7ICAgICAgXHJcbiAgICAgIGxldCB1cmwgPSB0aGlzLmhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvZmlsZXMvbGlzdD9sb2NhdGlvbj1cIitwYXRoc2FuK1wiJm1lZGlhdHlwZXM9aW1hZ2UvanBlZztpbWFnZS9naWY7aW1hZ2UvcG5nO2ltYWdlL3gteGJpdG1hcDtpbWFnZS9ibXAmZmVhdHVyZXM9JmV0YWdcIjtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkdFVCBsaXN0XCIsIG51bGwpO1xyXG5cclxuICAgICAgLy8gdHJ5IGZyb20gY2FjaGUgZmlyc3RcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwiR2V0IEFsYnVtIENhY2hlXCIsIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0pO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiR2V0IEFsYnVtIENhY2hlOiBcIiArIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCwgbnVsbCk7XHJcbiAgICAgIGlmKHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0ubG9hZGVkKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIEZvdW5kISBSZXRyaWV2aW5nIGZyb20gY2FjaGVcIiwgbnVsbCk7XHJcbiAgICAgICAgZm9yKGxldCBhIGluIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMpIHtcclxuICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtc1thXTtcclxuICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcIkNhY2hlIGFsYnVtIGFkZGVkXCIsIGl0ZW0pO1xyXG4gICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkNhY2hlIGFsYnVtIGFkZGVkOiBcIiArIGEsIG51bGwpO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlRm9vdGVyKHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0udG90QWxidW1zLCAwKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uZGF0YTtcclxuXHJcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHRvbyBmYXN0IDopXHJcbiAgICAgICAgdGltZXIuc2V0VGltZW91dCgoKT0+IHsgXHJcbiAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7IFxyXG4gICAgICAgICAgdGhpcy5zY2FuSW1hZ2VzKGRhdGEuZmlsZXMsIG5vZGVpZCk7XHJcbiAgICAgICAgfSwgODAwKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJDYWNoZSBOb3QgRm91bmQgOiggUmV0cmlldmluZyBmcm9tIGNsb3Vk4oCmXCIsIG51bGwpO1xyXG4gICAgICBcclxuICAgICAgICBIdHRwLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnNcclxuICAgICAgICB9KS50aGVuKChyZXNwb25zZTphbnkpPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGRhdGEgPSByZXNwb25zZS5jb250ZW50LnRvSlNPTigpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgbG9hZGluZy4gUGxlYXNlIHJldHJ5XCIpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yXCIsIGUpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoZGF0YT09bnVsbCkge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3IgRGF0YSBudWxsXCIsIG51bGwpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy51dGlsLmxvZyhcInJlc3BvbnNlIHRvIFwiLCBwYXRoK1wiKFwiK25vZGVpZCtcIiksIGN1cnJlbnQgYWxidW06XCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpO1xyXG4gICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiUmVzcG9uc2UgdG8gKFwiK25vZGVpZCtcIiksIEN1cnJlbnQgYWxidW06XCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsYnVtcyA9IGRhdGEuYWxidW1zOyAgXHJcbiAgICAgICAgICAgIC8vIGVycm9yIGxvYWRpbmdcclxuICAgICAgICAgICAgaWYoYWxidW1zPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSBleGl0IGFuZCByZWNvbmZpZ3VyZVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcblxyXG4gICAgICAgICAgICBsZXQgdG90QWxidW1zID0gMDtcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1RvdCA9IGFsYnVtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NOdW0gPSAwO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogaW4gYWxidW1zKSB7XHJcbiAgICAgICAgICAgICAgaWYoYWxidW1zW2pdLnNpemUhPTApIHtcclxuICAgICAgICAgICAgICAgIGxldCBhbGJ1bU9iaiA9IG5ldyBHYWxsZXJ5SXRlbSgpO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmoucGF0aCA9IGFsYnVtc1tqXS5wYXRoO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGhfY2h1bmsgPSBhbGJ1bU9iai5wYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50X2NodW5rID0gdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai50aXRsZSA9IHBhdGhfY2h1bmtbcGF0aF9jaHVuay5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5pc0FsYnVtID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLnNyYyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5ub2RlaWQgPSBhbGJ1bXNbal0ubm9kZWlkO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmouaXRlbXMgPSBuZXcgQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoYWxidW1PYmoucGF0aD09ZGF0YS5hbGJ1bXBhdGgpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gZXhjbHVkZXMgY3VycmVudCBhbGJ1bVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHBhdGhfY2h1bmsubGVuZ3RoPmN1cnJlbnRfY2h1bmsubGVuZ3RoKzEpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gZXhjbHVkZXMgbW9yZSBsZXZlbHMgYWxidW1zXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQucHVzaChhbGJ1bU9iaik7XHJcbiAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXM9PW51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXMucHVzaChhbGJ1bU9iaik7XHJcbiAgICAgICAgICAgICAgICAgIHRvdEFsYnVtcysrO1xyXG4gICAgICAgICAgICAgICAgICAvL3RoaXMudXRpbC5sb2coXCJBbGJ1bSBhZGRlZCB0byBcIitub2RlaWQrXCI6XCIsIGFsYnVtT2JqKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkFsYnVtIGFkZGVkIHRvIFwiK25vZGVpZCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NOdW0rKztcclxuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzVmFsID0gKHRoaXMucHJvZ3Jlc3NOdW0qMTAwKS90aGlzLnByb2dyZXNzVG90O1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzVmFsID0gMTAwO1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0udG90QWxidW1zID0gdG90QWxidW1zO1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICAvL3RoaXMudXRpbC5sb2coXCJTZXQgQWxidW0gQ2FjaGVcIiwgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXSk7XHJcbiAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJTZXQgQWxidW0gQ2FjaGU6IFwiICsgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm9vdGVyKHRvdEFsYnVtcywgMCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5zY2FuSW1hZ2VzKGRhdGEuZmlsZXMsIG5vZGVpZCk7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQ9PVwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zaG93RG9uYXRlRGlhbG9nKCk7XHJcbiAgICAgICAgICAgIH1cclxuIFxyXG4gICAgICAgICAgfSwgKGUpPT4ge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRXJyb3JcIiwgZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH0pOyBcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jYWNoZS5oaXN0b3J5LnB1c2goe3BhdGg6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGgsIG5vZGVpZDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2NhbkltYWdlcyhmaWxlcywgbm9kZWlkKSB7XHJcbiAgICAgIC8vIGNoZWNrcyBmb3IgYXZhaWxhYmxlIGltYWdlc1xyXG4gICAgICBsZXQgdG9TaG93TG9hZGVyID0gZmFsc2U7XHJcbiAgICAgIGxldCB0b3RGaWxlcyA9IDA7XHJcbiAgICAgIGxldCB0b3RBbGJ1bXMgPSB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLnRvdEFsYnVtcztcclxuXHJcbiAgICAgIGZvcihsZXQgaSBpbiBmaWxlcykge1xyXG4gICAgICAgIGxldCBmaWxlcGF0aCA9IFwiXCI7XHJcbiAgICAgICAgbGV0IGZpbGVwYXRoX2NodW5rID0gZmlsZXNbaV0ucGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgZm9yKGxldCBjPTA7IGM8ZmlsZXBhdGhfY2h1bmsubGVuZ3RoLTE7IGMrKykge1xyXG4gICAgICAgICAgZmlsZXBhdGggKz0gZmlsZXBhdGhfY2h1bmtbY10gKyBcIi9cIlxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihmaWxlcGF0aD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCtcIi9cIikge1xyXG4gICAgICAgICAgdG90RmlsZXMrKztcclxuICAgICAgICAgIHRvU2hvd0xvYWRlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZih0b1Nob3dMb2FkZXIpIHtcclxuICAgICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJMb2FkaW5nIGltYWdlc+KAplwiKSk7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc051bSA9IDA7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc1RvdCA9IHRvdEZpbGVzO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUZvb3Rlcih0b3RBbGJ1bXMsIHRvdEZpbGVzKTtcclxuICAgICAgfSBcclxuXHJcbiAgICAgIGZvcihsZXQgaSBpbiBmaWxlcykgeyBcclxuICAgICAgICB0aGlzLmltYWdlU2Nhbm5lciA9IHRpbWVyLnNldFRpbWVvdXQoXHJcbiAgICAgICAgICAoKT0+IHsgdGhpcy5sb2FkSW1hZ2VzKG5vZGVpZCwgZmlsZXNbZmlsZXMubGVuZ3RoLTEtKCtpKV0pIH0sIFxyXG4gICAgICAgICAgMzAwKigraSkpO1xyXG4gICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZEltYWdlcyhhbGJ1bWlkLCBpdGVtKSB7XHJcbiAgICAgIGlmKGFsYnVtaWQ9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCkgeyBcclxuICAgICAgICBsZXQgZmlsZXBhdGggPSBcIlwiO1xyXG4gICAgICAgIGxldCBmaWxlcGF0aF9jaHVuayA9IGl0ZW0ucGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgZm9yKGxldCBjPTA7IGM8ZmlsZXBhdGhfY2h1bmsubGVuZ3RoLTE7IGMrKykge1xyXG4gICAgICAgICAgZmlsZXBhdGggKz0gZmlsZXBhdGhfY2h1bmtbY10gKyBcIi9cIlxyXG4gICAgICAgIH1cclxuIFxyXG4gICAgICAgIGlmKGZpbGVwYXRoPT10aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoK1wiL1wiKSB7XHJcbiAgICAgICAgICBsZXQgaW1ndXJscm9vdCA9IHRoaXMuaG9zdCtcIi9pbmRleC5waHAvYXBwcy9nYWxsZXJ5L2FwaS9wcmV2aWV3L1wiICsgaXRlbS5ub2RlaWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICBIdHRwLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgIHVybDogaW1ndXJscm9vdCArIFwiLzE1MC8xNTBcIixcclxuICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzXHJcbiAgICAgICAgICB9KS50aGVuKChyZXNwb25zZTphbnkpPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYoYWxidW1pZD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkKSB7IFxyXG4gICAgICAgICAgICAgIGxldCBpbWdPYmogPSBuZXcgR2FsbGVyeUl0ZW0oKTtcclxuICAgICAgICAgICAgICByZXNwb25zZS5jb250ZW50LnRvSW1hZ2UoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGltYWdlKT0+IHtcclxuICAgICAgICAgICAgICAgICAgbGV0IGJhc2U2NCA9IGltYWdlLnRvQmFzZTY0U3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai5zcmMgPSBiYXNlNjQ7XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai50aXRsZSA9IGZpbGVwYXRoX2NodW5rW2ZpbGVwYXRoX2NodW5rLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgICAgICAgaW1nT2JqLnVybCA9IGltZ3VybHJvb3Q7XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai5tdGltZSA9IGl0ZW0ubXRpbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQucHVzaChpbWdPYmopO1xyXG4gICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmltYWdlcz09bnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaW1hZ2VzID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaW1hZ2VzW2l0ZW0ubm9kZWlkXSA9IGltZ09iajtcclxuICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc051bSsrO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzVmFsID0gKHRoaXMucHJvZ3Jlc3NOdW0qMTAwKS90aGlzLnByb2dyZXNzVG90O1xyXG4gICAgICAgICAgICAgICAgICAvL3RoaXMudXRpbC5sb2coXCJmaWxlIGFkZGVkIHRvIFwiK2FsYnVtaWQrXCI6IFwiLCBcIihcIiArIGl0ZW0ubm9kZWlkICsgXCIpIFwiICsgaXRlbS5wYXRoICsgXCIgLSBcIiArIGl0ZW0ubXRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiRmlsZSBhZGRlZCB0byBcIithbGJ1bWlkK1wiIChcIiArIGl0ZW0ubm9kZWlkICsgXCIpIC0gXCIgKyBpdGVtLm10aW1lLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+IHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcImVycm9yXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pOyAgXHJcblxyXG5cdFx0XHRcdC8vIGhpZGUgdGhlIGxvYWRlciB3aGVuIGZpcnN0IGltYWdlIGluIGRpcmVjdG9yeSBpcyBsb2FkZWRcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9LCAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRpbWVyLmNsZWFyVGltZW91dCh0aGlzLmltYWdlU2Nhbm5lcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUZvb3RlcihudW1BbGJ1bXMsIG51bUZpbGVzKSB7XHJcbiAgICAgIGxldCBmb290ZXJBbGJ1bSA9IChudW1BbGJ1bXM+MCk/IG51bUFsYnVtcyArIFwiIFwiICsgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkNvbGxlY3Rpb25zXCIpIDogXCJcIjtcclxuICAgICAgbGV0IGZvb3RlckZpbGVzID0gKG51bUZpbGVzPjApPyBudW1GaWxlcyArIFwiIFwiICsgdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkZpbGVzXCIpIDogXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgPSBcIlwiO1xyXG4gICAgICB0aGlzLmZvb3RlciArPSBmb290ZXJBbGJ1bTtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gKG51bUFsYnVtcz4wICYmIG51bUZpbGVzPjApPyBcIiAvIFwiIDogXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gZm9vdGVyRmlsZXM7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJ1cGRhdGVGb290ZXJcIiwgdGhpcy5mb290ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVGFwRm9sZGVyKGl0ZW0pIHtcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwidGFwXCIsIGl0ZW0pO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiVGFwIGl0ZW0gZm9sZGVyXCIsIG51bGwpO1xyXG4gICAgICB0aGlzLmxvYWRHYWxsZXJ5KGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVGFwSW1hZ2UoaXRlbSkge1xyXG4gICAgICAvL3RoaXMudXRpbC5sb2coXCJ0YXBcIiwgaXRlbS50aXRsZSk7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJUYXAgaXRlbSBpbWFnZVwiLCBudWxsKTtcclxuICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBpbWFnZeKAplwiKSk7IFxyXG5cclxuICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBjb250ZXh0OiB7XHJcbiAgICAgICAgICAgIGxvYWRlcjogdGhpcy5sb2FkZXIsXHJcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWZcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMubW9kYWxTZXJ2aWNlLnNob3dNb2RhbChJbWFnZU1vZGFsQ29tcG9uZW50LCBvcHRpb25zKVxyXG4gICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHsgICAgICBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZExvZygpIHtcclxuICAgICAgaWYodGhpcy51dGlsLkRFQlVHICYmIHRoaXMudXRpbC5MT0dUT1NFVFRJTkdTKSB7XHJcbiAgICAgICAgZW1haWwuY29tcG9zZSh7XHJcbiAgICAgICAgICBzdWJqZWN0OiBcIkNsb3VkIEdhbGxlcnkgTG9nXCIsXHJcbiAgICAgICAgICBib2R5OiBTZXR0aW5ncy5nZXRTdHJpbmcoXCJfTE9HXCIpLFxyXG4gICAgICAgICAgdG86IFsnaW5mb0BsaW5mYXNlcnZpY2UuaXQnXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgIFxyXG5cclxufVxyXG4iXX0=