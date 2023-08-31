"use strict";

const initialState = {
    products: [],
    isMobileMenuOpen: false,
    galleryImages: [],
    galleryActiveImageIndex: 0,
    isGalleryModalOpen: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ReduxActions.FETCHED_PRODUCTS:
            return { ...state, products: action.payload };
        case ReduxActions.OPEN_MOBILE_MENU:
            return { ...state, isMobileMenuOpen: true };
        case ReduxActions.CLOSE_MOBILE_MENU:
            return { ...state, isMobileMenuOpen: false };
        case ReduxActions.SET_HOMEPAGE_GALLERY_IMAGES:
            return { ...state, galleryImages: action.payload };
        case ReduxActions.OPEN_HOMEPAGE_GALLERY_MODAL:
            return { ...state, isGalleryModalOpen: true };
        case ReduxActions.CLOSE_HOMEPAGE_GALLERY_MODAL:
            return { ...state, isGalleryModalOpen: false };
        case ReduxActions.SHOW_HOMEPAGE_SLIDER_PREV_SLIDE:
            return {
                ...state,
                galleryActiveImageIndex: state.galleryActiveImageIndex > 0 ? state.galleryActiveImageIndex - 1 : state.galleryActiveImageIndex
            };
        case ReduxActions.SHOW_HOMEPAGE_SLIDER_NEXT_SLIDE:
            return {
                ...state,
                galleryActiveImageIndex: state.galleryActiveImageIndex < state.galleryImages.length - 2 ? state.galleryActiveImageIndex + 1 : state.galleryActiveImageIndex
            };
        case ReduxActions.SET_HOMEPAGE_GALLERY_ACTIVE_IMAGE_INDEX:
            return { ...state, galleryActiveImageIndex: action.payload };
        default:
            return state;
    }
};

const store = Redux.createStore(reducer);

store.subscribe(() => {
    const state = store.getState();

    // Gallery images
    const $galleryModalCurrentImages = document.querySelector("#gallery-modal-current-image");
    $galleryModalCurrentImages.setAttribute("src", undefined);
    if (state.galleryImages[state.galleryActiveImageIndex]) {
        $galleryModalCurrentImages.setAttribute("src", FlickrUtils.getImageFullUrl({
            id: state.galleryImages[state.galleryActiveImageIndex].id,
            server: state.galleryImages[state.galleryActiveImageIndex].server,
            secret: state.galleryImages[state.galleryActiveImageIndex].secret,
            farm: state.galleryImages[state.galleryActiveImageIndex].farm,
        }));
    }
});

store.subscribe(() => {
    const state = store.getState();

    // Render products
    const $latestProductsList = document.querySelector("#products-list");

    if ($latestProductsList) {
        $latestProductsList.innerHTML = null; // Remove elements for filters
        state.products.forEach((p, i) => {
            // Render 5 products only
            if (i < 5) {
                const info = JSON.parse(p.description._content.replaceAll(`&quot;`, "\""));
                $latestProductsList.insertAdjacentHTML("beforeend", RenderFunctions.renderHomepageLatestProduct({
                    id: p.id,
                    info,
                    imageUrl: FlickrUtils.getImageFullUrl({
                        id: p.id,
                        server: p.server,
                        secret: p.secret,
                        farm: p.farm
                    }),
                }));
            }
        });
    }

    // Mobile menu
    const $mobileMenu = document.querySelector("#mobile-menu");
    if ($mobileMenu) {
        $mobileMenu.classList.toggle("opened", state.isMobileMenuOpen);
    }

    // Render gallery images
    const $gallery = document.getElementById("our-works");
    if ($gallery) {
        $gallery.innerHTML = null;
        state.galleryImages.forEach((gi, i) => {
            if (i < 9) {
                $gallery.insertAdjacentHTML("beforeend", RenderFunctions.renderGalleryCoverImage({
                    imageUrl: FlickrUtils.getImageFullUrl({
                        id: gi.id,
                        server: gi.server,
                        secret: gi.secret,
                        farm: gi.farm,
                    }),
                    index: i,
                }));
            }
        });
    }

    // Gallery modal
    const $galleryModal = document.querySelector("#gallery-modal");
    if ($galleryModal) {
        $galleryModal.classList.toggle("is-open", state.isGalleryModalOpen);
    }

    const $galleryImagePrevArrow = document.querySelector("#gallery-modal-prev-slide-arrow");
    const $galleryImageNextArrow = document.querySelector("#gallery-modal-next-slide-arrow");

    $galleryImagePrevArrow.disabled = state.galleryActiveImageIndex === 0
    $galleryImageNextArrow.disabled = state.galleryActiveImageIndex === state.galleryImages.length - 2;

    checkLanguages();
});

window.addEventListener("load", async () => {
    // Copyright logic
    const $copyrightYear = document.querySelector("#copyright-year");
    if ($copyrightYear) {
        const d = new Date();
        $copyrightYear.innerHTML = d.getFullYear().toString();
    }

    // Fetch products
    const products = await FlickrUtils.getUserImages({
        user_id: FLICKR_USER_ID,
        api_key: FLICKR_API_KEY,
        photoset_id: FlickrAlbumsIds.CATALOG,
    });
    store.dispatch({ type: ReduxActions.FETCHED_PRODUCTS, payload: products.photoset.photo });

    // Fetch gallery images
    const galleryImages = await FlickrUtils.getUserImages({
        user_id: FLICKR_USER_ID,
        api_key: FLICKR_API_KEY,
        photoset_id: FlickrAlbumsIds.OUR_WORKS,
    });
    store.dispatch({ type: ReduxActions.SET_HOMEPAGE_GALLERY_IMAGES, payload: galleryImages.photoset.photo });

    // Mobile menu
    const $mobileMenuOpenBtn = document.querySelector("#burger-tablet");
    const $mobileMenuCloseBtn = document.querySelector("#mobile-menu-close-btn");

    if ($mobileMenuOpenBtn) {
        $mobileMenuOpenBtn.addEventListener("click", () => {
            store.dispatch({ type: ReduxActions.OPEN_MOBILE_MENU });
            document.body.style.overflowY = "hidden";
        });
    }

    if ($mobileMenuCloseBtn) {
        $mobileMenuCloseBtn.addEventListener("click", () => {
            store.dispatch({ type: ReduxActions.CLOSE_MOBILE_MENU });
            document.body.style.overflowY = "auto";
        });
    }

    // Gallery modal
    const $gallery = document.querySelector("#our-works");
    $gallery.addEventListener("click", (e) => {
        store.dispatch({
            type: ReduxActions.SET_HOMEPAGE_GALLERY_ACTIVE_IMAGE_INDEX,
            payload: Number(e.target.dataset["index"]) || 0,
        });
        store.dispatch({ type: ReduxActions.OPEN_HOMEPAGE_GALLERY_MODAL });
        document.body.style.overflowY = "hidden";
    });
    const $galleryModalCloseBtn = document.querySelector("#gallery-modal-close-btn");
    if ($galleryModalCloseBtn) {
        $galleryModalCloseBtn.addEventListener("click", () => {
            document.body.style.overflowY = "auto";
            store.dispatch({ type: ReduxActions.CLOSE_HOMEPAGE_GALLERY_MODAL });
        })
    }

    const $galleryImagePrevArrow = document.querySelector("#gallery-modal-prev-slide-arrow");
    const $galleryImageNextArrow = document.querySelector("#gallery-modal-next-slide-arrow");

    $galleryImagePrevArrow.disabled = store.getState().galleryActiveImageIndex === 0
    $galleryImageNextArrow.disabled = store.getState().galleryActiveImageIndex === store.getState().galleryImages - 1;

    $galleryImagePrevArrow.addEventListener("click", () => {
        store.dispatch({ type: ReduxActions.SHOW_HOMEPAGE_SLIDER_PREV_SLIDE });
    });
    $galleryImageNextArrow.addEventListener("click", () => {
        store.dispatch({ type: ReduxActions.SHOW_HOMEPAGE_SLIDER_NEXT_SLIDE });
    });
});
