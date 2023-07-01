"use strict";

const initialState = {
  products: [],
  activeElevatorTypes: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ReduxActions.FETCHED_PRODUCTS:
      return { ...state, products: action.payload };
    case ReduxActions.SET_ELEVATOR_TYPES:
      return {...state, activeElevatorTypes: action.payload};
    default:
      return state;
  }
};

const store = Redux.createStore(reducer);

store.subscribe(() => {
  const state = store.getState();
  const $catalogList = document.querySelector(".catalog__list");
  $catalogList.innerHTML = null; // Remove elements for filters

  state.products.forEach(p => {
    const info = JSON.parse(p.description._content.replaceAll(`&quot;`, "\""))
    if (state.activeElevatorTypes.length === 0 || state.activeElevatorTypes.includes(info.type)) {
      $catalogList.insertAdjacentHTML("beforeend", RenderFunctions.renderCatalogProduct({
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
});
