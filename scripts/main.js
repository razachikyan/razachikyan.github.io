import hayeren from "../lang/am.json" assert { type: "json" };
import ruseren from "../lang/ru.json" assert { type: "json" };
import angleren from "../lang/en.json" assert { type: "json" };
import { getImageUrlsFor } from "./imagesScript.js";

let products = document.querySelectorAll(".product__list");
let partners = getItems(document.getElementById("partners"));
let ratingArr = document.querySelectorAll(".rating");

setStars();
setPartners();
setProducts();

async function setStars() {
  await getImageUrlsFor("stars").then((res) => {
    ratingArr.forEach((rating, i) => {
      Array.from(rating.querySelectorAll("img")).forEach((star, i) => {
        if (i === 4) {
          star.setAttribute("src", res[0]);
        } else {
          star.setAttribute("src", res[1]);
        }
      });
    });
  });
}

async function setPartners() {
  await getImageUrlsFor("partners").then((res) => {
    partners.forEach((partner, i) => {
      partner.querySelector("img").setAttribute("src", res[i]);
    });
  });
}

async function setProducts() {
  await getImageUrlsFor("products").then((res) => {
    products.forEach(async (productList, i) => {
      let temp = 0;
      if (i > 0) temp = 3;
      const prods = getItems(productList);
      prods.forEach((prod, i) => {
        prod.querySelector("img").setAttribute("src", res[i + temp]);
      });
    });
  });
}
function getItems(iterable) {
  return Array.from(iterable.childNodes).filter((_, i) => i % 2 !== 0);
}
