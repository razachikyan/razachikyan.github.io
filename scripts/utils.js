class FlickrUtils {
    static async getUserImages({ api_key, user_id,  }) {
        try {
            const params = new URLSearchParams({
                api_key,
                user_id,
                format: "json",
                method: "flickr.people.getPhotos",
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
    static renderCatalogProduct({ info, imageUrl }) {
        return `
             <li class="catalog__item">
              <img
                src="${imageUrl}"
                class="product__image1"
                alt="product"
              />
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
                  <div class="col">
                    <h5 class="product__key">Ceilling:</h5>
                    <p class="product__ceilling">
                      Frosted stainless steel, mirror stain...
                    </p>
                  </div>
                  <div class="col">
                    <h5 class="product__key">Car wall:</h5>
                    <p class="product__wall">
                      Frosted stainless steel, mirror...
                    </p>
                  </div>
                  <div class="col">
                    <h5 class="product__key">Floor:</h5>
                    <p class="product__floor">Frosted stainless steel...</p>
                  </div>
                  <a href="" class="product__more"> Read More </a>
                </div>
              </div>
            </li>
        `;
    }
}