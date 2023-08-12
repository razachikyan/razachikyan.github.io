"use strict";

const initialState = {
  products: [],
  activeElevatorTypes: [],
  productModal: {
    isOpen: false, // false
    productId: null,
  },
  isMobileMenuOpen: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ReduxActions.FETCHED_PRODUCTS:
      return { ...state, products: action.payload };
    case ReduxActions.SET_ELEVATOR_TYPES:
      return {...state, activeElevatorTypes: action.payload};
    case ReduxActions.OPEN_PRODUCT_MODAL:
        return {...state, productModal: { isOpen: true, productId: action.payload.productId }};
    case ReduxActions.CLOSE_PRODUCT_MODAL:
      return {...state, productModal: { isOpen: false, productId: null }};
    case ReduxActions.OPEN_MOBILE_MENU:
      return { ...state, isMobileMenuOpen: true };
    case ReduxActions.CLOSE_MOBILE_MENU:
      return { ...state, isMobileMenuOpen: false };
    default:
      return state;
  }
};

const store = Redux.createStore(reducer);

store.subscribe(() => {
  const state = store.getState();

  // Mobile menu
  const $mobileMenu = document.querySelector("#mobile-menu");
  if ($mobileMenu) {
    $mobileMenu.classList.toggle("opened", state.isMobileMenuOpen);
  }

  // Render products
  const $catalogList = document.querySelector(".catalog__list");
  $catalogList.innerHTML = null; // Remove elements for filters

  state.products.forEach(p => {
    const info = JSON.parse(p.description._content.replaceAll(`&quot;`, "\""));
    if (state.activeElevatorTypes.length === 0 || state.activeElevatorTypes.includes(info.type)) {
      $catalogList.insertAdjacentHTML("beforeend", RenderFunctions.renderCatalogProduct({
        id: p.id,
        info,
        imageUrl: FlickrUtils.getImageFullUrl({
          id: p.id,
          server: p.server,
          secret: p.secret,
          farm: p.farm
        })
      }));
    }
  });
  checkLanguages();

  // Product modal
  const $modal = document.querySelector("#product-modal");
  const $modalContent = $modal.querySelector(".content");
  const $productInfo = $modalContent.querySelector(".product-info");
  if (state.productModal.isOpen) {
    $modal.style.display = "flex";
    document.body.style.overflowY = "hidden";
    const $modalCloseBtn = $modal.querySelector(".close-btn");
    $modal.addEventListener("click", e => {
      if (e.target === $modal) store.dispatch({ type: ReduxActions.CLOSE_PRODUCT_MODAL });
    });
    $modalCloseBtn.addEventListener("click", () => store.dispatch({ type: ReduxActions.CLOSE_PRODUCT_MODAL }));
    const product = state.products.find(p => p.id === state.productModal.productId);
    const productDetails = JSON.parse(product.description._content.replaceAll(`&quot;`, "\""))
    if (product) {
      $productInfo.innerHTML = RenderFunctions.renderProductModal({
        imageUrl: FlickrUtils.getImageFullUrl({
          id: product.id,
          server: product.server,
          secret: product.secret,
          farm: product.farm
        }),
        info: productDetails,
      });
      // Generate QR code
      if ("3d-view-link" in productDetails) {
        const $qrWrapper = document.querySelector("#product-modal-qr-code")
        if ($qrWrapper) {
          new QRCode($qrWrapper, {
            text: productDetails["3d-view-link"],
            width: 119,
            height: 119,
            correctLevel : QRCode.CorrectLevel.L
          });
        }
      }
    }
  } else {
    $modal.style.display = "none";
    $productInfo.innerHTML = null;
    document.body.style.overflowY = "unset";
  }

  // Open product modal from url param (if navigated from another page)
  const { searchParams: params, search } = new URL(document.location);
  const searchParams = new URLSearchParams(search);
  const selectedProductId = params.get("product-id");
  if (selectedProductId !== null && state.products.some(p => selectedProductId === p.id)) {
    searchParams.delete("product-id");
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
    store.dispatch({ type: ReduxActions.OPEN_PRODUCT_MODAL, payload: { productId: selectedProductId }});
  }
});

window.addEventListener("load", async () => {
  // Fetch products
  const data = await FlickrUtils.getUserImages({
    user_id: FLICKR_USER_ID,
    api_key: FLICKR_API_KEY,
    photoset_id: FlickrAlbumsIds.CATALOG,
  });
  if ("photoset" in data && "photo" in data.photoset) {
    store.dispatch({ type: ReduxActions.FETCHED_PRODUCTS, payload: data.photoset.photo });
  }

  // Filters logic
  const $elevatorTypesForm = document.querySelector("#elevator-types-form");
  $elevatorTypesForm.addEventListener("change", (e) => {
    const checkboxes = Array.from(e.target.form.elements);
    const newElevatorTypes = [];
    checkboxes.forEach((c) => {
      c.previousElementSibling.classList.toggle("custom__checkbox-checked", c.checked);
      if (c.checked) newElevatorTypes.push(+c.value);
    });
    store.dispatch({ type: ReduxActions.SET_ELEVATOR_TYPES, payload: newElevatorTypes });
    checkLanguages();
  });

  // Products modal
  const $catalogList = document.querySelector(".catalog__list");
  $catalogList.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON" && "productId" in e.target.dataset) {
      store.dispatch({
        type: ReduxActions.OPEN_PRODUCT_MODAL,
        payload: { productId: e.target.dataset["productId"] },
      });
    }
  });

  // Copyright logic
  const $copyrightYear = document.querySelector("#copyright-year");
  if ($copyrightYear) {
    const d = new Date();
    $copyrightYear.innerHTML = d.getFullYear().toString();
  }

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

  // Catalog filters accordion
  const $catalogFilters = document.querySelectorAll(".catalog-filter-form");

  $catalogFilters.forEach($cf => {
    const $titles = $cf.querySelectorAll(".title");

    $titles.forEach($t => {
      $t.addEventListener("click", ({ target: $t }) => {
        const $labels = $cf.querySelectorAll(".catalog-filter-property");
        const $arrow = $t.querySelector(".arrow");

        $cf.classList.toggle("closed")
        $arrow.classList.toggle("up", !$cf.classList.contains("closed"));

        $labels.forEach($l => {
          $l.classList.toggle("hidden", $cf.classList.contains("closed"));
        })
      });
    });
  })
});
