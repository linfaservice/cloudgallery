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
        var remember = Settings.getBoolean("remember");
        remember = (remember != null) ? remember : true;
        if (remember) {
            dialogs_1.confirm({
                title: this.translate.instant("Do you like Cloud Gallery?"),
                message: this.translate.instant("Cloud Gallery is an open source project and your help can speed up development. If you like Cloud Gallery please consider to offer a donation. Thanks!"),
                okButtonText: this.translate.instant("Donate"),
                cancelButtonText: this.translate.instant("Close and not remember"),
                neutralButtonText: this.translate.instant("Remember later")
            }).then(function (result) {
                if (result === undefined) {
                    Settings.setBoolean("remember", true);
                }
                else {
                    if (result) {
                        util.openUrl("https://paypal.me/linfaservice");
                    }
                    Settings.setBoolean("remember", false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYWxsZXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUErQjtBQUMvQixzQ0FBb0U7QUFDcEUsMENBQXlDO0FBQ3pDLDhDQUF5QztBQUN6QywwREFBd0Q7QUFDeEQsNERBQXNEO0FBQ3RELDBDQUE0QztBQUM1Qyx1RUFBK0Q7QUFDL0QsMkVBQXlFO0FBQ3pFLGtFQUF1RTtBQUN2RSxpRUFBOEQ7QUFFOUQsNENBQTZDO0FBQzdDLGlFQUEyRjtBQUMzRiw2QkFBK0I7QUFDL0IsK0NBQWlEO0FBQ2pELG1DQUFxQztBQUNyQywrQ0FBaUQ7QUFDakQsMkNBQWlOO0FBRWpOLGdDQUFtQztBQUNuQyx5Q0FBMkM7QUFDM0MsMkNBQXNGO0FBQ3RGLHNDQUFxQztBQUNyQyxvREFBc0Q7QUFDdEQsMENBQTRDO0FBQzVDLCtEQUEwRDtBQUMxRCxrQ0FBb0M7QUFFcEMsNkVBQStFO0FBRS9FLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0FBV25HO0lBaUNJLDBCQUNVLElBQVUsRUFDWCxJQUFVLEVBQ1QsUUFBNEIsRUFDNUIsWUFBZ0MsRUFDaEMsS0FBdUIsRUFDdkIsU0FBMkIsRUFDM0IsS0FBbUI7UUFQN0IsaUJBb0NDO1FBbkNTLFNBQUksR0FBSixJQUFJLENBQU07UUFDWCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLFVBQUssR0FBTCxLQUFLLENBQWM7UUF6QjdCOzs7O1VBSUU7UUFFRixpQkFBaUI7UUFDakIsZUFBZTtR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LENBQUM7YUFDN0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUE3ZFEsZ0JBQWdCO1FBUjVCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUsNEJBQTRCO1lBQ3pDLFNBQVMsRUFBRSxDQUFDLDJCQUEyQixDQUFDO1lBQ3hDLFNBQVMsRUFBRSxDQUFDLGlDQUFrQixDQUFDO1NBQ2hDLENBQUM7eUNBcUNrQixXQUFJO1lBQ0wsV0FBSTtZQUNDLDhDQUFrQjtZQUNkLGlDQUFrQjtZQUN6Qix1QkFBZ0I7WUFDWixnQ0FBZ0I7WUFDcEIsdUJBQVk7T0F4Q3BCLGdCQUFnQixDQWdlNUI7SUFBRCx1QkFBQztDQUFBLEFBaGVELElBZ2VDO0FBaGVZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0aWxcIjtcclxuaW1wb3J0IExvYWRlciBmcm9tIFwiLi4vLi4vY29tbW9uL2xvYWRlclwiO1xyXG5pbXBvcnQgeyBHYWxsZXJ5SXRlbSB9IGZyb20gXCIuLi8uLi9jb21tb24vZ2FsbGVyeS5pdGVtXCI7XHJcbmltcG9ydCBHYWxsZXJ5Q2FjaGUgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYWxsZXJ5LmNhY2hlXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcbmltcG9ydCB7IFROU0ZvbnRJY29uU2VydmljZSB9IGZyb20gJ25hdGl2ZXNjcmlwdC1uZ3gtZm9udGljb24nO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUtYXJyYXlcIjtcclxuaW1wb3J0IHsgTW9kYWxEaWFsb2dTZXJ2aWNlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBJbWFnZU1vZGFsQ29tcG9uZW50IH0gZnJvbSBcIi4vaW1hZ2UtbW9kYWwuY29tcG9uZW50XCI7XHJcbmltcG9ydCAqIGFzIEltYWdlU291cmNlTW9kdWxlIGZyb20gXCJpbWFnZS1zb3VyY2VcIjtcclxuaW1wb3J0ICogYXMgSHR0cCBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9odHRwXCJcclxuaW1wb3J0IHsgUmFkTGlzdFZpZXcsIExpc3RWaWV3U3RhZ2dlcmVkTGF5b3V0IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpLXByby9saXN0dmlld1wiXHJcbmltcG9ydCAqIGFzIHRpbWVyIGZyb20gXCJ0aW1lclwiO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgUGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tIFwibmcyLXRyYW5zbGF0ZVwiO1xyXG5pbXBvcnQgeyBvbiBhcyBhcHBsaWNhdGlvbk9uLCBvZmYgYXMgYXBwbGljYXRpb25PZmYsIGxhdW5jaEV2ZW50LCBzdXNwZW5kRXZlbnQsIHJlc3VtZUV2ZW50LCBleGl0RXZlbnQsIGxvd01lbW9yeUV2ZW50LCB1bmNhdWdodEVycm9yRXZlbnQsIEFwcGxpY2F0aW9uRXZlbnREYXRhLCBzdGFydCBhcyBhcHBsaWNhdGlvblN0YXJ0IH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCAqIGFzIHV0ZjggZnJvbSBcInV0ZjhcIjsgXHJcbmltcG9ydCAqIGFzICBCYXNlNjQgZnJvbSBcImJhc2UtNjRcIjtcclxuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCB7IEFuZHJvaWRBcHBsaWNhdGlvbiwgQW5kcm9pZEFjdGl2aXR5QmFja1ByZXNzZWRFdmVudERhdGEgfSBmcm9tIFwiYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgY29uZmlybSB9IGZyb20gXCJ1aS9kaWFsb2dzXCI7XHJcbmltcG9ydCAqIGFzIGFwcHZlcnNpb24gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hcHB2ZXJzaW9uXCI7IFxyXG5pbXBvcnQgKiBhcyBlbWFpbCBmcm9tIFwibmF0aXZlc2NyaXB0LWVtYWlsXCI7XHJcbmltcG9ydCB7c2NyZWVufSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybS9wbGF0Zm9ybVwiO1xyXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCJ1dGlscy91dGlsc1wiO1xyXG5cclxuaW1wb3J0ICogYXMgZWxlbWVudFJlZ2lzdHJ5TW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xyXG5pbXBvcnQgeyBzZXRUaW1lb3V0IH0gZnJvbSBcInRpbWVyc1wiO1xyXG5lbGVtZW50UmVnaXN0cnlNb2R1bGUucmVnaXN0ZXJFbGVtZW50KFwiQ2FyZFZpZXdcIiwgKCkgPT4gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1jYXJkdmlld1wiKS5DYXJkVmlldyk7XHJcblxyXG4gICBcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwiZ2FsbGVyeVwiLFxyXG4gIHRlbXBsYXRlVXJsOiBcInBhZ2VzL2dhbGxlcnkvZ2FsbGVyeS5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCJwYWdlcy9nYWxsZXJ5L2dhbGxlcnkuY3NzXCJdLFxyXG4gIHByb3ZpZGVyczogW01vZGFsRGlhbG9nU2VydmljZV1cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgR2FsbGVyeUNvbXBvbmVudCB7XHJcblxyXG4gICAgcHJpdmF0ZSBsYW5ndWFnZTtcclxuICAgIHByaXZhdGUgdmVyc2lvbjtcclxuXHJcbiAgICBwcml2YXRlIGhvc3Q7XHJcbiAgICBwcml2YXRlIHVzZXJuYW1lO1xyXG4gICAgcHJpdmF0ZSBwYXNzd29yZDtcclxuICAgIHByaXZhdGUgcm9vdGRpcjtcclxuICAgIHByaXZhdGUgaGVhZGVycztcclxuXHJcbiAgICBwcml2YXRlIHJhZExpc3Q6IFJhZExpc3RWaWV3O1xyXG4gICAgcHJpdmF0ZSBuQ29sTWluO1xyXG4gICAgcHJpdmF0ZSBuQ29sTWF4O1xyXG5cclxuICAgIC8qXHJcbiAgICBwcml2YXRlIGltYWdlcyA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8T2JzZXJ2YWJsZUFycmF5PEdhbGxlcnlJdGVtPj4oKTtcclxuICAgIHByaXZhdGUgY3VycmVudCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICBwcml2YXRlIGhpc3RvcnkgPSBuZXcgQXJyYXkoKTtcclxuICAgICovXHJcblxyXG4gICAgLy9wcml2YXRlIG5vZGVpZDtcclxuICAgIC8vcHJpdmF0ZSBwYXRoO1xyXG4gICAgLy9wcml2YXRlIHRpdGxlO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8R2FsbGVyeUl0ZW0+KCk7XHJcbiAgICBwcml2YXRlIHByb2dyZXNzTnVtID0gMDtcclxuICAgIHByaXZhdGUgcHJvZ3Jlc3NUb3QgPSAwO1xyXG4gICAgcHJpdmF0ZSBwcm9ncmVzc1ZhbCA9IDA7XHJcbiAgICBwcml2YXRlIGZvb3RlciA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcclxuICAgIHByaXZhdGUgaW1hZ2VTY2FubmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxyXG5cdCAgICBwcml2YXRlIHV0aWw6IFV0aWwsXHJcbiAgICAgIHByaXZhdGUgZm9udGljb246IFROU0ZvbnRJY29uU2VydmljZSxcclxuICAgICAgcHJpdmF0ZSBtb2RhbFNlcnZpY2U6IE1vZGFsRGlhbG9nU2VydmljZSwgXHJcbiAgICAgIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsXHJcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgICBwcml2YXRlIGNhY2hlOiBHYWxsZXJ5Q2FjaGVcclxuICAgICkgIHtcclxuXHJcbiAgICAgIC8vY2FsYyBkaW1lbnNpb25zIGZvciByZXNwb25zaXZlIHZpZXdcclxuICAgICAgbGV0IG5Db2wxID0gTWF0aC5mbG9vcihzY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzLzMyMCkqMztcclxuICAgICAgbGV0IG5Db2wyID0gTWF0aC5mbG9vcihzY3JlZW4ubWFpblNjcmVlbi53aWR0aERJUHMvMzIwKSozO1xyXG4gICAgICBpZihuQ29sMT5uQ29sMikgeyB0aGlzLm5Db2xNYXg9bkNvbDE7IHRoaXMubkNvbE1pbj1uQ29sMn1cclxuICAgICAgZWxzZSB7IHRoaXMubkNvbE1heD1uQ29sMjsgdGhpcy5uQ29sTWluPW5Db2wxfVxyXG5cclxuICAgICAgYXBwdmVyc2lvbi5nZXRWZXJzaW9uTmFtZSgpLnRoZW4oKHY6IHN0cmluZyk9PiB7XHJcbiAgICAgICAgICB0aGlzLnZlcnNpb24gPSBcIlZlcnNpb24gXCIgKyB2O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2U7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKFwiZW5cIik7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRlLnVzZShQbGF0Zm9ybS5kZXZpY2UubGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdKS5zdWJzY3JpYmUoKCk9PiB7XHJcbiAgICAgICAgdGhpcy5ob3N0ID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdFwiKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcm5hbWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IFNldHRpbmdzLmdldFN0cmluZyhcInBhc3N3b3JkXCIpO1xyXG4gICAgICAgIHRoaXMucm9vdGRpciA9IFNldHRpbmdzLmdldFN0cmluZyhcInJvb3RkaXJcIik7ICBcclxuICAgICAgICB0aGlzLnJvb3RkaXIgPSAodGhpcy5yb290ZGlyPT1udWxsKT8gXCJcIjp0aGlzLnJvb3RkaXI7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJzID0geyBcclxuICAgICAgICAgIFwiT0NTLUFQSVJFUVVFU1RcIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCYXNpYyBcIitCYXNlNjQuZW5jb2RlKHRoaXMudXNlcm5hbWUrJzonK3RoaXMucGFzc3dvcmQpXHJcbiAgICAgICAgfSAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmNhY2hlLmltYWdlcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICB0aGlzLmhvbWUoKTtcclxuICAgICAgfSk7ICAgICBcclxuICAgIH1cclxuXHJcbiAgICBvblJhZExpc3RMb2FkZWQoYXJncykge1xyXG4gICAgICB0aGlzLnJhZExpc3QgPSA8UmFkTGlzdFZpZXc+YXJncy5vYmplY3Q7ICBcclxuICAgICAgbGV0IHN0YWdnZXJlZExheW91dCA9IG5ldyBMaXN0Vmlld1N0YWdnZXJlZExheW91dCgpO1xyXG5cclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkluaXRpYWwgc2NyZWVuIG9yaWVudGF0aW9uOiBcIiwgc2NyZWVuLm1haW5TY3JlZW4ud2lkdGhESVBzICsgXCJ4XCIgKyBzY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRESVBzKTtcclxuICAgICAgaWYoc2NyZWVuLm1haW5TY3JlZW4ud2lkdGhESVBzPnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodERJUHMpIHtcclxuICAgICAgICB0aGlzLnNldE9yaWVudGF0aW9uKHtuZXdWYWx1ZTogXCJsYW5kc2NhcGVcIn0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0T3JpZW50YXRpb24oe25ld1ZhbHVlOiBcInBvcnRyYWl0XCJ9KTtcclxuICAgICAgfSAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgIHRoaXMucGFnZS5hY3Rpb25CYXJIaWRkZW4gPSBmYWxzZTtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlBhZ2UgSW5pdCBHYWxsZXJ5XCIsIG51bGwpOyAgICAgIFxyXG5cclxuICAgICAgaWYgKGFwcGxpY2F0aW9uLmFuZHJvaWQpIHtcclxuICAgICAgICBhcHBsaWNhdGlvbi5hbmRyb2lkLm9uKFxyXG4gICAgICAgICAgICBBbmRyb2lkQXBwbGljYXRpb24uYWN0aXZpdHlCYWNrUHJlc3NlZEV2ZW50LCBcclxuICAgICAgICAgICAgKGRhdGE6IEFuZHJvaWRBY3Rpdml0eUJhY2tQcmVzc2VkRXZlbnREYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmNhbmNlbCA9IHRydWU7IC8vIHByZXZlbnRzIGRlZmF1bHQgYmFjayBidXR0b24gYmVoYXZpb3JcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFjaygpO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICk7ICAgICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKlxyXG4gICAgICBhcHBsaWNhdGlvbk9uKHJlc3VtZUV2ZW50LCAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2FkR2FsbGVyeSh7cGF0aDogdGhpcy5wYXRoLCBub2RlaWQ6IHRoaXMubm9kZWlkfSk7XHJcbiAgICAgIH0pOyAgIFxyXG4gICAgICAqL1xyXG5cclxuICAgICAgYXBwbGljYXRpb25PbihcIm9yaWVudGF0aW9uQ2hhbmdlZFwiLCAoZSk9PnsgdGhpcy5zZXRPcmllbnRhdGlvbihlKTsgfSk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgYXBwbGljYXRpb25PZmYoXCJvcmllbnRhdGlvbkNoYW5nZWRcIiwgdGhpcy5zZXRPcmllbnRhdGlvbik7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIHNldE9yaWVudGF0aW9uKGUpIHtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlNldCBvcmllbnRhdGlvbjogXCIsIGUubmV3VmFsdWUpO1xyXG4gICAgICBpZihlLm5ld1ZhbHVlID09IFwicG9ydHJhaXRcIikge1xyXG4gICAgICAgICAgbGV0IHN0YWdnZXJlZExheW91dCA9IG5ldyBMaXN0Vmlld1N0YWdnZXJlZExheW91dCgpO1xyXG4gICAgICAgICAgc3RhZ2dlcmVkTGF5b3V0LnNwYW5Db3VudCA9IHRoaXMubkNvbE1pbjtcclxuICAgICAgICAgIHN0YWdnZXJlZExheW91dC5zY3JvbGxEaXJlY3Rpb24gPSBcIlZlcnRpY2FsXCI7XHJcbiAgICAgICAgICB0aGlzLnJhZExpc3QubGlzdFZpZXdMYXlvdXQgPSBzdGFnZ2VyZWRMYXlvdXQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgc3RhZ2dlcmVkTGF5b3V0ID0gbmV3IExpc3RWaWV3U3RhZ2dlcmVkTGF5b3V0KCk7XHJcbiAgICAgICAgICBzdGFnZ2VyZWRMYXlvdXQuc3BhbkNvdW50ID0gdGhpcy5uQ29sTWF4O1xyXG4gICAgICAgICAgc3RhZ2dlcmVkTGF5b3V0LnNjcm9sbERpcmVjdGlvbiA9IFwiVmVydGljYWxcIjtcclxuICAgICAgICAgIHRoaXMucmFkTGlzdC5saXN0Vmlld0xheW91dCA9IHN0YWdnZXJlZExheW91dDtcclxuICAgICAgfSAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYXJDdXJyZW50KCkge1xyXG4gICAgICB3aGlsZSh0aGlzLmN1cnJlbnQubGVuZ3RoPjApIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnQucG9wKCk7ICAgXHJcbiAgICAgIH1cclxuICAgIH0gIFxyXG5cclxuICAgIHByaXZhdGUgaG9tZSgpIHtcclxuICAgICAgdGhpcy5jYWNoZS5oaXN0b3J5ID0gbmV3IEFycmF5KCk7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGggPSB0aGlzLnJvb3RkaXI7IFxyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQgPSBcIi9cIjtcclxuICAgICAgdGhpcy5sb2FkR2FsbGVyeSh7XHJcbiAgICAgICAgcGF0aDogdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCwgXHJcbiAgICAgICAgbm9kZWlkOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRcclxuICAgICAgfSk7ICAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93RG9uYXRlRGlhbG9nKCkge1xyXG4gICAgICBsZXQgcmVtZW1iZXIgPSBTZXR0aW5ncy5nZXRCb29sZWFuKFwicmVtZW1iZXJcIik7XHJcbiAgICAgIHJlbWVtYmVyID0gKHJlbWVtYmVyIT1udWxsKT8gcmVtZW1iZXI6dHJ1ZTtcclxuICAgICAgXHJcbiAgICAgIGlmKHJlbWVtYmVyKSB7XHJcbiAgICAgICAgY29uZmlybSh7XHJcbiAgICAgICAgICB0aXRsZTogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkRvIHlvdSBsaWtlIENsb3VkIEdhbGxlcnk/XCIpLFxyXG4gICAgICAgICAgbWVzc2FnZTogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkNsb3VkIEdhbGxlcnkgaXMgYW4gb3BlbiBzb3VyY2UgcHJvamVjdCBhbmQgeW91ciBoZWxwIGNhbiBzcGVlZCB1cCBkZXZlbG9wbWVudC4gSWYgeW91IGxpa2UgQ2xvdWQgR2FsbGVyeSBwbGVhc2UgY29uc2lkZXIgdG8gb2ZmZXIgYSBkb25hdGlvbi4gVGhhbmtzIVwiKSxcclxuICAgICAgICAgIG9rQnV0dG9uVGV4dDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkRvbmF0ZVwiKSxcclxuICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJDbG9zZSBhbmQgbm90IHJlbWVtYmVyXCIpLFxyXG4gICAgICAgICAgbmV1dHJhbEJ1dHRvblRleHQ6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJSZW1lbWJlciBsYXRlclwiKVxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3VsdDpib29sZWFuKT0+IHtcclxuICAgICAgICAgICAgaWYocmVzdWx0PT09dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgU2V0dGluZ3Muc2V0Qm9vbGVhbihcInJlbWVtYmVyXCIsIHRydWUpOyBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpZihyZXN1bHQpIHsgdXRpbC5vcGVuVXJsKFwiaHR0cHM6Ly9wYXlwYWwubWUvbGluZmFzZXJ2aWNlXCIpOyB9IFxyXG4gICAgICAgICAgICAgIFNldHRpbmdzLnNldEJvb2xlYW4oXCJyZW1lbWJlclwiLCBmYWxzZSk7ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAgXHJcbiAgICAgIH0gICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJhY2soKSB7XHJcbiAgICAgIGlmKHRoaXMuY2FjaGUuaGlzdG9yeS5sZW5ndGg+MSkge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5jYWNoZS5oaXN0b3J5LnBvcCgpO1xyXG4gICAgICAgIGxldCBiYWNrID0gdGhpcy5jYWNoZS5oaXN0b3J5LnBvcCgpO1xyXG4gICAgICAgIHRoaXMubG9hZEdhbGxlcnkoYmFjayk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXhpdD9cIiksXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZXhpdD9cIiksXHJcbiAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIlllc1wiKSxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdGhpcy50cmFuc2xhdGUuaW5zdGFudChcIk5vXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy51dGlsLmxvZyhcIkJhY2sgY29uZmlybSBleGl0P1wiLCBudWxsKTsgXHJcbiAgICAgICAgY29uZmlybShvcHRpb25zKS50aGVuKChyZXN1bHQ6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkJhY2tcIiwgcmVzdWx0KTsgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5leGl0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleGl0KCkge1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJob3N0XCIsIFwiXCIpO1xyXG4gICAgICBTZXR0aW5ncy5zZXRTdHJpbmcoXCJ1c2VybmFtZVwiLCBcIlwiKTtcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwicGFzc3dvcmRcIiwgXCJcIik7XHJcbiAgICAgIFNldHRpbmdzLnNldFN0cmluZyhcInJvb3RkaXJcIiwgXCJcIik7ICAgICBcclxuICAgICAgU2V0dGluZ3Muc2V0U3RyaW5nKFwiZG9uYXRlXCIsIFwiXCIpOyAgICAgXHJcbiAgICAgIHRoaXMudXRpbC5uYXZpZ2F0ZShcInNldHRpbmdzXCIpO1xyXG4gICAgfVxyXG4gXHJcbiAgICBwcml2YXRlIGxvYWRHYWxsZXJ5KGl0ZW0pIHtcclxuICAgICAgIFxyXG4gICAgICB0aGlzLmxvYWRlci5zaG93TG9hZGVyKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJMb2FkaW5nIGFsYnVtc+KAplwiKSk7XHJcbiAgICAgIC8vdGhpcy51dGlsLmxvZyhcIkxvYWQgR2FsbGVyeVwiLCBpdGVtKTsgXHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJMb2FkIEdhbGxlcnlcIiwgbnVsbCk7IFxyXG5cclxuICAgICAgbGV0IHBhdGggPSBpdGVtLnBhdGg7XHJcbiAgICAgIGxldCBub2RlaWQgPSBpdGVtLm5vZGVpZDtcclxuXHJcbiAgICAgIGlmKHRoaXMuY2FjaGUuaW1hZ2VzW25vZGVpZF09PW51bGwpIHtcclxuICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1tub2RlaWRdID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2xlYXJDdXJyZW50KCk7XHJcblxyXG4gICAgICB0aGlzLmZvb3RlciA9IFwiXCI7XHJcblxyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQgPSBub2RlaWQ7XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGggPSBwYXRoO1xyXG4gICAgICBsZXQgcGF0aF9jaHVuayA9IHBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50aXRsZSA9IHBhdGhfY2h1bmtbcGF0aF9jaHVuay5sZW5ndGgtMV07XHJcbiAgICAgIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlID0gKHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnRpdGxlPT1cIlwiKT8gdGhpcy5ob3N0LnNwbGl0KFwiLy9cIilbMV0gOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS50aXRsZTtcclxuXHJcbiAgICAgIHRoaXMucHJvZ3Jlc3NWYWwgPSAwO1xyXG5cclxuICAgICAgLy8gc3RyaW5nIHNhbml0aXplXHJcbiAgICAgIGxldCBwYXRoc2FuID0gdGhpcy51dGlsLnJlcGxhY2VBbGwocGF0aCwgXCImXCIsIFwiJTI2XCIpOyAgICAgIFxyXG4gICAgICBsZXQgdXJsID0gdGhpcy5ob3N0K1wiL2luZGV4LnBocC9hcHBzL2dhbGxlcnkvYXBpL2ZpbGVzL2xpc3Q/bG9jYXRpb249XCIrcGF0aHNhbitcIiZtZWRpYXR5cGVzPWltYWdlL2pwZWc7aW1hZ2UvZ2lmO2ltYWdlL3BuZztpbWFnZS94LXhiaXRtYXA7aW1hZ2UvYm1wJmZlYXR1cmVzPSZldGFnXCI7XHJcbiAgICAgIHRoaXMudXRpbC5sb2coXCJHRVQgbGlzdFwiLCBudWxsKTtcclxuXHJcbiAgICAgIC8vIHRyeSBmcm9tIGNhY2hlIGZpcnN0XHJcbiAgICAgIC8vdGhpcy51dGlsLmxvZyhcIkdldCBBbGJ1bSBDYWNoZVwiLCB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdKTtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIkdldCBBbGJ1bSBDYWNoZTogXCIgKyB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQsIG51bGwpO1xyXG4gICAgICBpZih0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmxvYWRlZCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXRpbC5sb2coXCJDYWNoZSBGb3VuZCEgUmV0cmlldmluZyBmcm9tIGNhY2hlXCIsIG51bGwpO1xyXG4gICAgICAgIGZvcihsZXQgYSBpbiB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zKSB7XHJcbiAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0uaXRlbXNbYV07XHJcbiAgICAgICAgICAvL3RoaXMudXRpbC5sb2coXCJDYWNoZSBhbGJ1bSBhZGRlZFwiLCBpdGVtKTtcclxuICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJDYWNoZSBhbGJ1bSBhZGRlZDogXCIgKyBhLCBudWxsKTtcclxuICAgICAgICAgIHRoaXMuY3VycmVudC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUZvb3Rlcih0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLnRvdEFsYnVtcywgMCk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmRhdGE7XHJcblxyXG4gICAgICAgIC8vIG90aGVyd2lzZSB0b28gZmFzdCA6KVxyXG4gICAgICAgIHRpbWVyLnNldFRpbWVvdXQoKCk9PiB7IFxyXG4gICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpOyBcclxuICAgICAgICAgIHRoaXMuc2NhbkltYWdlcyhkYXRhLmZpbGVzLCBub2RlaWQpO1xyXG4gICAgICAgIH0sIDgwMCk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB0aGlzLnV0aWwubG9nKFwiQ2FjaGUgTm90IEZvdW5kIDooIFJldHJpZXZpbmcgZnJvbSBjbG91ZOKAplwiLCBudWxsKTtcclxuICAgICAgXHJcbiAgICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzXHJcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBkYXRhID0gcmVzcG9uc2UuY29udGVudC50b0pTT04oKTtcclxuICAgICAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkVycm9yIGxvYWRpbmcuIFBsZWFzZSByZXRyeVwiKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJFcnJvclwiLCBlKTtcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKGRhdGE9PW51bGwpIHtcclxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgbG9hZGluZy4gUGxlYXNlIHJldHJ5XCIpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yIERhdGEgbnVsbFwiLCBudWxsKTtcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuOyAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3RoaXMudXRpbC5sb2coXCJyZXNwb25zZSB0byBcIiwgcGF0aCtcIihcIitub2RlaWQrXCIpLCBjdXJyZW50IGFsYnVtOlwiICsgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkKTtcclxuICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIlJlc3BvbnNlIHRvIChcIitub2RlaWQrXCIpLCBDdXJyZW50IGFsYnVtOlwiICsgdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbGJ1bXMgPSBkYXRhLmFsYnVtczsgIFxyXG4gICAgICAgICAgICAvLyBlcnJvciBsb2FkaW5nXHJcbiAgICAgICAgICAgIGlmKGFsYnVtcz09bnVsbCkge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgZXhpdCBhbmQgcmVjb25maWd1cmVcIikpLnNob3coKTtcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IFxyXG5cclxuICAgICAgICAgICAgbGV0IHRvdEFsYnVtcyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NUb3QgPSBhbGJ1bXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzTnVtID0gMDtcclxuICAgICAgICAgICAgZm9yKGxldCBqIGluIGFsYnVtcykge1xyXG4gICAgICAgICAgICAgIGlmKGFsYnVtc1tqXS5zaXplIT0wKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxidW1PYmogPSBuZXcgR2FsbGVyeUl0ZW0oKTtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLnBhdGggPSBhbGJ1bXNbal0ucGF0aDtcclxuICAgICAgICAgICAgICAgIGxldCBwYXRoX2NodW5rID0gYWxidW1PYmoucGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudF9jaHVuayA9IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmoudGl0bGUgPSBwYXRoX2NodW5rW3BhdGhfY2h1bmsubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmouaXNBbGJ1bSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhbGJ1bU9iai5zcmMgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYWxidW1PYmoubm9kZWlkID0gYWxidW1zW2pdLm5vZGVpZDtcclxuICAgICAgICAgICAgICAgIGFsYnVtT2JqLml0ZW1zID0gbmV3IEFycmF5PEdhbGxlcnlJdGVtPigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGFsYnVtT2JqLnBhdGg9PWRhdGEuYWxidW1wYXRoKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGV4Y2x1ZGVzIGN1cnJlbnQgYWxidW1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihwYXRoX2NodW5rLmxlbmd0aD5jdXJyZW50X2NodW5rLmxlbmd0aCsxKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGV4Y2x1ZGVzIG1vcmUgbGV2ZWxzIGFsYnVtc1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zPT1udWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pdGVtcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLml0ZW1zLnB1c2goYWxidW1PYmopO1xyXG4gICAgICAgICAgICAgICAgICB0b3RBbGJ1bXMrKztcclxuICAgICAgICAgICAgICAgICAgLy90aGlzLnV0aWwubG9nKFwiQWxidW0gYWRkZWQgdG8gXCIrbm9kZWlkK1wiOlwiLCBhbGJ1bU9iaik7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJBbGJ1bSBhZGRlZCB0byBcIitub2RlaWQsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzTnVtKys7XHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9ICh0aGlzLnByb2dyZXNzTnVtKjEwMCkvdGhpcy5wcm9ncmVzc1RvdDtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9IDEwMDtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLnRvdEFsYnVtcyA9IHRvdEFsYnVtcztcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgLy90aGlzLnV0aWwubG9nKFwiU2V0IEFsYnVtIENhY2hlXCIsIHRoaXMuY2FjaGUuaW1hZ2VzW3RoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZF0pO1xyXG4gICAgICAgICAgICB0aGlzLnV0aWwubG9nKFwiU2V0IEFsYnVtIENhY2hlOiBcIiArIHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZvb3Rlcih0b3RBbGJ1bXMsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlci5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbkltYWdlcyhkYXRhLmZpbGVzLCBub2RlaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkPT1cIi9cIikge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2hvd0RvbmF0ZURpYWxvZygpO1xyXG4gICAgICAgICAgICB9XHJcbiBcclxuICAgICAgICAgIH0sIChlKT0+IHtcclxuICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiRXJyb3IgbG9hZGluZy4gUGxlYXNlIHJldHJ5XCIpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkVycm9yXCIsIGUpO1xyXG4gICAgICAgICAgICAgIHRoaXMubG9hZGVyLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9KTsgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2FjaGUuaGlzdG9yeS5wdXNoKHtwYXRoOiB0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5wYXRoLCBub2RlaWQ6IHRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNjYW5JbWFnZXMoZmlsZXMsIG5vZGVpZCkge1xyXG4gICAgICAvLyBjaGVja3MgZm9yIGF2YWlsYWJsZSBpbWFnZXNcclxuICAgICAgbGV0IHRvU2hvd0xvYWRlciA9IGZhbHNlO1xyXG4gICAgICBsZXQgdG90RmlsZXMgPSAwO1xyXG4gICAgICBsZXQgdG90QWxidW1zID0gdGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS50b3RBbGJ1bXM7XHJcblxyXG4gICAgICBmb3IobGV0IGkgaW4gZmlsZXMpIHtcclxuICAgICAgICBsZXQgZmlsZXBhdGggPSBcIlwiO1xyXG4gICAgICAgIGxldCBmaWxlcGF0aF9jaHVuayA9IGZpbGVzW2ldLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIGZvcihsZXQgYz0wOyBjPGZpbGVwYXRoX2NodW5rLmxlbmd0aC0xOyBjKyspIHtcclxuICAgICAgICAgIGZpbGVwYXRoICs9IGZpbGVwYXRoX2NodW5rW2NdICsgXCIvXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZmlsZXBhdGg9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLnBhdGgrXCIvXCIpIHtcclxuICAgICAgICAgIHRvdEZpbGVzKys7XHJcbiAgICAgICAgICB0b1Nob3dMb2FkZXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYodG9TaG93TG9hZGVyKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIuc2hvd0xvYWRlcih0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwiTG9hZGluZyBpbWFnZXPigKZcIikpO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NOdW0gPSAwO1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NUb3QgPSB0b3RGaWxlcztcclxuICAgICAgICB0aGlzLnByb2dyZXNzVmFsID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVGb290ZXIodG90QWxidW1zLCB0b3RGaWxlcyk7XHJcbiAgICAgIH0gXHJcblxyXG4gICAgICBmb3IobGV0IGkgaW4gZmlsZXMpIHsgXHJcbiAgICAgICAgdGhpcy5pbWFnZVNjYW5uZXIgPSB0aW1lci5zZXRUaW1lb3V0KFxyXG4gICAgICAgICAgKCk9PiB7IHRoaXMubG9hZEltYWdlcyhub2RlaWQsIGZpbGVzW2ZpbGVzLmxlbmd0aC0xLSgraSldKSB9LCBcclxuICAgICAgICAgIDMwMCooK2kpKTtcclxuICAgICAgfSAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRJbWFnZXMoYWxidW1pZCwgaXRlbSkge1xyXG4gICAgICBpZihhbGJ1bWlkPT10aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWQpIHsgXHJcbiAgICAgICAgbGV0IGZpbGVwYXRoID0gXCJcIjtcclxuICAgICAgICBsZXQgZmlsZXBhdGhfY2h1bmsgPSBpdGVtLnBhdGguc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIGZvcihsZXQgYz0wOyBjPGZpbGVwYXRoX2NodW5rLmxlbmd0aC0xOyBjKyspIHtcclxuICAgICAgICAgIGZpbGVwYXRoICs9IGZpbGVwYXRoX2NodW5rW2NdICsgXCIvXCJcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICBpZihmaWxlcGF0aD09dGhpcy5jYWNoZS5jdXJyZW50QWxidW0ucGF0aCtcIi9cIikge1xyXG4gICAgICAgICAgbGV0IGltZ3VybHJvb3QgPSB0aGlzLmhvc3QrXCIvaW5kZXgucGhwL2FwcHMvZ2FsbGVyeS9hcGkvcHJldmlldy9cIiArIGl0ZW0ubm9kZWlkO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgSHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IGltZ3VybHJvb3QgKyBcIi8xNTAvMTUwXCIsXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVyc1xyXG4gICAgICAgICAgfSkudGhlbigocmVzcG9uc2U6YW55KT0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmKGFsYnVtaWQ9PXRoaXMuY2FjaGUuY3VycmVudEFsYnVtLm5vZGVpZCkgeyBcclxuICAgICAgICAgICAgICBsZXQgaW1nT2JqID0gbmV3IEdhbGxlcnlJdGVtKCk7XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuY29udGVudC50b0ltYWdlKClcclxuICAgICAgICAgICAgICAgIC50aGVuKChpbWFnZSk9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBiYXNlNjQgPSBpbWFnZS50b0Jhc2U2NFN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmouc3JjID0gYmFzZTY0O1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoudGl0bGUgPSBmaWxlcGF0aF9jaHVua1tmaWxlcGF0aF9jaHVuay5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAgIGltZ09iai51cmwgPSBpbWd1cmxyb290O1xyXG4gICAgICAgICAgICAgICAgICBpbWdPYmoubXRpbWUgPSBpdGVtLm10aW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goaW1nT2JqKTtcclxuICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbWFnZXNbdGhpcy5jYWNoZS5jdXJyZW50QWxidW0ubm9kZWlkXS5pbWFnZXM9PW51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmltYWdlcyA9IG5ldyBBcnJheTxHYWxsZXJ5SXRlbT4oKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLmltYWdlc1t0aGlzLmNhY2hlLmN1cnJlbnRBbGJ1bS5ub2RlaWRdLmltYWdlc1tpdGVtLm5vZGVpZF0gPSBpbWdPYmo7XHJcbiAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NOdW0rKztcclxuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc1ZhbCA9ICh0aGlzLnByb2dyZXNzTnVtKjEwMCkvdGhpcy5wcm9ncmVzc1RvdDtcclxuICAgICAgICAgICAgICAgICAgLy90aGlzLnV0aWwubG9nKFwiZmlsZSBhZGRlZCB0byBcIithbGJ1bWlkK1wiOiBcIiwgXCIoXCIgKyBpdGVtLm5vZGVpZCArIFwiKSBcIiArIGl0ZW0ucGF0aCArIFwiIC0gXCIgKyBpdGVtLm10aW1lKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy51dGlsLmxvZyhcIkZpbGUgYWRkZWQgdG8gXCIrYWxidW1pZCtcIiAoXCIgKyBpdGVtLm5vZGVpZCArIFwiKSAtIFwiICsgaXRlbS5tdGltZSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudXRpbC5sb2coXCJlcnJvclwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTsgIFxyXG5cclxuXHRcdFx0XHQvLyBoaWRlIHRoZSBsb2FkZXIgd2hlbiBmaXJzdCBpbWFnZSBpbiBkaXJlY3RvcnkgaXMgbG9hZGVkXHJcbiAgICAgICAgICAgICAgdGhpcy5sb2FkZXIuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSwgKGUpPT4ge1xyXG4gICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJFcnJvciBsb2FkaW5nLiBQbGVhc2UgcmV0cnlcIikpLnNob3coKTtcclxuICAgICAgICAgIH0pOyAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aW1lci5jbGVhclRpbWVvdXQodGhpcy5pbWFnZVNjYW5uZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVGb290ZXIobnVtQWxidW1zLCBudW1GaWxlcykge1xyXG4gICAgICBsZXQgZm9vdGVyQWxidW0gPSAobnVtQWxidW1zPjApPyBudW1BbGJ1bXMgKyBcIiBcIiArIHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJDb2xsZWN0aW9uc1wiKSA6IFwiXCI7XHJcbiAgICAgIGxldCBmb290ZXJGaWxlcyA9IChudW1GaWxlcz4wKT8gbnVtRmlsZXMgKyBcIiBcIiArIHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJGaWxlc1wiKSA6IFwiXCI7XHJcbiAgICAgIHRoaXMuZm9vdGVyID0gXCJcIjtcclxuICAgICAgdGhpcy5mb290ZXIgKz0gZm9vdGVyQWxidW07XHJcbiAgICAgIHRoaXMuZm9vdGVyICs9IChudW1BbGJ1bXM+MCAmJiBudW1GaWxlcz4wKT8gXCIgLyBcIiA6IFwiXCI7XHJcbiAgICAgIHRoaXMuZm9vdGVyICs9IGZvb3RlckZpbGVzO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwidXBkYXRlRm9vdGVyXCIsIHRoaXMuZm9vdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBvblRhcEZvbGRlcihpdGVtKSB7XHJcbiAgICAgIC8vdGhpcy51dGlsLmxvZyhcInRhcFwiLCBpdGVtKTtcclxuICAgICAgdGhpcy51dGlsLmxvZyhcIlRhcCBpdGVtIGZvbGRlclwiLCBudWxsKTtcclxuICAgICAgdGhpcy5sb2FkR2FsbGVyeShpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBvblRhcEltYWdlKGl0ZW0pIHtcclxuICAgICAgLy90aGlzLnV0aWwubG9nKFwidGFwXCIsIGl0ZW0udGl0bGUpO1xyXG4gICAgICB0aGlzLnV0aWwubG9nKFwiVGFwIGl0ZW0gaW1hZ2VcIiwgbnVsbCk7XHJcbiAgICAgIHRoaXMubG9hZGVyLnNob3dMb2FkZXIodGhpcy50cmFuc2xhdGUuaW5zdGFudChcIkxvYWRpbmcgaW1hZ2XigKZcIikpOyBcclxuXHJcbiAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgY29udGV4dDoge1xyXG4gICAgICAgICAgICBsb2FkZXI6IHRoaXMubG9hZGVyLFxyXG4gICAgICAgICAgICBpdGVtOiBpdGVtXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZnVsbHNjcmVlbjogZmFsc2UsXHJcbiAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZjUmVmXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLm1vZGFsU2VydmljZS5zaG93TW9kYWwoSW1hZ2VNb2RhbENvbXBvbmVudCwgb3B0aW9ucylcclxuICAgICAgLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7ICAgICAgXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRMb2coKSB7XHJcbiAgICAgIGlmKHRoaXMudXRpbC5ERUJVRyAmJiB0aGlzLnV0aWwuTE9HVE9TRVRUSU5HUykge1xyXG4gICAgICAgIGVtYWlsLmNvbXBvc2Uoe1xyXG4gICAgICAgICAgc3ViamVjdDogXCJDbG91ZCBHYWxsZXJ5IExvZ1wiLFxyXG4gICAgICAgICAgYm9keTogU2V0dGluZ3MuZ2V0U3RyaW5nKFwiX0xPR1wiKSxcclxuICAgICAgICAgIHRvOiBbJ2luZm9AbGluZmFzZXJ2aWNlLml0J11cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICBcclxuXHJcbn1cclxuIl19