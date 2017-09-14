export class GalleryItem {
    constructor(
        public id?: string,
        public isAlbum?: boolean, 
        public title?: string, 
        public description?: string, 
        public path?:string,
        public src?: string, 
        public mtime?: string, 
        public owner?: string) {
    }
}