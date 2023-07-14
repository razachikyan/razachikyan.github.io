"use strict";

const initialState = {
  products: [],
  activeElevatorTypes: [],
  productModal: {
    isOpen: true, // false
    productId: "53005295793", // null
  },
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
    default:
      return state;
  }
};

const store = Redux.createStore(reducer);

store.subscribe(() => {
  const state = store.getState();
  console.log("STATE", state);
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
    if (product) {
      $productInfo.innerHTML = RenderFunctions.renderProductModal({
        imageUrl: FlickrUtils.getImageFullUrl({
          id: product.id,
          server: product.server,
          secret: product.secret,
          farm: product.farm
        }),
        info: JSON.parse(product.description._content.replaceAll(`&quot;`, "\"")),
      });
    }
  } else {
    $modal.style.display = "none";
    $productInfo.innerHTML = null;
    document.body.style.overflowY = "unset";
  }
});

window.addEventListener("load", async () => {
  // Fetch images
  const data = await FlickrUtils.getUserImages({ user_id: FLICKR_USER_ID, api_key: FLICKR_API_KEY });
  store.dispatch({ type: ReduxActions.FETCHED_PRODUCTS, payload: data.photos.photo });

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
});
