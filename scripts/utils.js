class FlickrUtils {
    static async getUserImages({ api_key, user_id, photoset_id }) {
        try {
            const params = new URLSearchParams({
                api_key,
                user_id,
                photoset_id,
                format: "json",
                method: "flickr.photosets.getPhotos", // flickr.people.getPhotos
                nojsoncallback: "1",
                extras: "description",
            });
            const response = await fetch(
                `https://api.flickr.com/services/rest?${params}`
            );
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
    static renderGalleryCoverImage({ imageUrl, index }) {
        return `
            <div class="item">
              <div class="zoom" data-index=${index}>
                <svg width="42" height="42" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 10a.75.75 0 0 0-.75-.75h-2v-2a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 1 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 .75-.75Z" fill="currentColor"/>
                    <path d="M10 2.75a7.25 7.25 0 0 1 5.63 11.819l4.9 4.9a.75.75 0 0 1-.976 1.134l-.084-.073-4.901-4.9A7.25 7.25 0 1 1 10 2.75Zm0 1.5a5.75 5.75 0 1 0 0 11.5 5.75 5.75 0 0 0 0-11.5Z" fill="currentColor"/>
                </svg>
              </div>
              <img src=${imageUrl} alt="gallery-image" />
            </div>
        `;
    }

    static renderGalleryModalInfoSectionContent({
        name,
        location,
        description,
    }) {
        return `
            <div class="name">
              <h3 class="title" data-lang="en">Name:</h3>
              <h3 class="title" data-lang="hy">Անվանում:</h3>
              <h3 class="title" data-lang="ru">Название:</h3>
              <p class="content">${name}</p>
            </div>
            <div class="location">
              <h3 class="title" data-lang="en">Location:</h3>
              <h3 class="title" data-lang="hy">Գտնվելու վայր:</h3>
              <h3 class="title" data-lang="ru">Локация:</h3>
              <p class="content" data-lang="en">${location["en"]}</p>
              <p class="content" data-lang="hy">${location["hy"]}</p>
              <p class="content" data-lang="ru">${location["ru"]}</p>
            </div>
            <div class="description">
              <h3 class="title" data-lang="en">Description:</h3>
              <h3 class="title" data-lang="hy">Նկարագրություն:</h3>
              <h3 class="title" data-lang="ru">Описание:</h3>
              <p class="content" data-lang="en">${description["en"]}</p>
              <p class="content" data-lang="hy">${description["hy"]}</p>
              <p class="content" data-lang="ru">${description["ru"]}</p>
            </div>
        `;
    }

    static renderHomepageLatestProduct({ info, imageUrl, id }) {
         const { searchParams: params } = new URL(document.location);
        const selectedLanguage = Object.values(AppLanguages).includes(
            params.get("lang")
        )
            ? params.get("lang")
            : AppLanguages.HY;
        return `
             <li class="catalog__item">
              <img src="${imageUrl}" class="product__image1" alt="product" />
              <div class="product__box">
                <div class="product__flex">
                  <h5 class="product__name">${info.name}</h5>
                </div>
                <div class="product__descr">
                    ${Array.isArray(info?.properties) ? (
                        info.properties
                            .map(
                                (p) =>
                                    `<div class="col">
                                        <h5 class="product__key">${p.label[selectedLanguage]}:</h5>
                                        <p class="product__wall">${p.content[selectedLanguage]}</p>
                                    </div>`
                            )
                            .join("")
                    ) : ""}                    
                </div>
                <div class="divider"></div>
                <a data-lang="en" href="./catalog.html?product-id=${id}" class="btn general__btn show-more-btn hidden-as-language">Show More</a>
                <a data-lang="ru" href="./catalog.html?product-id=${id}" class="btn general__btn show-more-btn hidden-as-language">Показать больше</a>
                <a data-lang="hy" href="./catalog.html?product-id=${id}" class="btn general__btn show-more-btn hidden-as-language">Ավելին</a>
              </div>
            </li>
        `;
    }

    static renderCatalogProduct({ info, imageUrl, id }) {
        const { searchParams: params } = new URL(document.location);
        const selectedLanguage = Object.values(AppLanguages).includes(
            params.get("lang")
        )
            ? params.get("lang")
            : AppLanguages.HY;
        return `
             <li class="catalog__item">
              <img src="${imageUrl}" class="product__image1" alt="product" />
              <div class="product__box">
                <div class="product__flex">
                  <h5 class="product__name">${info.name}</h5>
                </div>
                <div class="product__descr">
                    ${Array.isArray(info?.properties) ? (
                        info.properties
                            .map(
                                (p) =>
                                    `<div class="col">
                                                    <h5 class="product__key">${p.label[selectedLanguage]}:</h5>
                                                    <p class="product__wall">${p.content[selectedLanguage]}</p>
                                                </div>`
                            )
                            .join("")
                    ) : ""}  
                </div>
                <div class="divider"></div>
                <a data-lang="en" class="btn general__btn show-more-btn hidden-as-language">Show More</a>
                <a data-lang="ru" class="btn general__btn show-more-btn hidden-as-language">Показать больше</a>
                <a data-lang="hy" class="btn general__btn show-more-btn hidden-as-language">Ավելին</a>
              </div>
            </li>
        `;
    }

    static renderProductModal({ info, imageUrl }) {
        const { searchParams: params } = new URL(document.location);
        const selectedLanguage = Object.values(AppLanguages).includes(
            params.get("lang")
        )
            ? params.get("lang")
            : AppLanguages.HY;
        return `
            <div class="image-container">
                <img src=${imageUrl} alt=${info.name} class="product-image" />
            </div>
            <div class="description">
                <h2 class="name">${info.name}</h2>
                <div class="properties">
                    ${info.properties
                        .map(
                            (p) =>
                                `<div class="property">
                            <h4 class="label">${p.label[selectedLanguage]}:</h4>
                            <p class="property-content">${p.content[selectedLanguage]}</p>
                        </div>`
                        )
                        .join("")}
                    <div id="product-modal-qr-code"></div>
                </div>
            </div>
            
        `;
    }
}
