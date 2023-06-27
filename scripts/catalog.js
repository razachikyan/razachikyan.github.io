"use strict";

const initialState = {
  products: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ReduxActions.FETCHED_PRODUCTS:
      return { ...state, products: action.payload };
    default:
      return state;
  }
};

const store = Redux.createStore(reducer);

store.subscribe(() => {
  const state = store.getState();

  if (state.products.length === 0) {
    return;
  }

  const catalogList = document.querySelector(".catalog__list");

  state.products.forEach(p => {
    catalogList.insertAdjacentHTML("beforeend", RenderFunctions.renderCatalogProduct({
      id: p.id,
      server: p.server,
      secret: p.secret,
      farm: p.farm,
      description: p.description._content,
    }));
  });
});

window.addEventListener("load", async () => {
  const data = await FlickrUtils.getUserImages({ user_id: FLICKR_USER_ID, api_key: FLICKR_API_KEY });
  store.dispatch({ type: ReduxActions.FETCHED_PRODUCTS, payload: data.photos.photo });
});
