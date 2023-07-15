class FlickrUtils {
    static async getUserImages({ api_key, user_id, photoset_id }) {
        try {
            const params = new URLSearchParams({
                api_key,
                user_id,
                photoset_id,
                format: "json",
                method: "flickr.photosets.getPhotos", // flickr.people.getPhotos
                nojsoncallback: 1,
                extras: "description",
            });
            const response = await fetch(`https://api.flickr.com/services/rest?${params}`);
            return response.json();
        } catch (error) {
            console.error("IMAGES FETCHING ERROR:", error);
        }
    }

    static getImageFullUrl({ id, server, secret, farm }) {
        return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
    }
}

class RenderFunctions {
    static renderCatalogProduct({ info, imageUrl, id }) {
        const { searchParams: params } = new URL(document.location);
        const selectedLanguage = Object.values(AppLanguages).includes(params.get("lang")) ? params.get("lang") : AppLanguages.HY;
        return `
             <li class="catalog__item">
              <img src="${imageUrl}" class="product__image1" alt="product" />
              <div class="product__box">
                <div class="product__flex">
                  <h5 class="product__name">${info.name}</h5>
                  <ul class="rating">
                    <li class="star"></li>
                    <li class="star"></li>
                    <li class="star"></li>
                    <li class="star"></li>
                    <li class="star"></li>
                  </ul>
                </div>
                <div class="product__descr">
                    ${info.properties.map(p => (
                      `<div class="col">
                            <h5 class="product__key">${p.label[selectedLanguage]}:</h5>
                            <p class="product__wall">${p.content[selectedLanguage]}</p>
                        </div>`
                    )).join("")}
                    <button data-lang="en" class="btn general__btn show-more-btn hidden-as-language" data-product-id=${id}>Show More</button>
                    <button data-lang="ru" class="btn general__btn show-more-btn hidden-as-language" data-product-id=${id}>Показать больше</button>
                    <button data-lang="hy" class="btn general__btn show-more-btn hidden-as-language" data-product-id=${id}>Ավելին</button>
                </div>
              </div>
            </li>
        `;
    }

    static renderProductModal({ info, imageUrl }) {
        const { searchParams: params } = new URL(document.location);
        const selectedLanguage = Object.values(AppLanguages).includes(params.get("lang")) ? params.get("lang") : AppLanguages.HY;
        return `
            <div class="image-container">
                <img src=${imageUrl} alt=${info.name} class="product-image" />
            </div>
            <div class="description">
                <h2 class="name">${info.name}</h2>
                <div class="properties">
                    ${info.properties.map(p => (
                        `<div class="property">
                            <h4 class="label">${p.label[selectedLanguage]}:</h4>
                            <p class="property-content">${p.content[selectedLanguage]}</p>
                        </div>`
                    )).join("")}
                    <div id="product-modal-qr-code"></div>
                </div>
            </div>
            
        `;
    }
}
