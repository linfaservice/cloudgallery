import { Injectable } from '@angular/core';
import { GalleryItem } from "./gallery.item";


@Injectable()
export default class GalleryCache {

    public images = new Array<GalleryItem>();
    public currentAlbum = new GalleryItem();  
    public history = new Array();    
    
}