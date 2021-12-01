export type TabulaConfig ={
     productKey : string, // this will be used in the URL and to scope search results
     title : string, // the human-readable title
     tagline: string, // will be displayed in the bottom left
     productLogo: string, // also bottom left
     isPrivateRepo: bool, // if this is true, there will be no "edit this page" button
     legacyVersions?: any[], // inject any legacy versions
     specs? : any[], // openApi specs to be added to sidebar
     announcementBar: any // theme-classic announcementBar

    }