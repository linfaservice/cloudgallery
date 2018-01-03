"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gallery_component_1 = require("./pages/gallery/gallery.component");
var settings_component_1 = require("./pages/settings/settings.component");
exports.routes = [
    { path: '', component: gallery_component_1.GalleryComponent },
    { path: 'settings', component: settings_component_1.SettingsComponent },
];
exports.navigatableComponents = [
    //RootComponent,
    //BaseComponent,
    settings_component_1.SettingsComponent,
    gallery_component_1.GalleryComponent,
];
