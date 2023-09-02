"use strict";

const FLICKR_API_KEY = "c1bf6c2616d08916585f3c840df3fca0";
const FLICKR_USER_ID = "198243572@N06";
const ReduxActions = Object.freeze({
    FETCHED_PRODUCTS: "FETCHED_PRODUCTS",
    SET_ELEVATOR_TYPES: "SET_ELEVATOR_TYPES",
    OPEN_PRODUCT_MODAL: "OPEN_PRODUCT_MODAL",
    CLOSE_PRODUCT_MODAL: "CLOSE_PRODUCT_MODAL",
    OPEN_MOBILE_MENU: "OPEN_MOBILE_MENU",
    CLOSE_MOBILE_MENU: "CLOSE_MOBILE_MENU",
    SET_HOMEPAGE_GALLERY_IMAGES: "SET_HOMEPAGE_GALLERY_IMAGES",
    SET_HOMEPAGE_GALLERY_ACTIVE_IMAGE_INDEX: "SET_GALLERY_ACTIVE_IMAGE_INDEX",
    SHOW_HOMEPAGE_SLIDER_PREV_SLIDE: "SHOW_HOMEPAGE_SLIDER_PREV_SLIDE",
    SHOW_HOMEPAGE_SLIDER_NEXT_SLIDE: "SHOW_HOMEPAGE_SLIDER_NEXT_SLIDE",
    OPEN_HOMEPAGE_GALLERY_MODAL: "OPEN_HOMEPAGE_GALLERY_MODAL",
    CLOSE_HOMEPAGE_GALLERY_MODAL: "CLOSE_HOMEPAGE_GALLERY_MODAL",
});
const AppLanguages = Object.freeze({
    EN: "en",
    HY: "hy",
    RU: "ru",
});
const FlickrAlbumsIds = Object.freeze({
    CATALOG: "72177720310907751",
    OUR_WORKS: "72177720310445228",
});
