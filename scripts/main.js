import am from "../lang/am.json" assert { type: "json" };
import ru from "../lang/ru.json" assert { type: "json" };
import en from "../lang/en.json" assert { type: "json" };
import { getImageData } from "./imagesScript.js";
import { createPagination, RadioInput, CheckboxForm } from "./catalog.js";

const starOn = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18" fill="none">
<path d="M16.4833 18L10.5397 15.0658L4.56336 17.9466L5.57574 11.5021L0.92749 6.82869L7.50252 5.77238L10.605 0L13.653 5.80439L20.2063 6.90338L15.5254 11.5448L16.4833 18Z" fill="#C89D66"/>
</svg>`;
const starOff = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
<path d="M9.87716 2.21932L11.9999 6.26319L12.2394 6.72199L12.751 6.80735L17.3339 7.57558L14.0682 10.8085L13.6981 11.1713L13.7743 11.6728L14.4383 16.1861L10.2908 14.1375L9.82273 13.9028L9.35464 14.1375L5.18537 16.1541L5.89295 11.6515L5.96915 11.15L5.60991 10.7872L2.36594 7.52223L6.94887 6.78601L7.46051 6.70065L7.69999 6.25252L9.87716 2.21932ZM9.88804 0L6.78558 5.77238L0.221436 6.81802L4.86968 11.4914L3.85729 17.936L9.82273 15.0551L15.7664 17.9893L14.8084 11.5341L19.4893 6.90338L12.9252 5.79372L9.88804 0Z" fill="#C89D66"/>
</svg>`;

let languages = {
  am,
  ru,
  en,
};

let ratingArr = document.querySelectorAll(".rating");
const burgerMob = document.getElementById("burger-mobile");
const burgerTab = document.getElementById("burger-tablet");
const mainWorkImage = document.getElementById("main-work-image");
const workImages = Array.from(document.querySelectorAll(".work__img"));
const linkImage = document.getElementById("work-image-link");
const radioButtons = document.querySelectorAll(".radio");

if (radioButtons.length && radioButtons.length > 0) {
  Array.from(radioButtons).forEach((btn) => {
    btn.onchange = () => {
      Array.from(radioButtons).forEach((btn) => {
        const custom = btn?.parentNode?.querySelector(".custom__radio");
        btn.checked
          ? custom.classList.add("radio__on")
          : custom.classList.remove("radio__on");
      });
    };
  });
}

workImages.pop();

burgerTab.addEventListener("click", () => {
  if (burgerTab.querySelector("ul")) {
    burgerTab.innerHTML = null;
  } else {
    burgerTab.append(createTabletMenu());
  }
});

burgerMob.addEventListener("click", () => {
  if (burgerMob.querySelector("ul")) {
    burgerMob.innerHTML = null;
  } else {
    burgerMob.append(createMobiletMenu());
  }
});

async function setGalleryPictures() {
  await getImageData("work-gallery").then((res) => {
    const data = res.map((item) => {
      item.description = parseResponse(item.description);
      return item;
    });

    if (mainWorkImage) {
      mainWorkImage.setAttribute(
        "src",
        data.find((item) => item.description.name === "main").url
      );
    }
    if (workImages && workImages.length > 0) {
      workImages.forEach((img, i) => {
        img.setAttribute(
          "src",
          data.find((item) => item.description.name === `work${i + 1}`).url
        );
      });
    }
    if (linkImage) {
      linkImage.setAttribute(
        "src",
        data.find((item) => item.description.name === "link").url
      );
    }
  });
}

async function setProducts() {
  await getImageData("products-home").then((res) => {
    if (res)
      fixHomeProds(res).forEach((subArr, i) => {
        const section = document.getElementById(`products${i + 1}`);
        if (section?.querySelector(`#products-list`))
          Array.from(getItems(section.querySelector(`#products-list`))).forEach(
            (item, j) => {
              if (item.querySelector("img")) {
                item.querySelector("img").setAttribute("src", subArr[j].url);
              }
              [
                ".product__ceilling",
                ".product__wall",
                ".product__floor",
              ].forEach((className, k) => {
                if (item.querySelector(className)) {
                  item.querySelector(className).textContent =
                    subArr[j].description.ceilling.substring(0, 31 - k * 5) +
                    " ...";
                }
              });
            }
          );
      });
  });
}
async function setProductsSwiper() {
  await getImageData("products-home").then((res) => {
    fixHomeProds(res).forEach((subArr, i) => {
      const section = document.getElementById(`products${i + 1}`);
      if (section?.querySelector(`#product-swiper`))
        Array.from(getItems(section.querySelector(`#product-swiper`))).forEach(
          (item, j) => {
            if (item.querySelector("img")) {
              item.querySelector("img").setAttribute("src", subArr[j].url);
            }
            [".product__ceilling", ".product__wall", ".product__floor"].forEach(
              (className, k) => {
                if (item.querySelector(className)) {
                  item.querySelector(className).textContent =
                    subArr[j].description.ceilling.substring(0, 31 - k * 5) +
                    " ...";
                }
              }
            );
          }
        );
    });
  });
}
function getItems(iterable) {
  return iterable
    ? Array.from(iterable.childNodes).filter((_, i) => i % 2 !== 0)
    : null;
}

function setPageText(language) {
  const lan = languages[language];
  Object.keys(lan).forEach((key) => {
    if (!Array.isArray(lan[key])) {
      if (typeof lan[key] === "string") {
        if (document.getElementById(key))
          document.getElementById(key).textContent = lan[key];
      }
    }
  });
}

function setStars() {
  ratingArr.forEach((rating) => {
    getItems(rating).forEach((star, i) => {
      if (i === getItems(rating).length - 1) {
        star.innerHTML = starOff;
      } else {
        star.innerHTML = starOn;
      }
    });
  });
}

function parseResponse(response) {
  response = response.replace(/&quot;/g, '"');
  const parsedResponse = JSON.parse(response);
  return parsedResponse;
}

function splitArr(arr) {
  let res = [];
  let temp = [];
  for (let i = 0; i < arr.length; ++i) {
    if (temp.length === 3) {
      res.push(temp);
      temp = [];
      temp.push(arr[i]);
    } else {
      temp.push(arr[i]);
    }
  }
  if (temp.length === 3) res.push(temp);
  res.push([...res[1]]);
  return res;
}

function fixHomeProds(res) {
  return splitArr(
    res
      .map((item) => {
        item.description = parseResponse(item.description);
        return item;
      })
      .sort((item1, item2) => {
        if (item1.type == "top" && item2.type == "top") return 0;
        else if (item1.type === item2.type) return -1;
        else if (item1.type == "bottom" && item2.type == "top") return 1;
      })
  );
}

function createTabletMenu() {
  const box = document.createElement("ul");
  box.classList.add("tablet-menu");
  [
    { title: "Our Services", href: "#" },
    { title: "Our Partners", href: "#partners" },
    { title: "Products", href: "#products1" },
    { title: "About Us", href: "#about" },
    { title: "Gallery", href: "#gallery" },
  ].forEach((obj) => {
    const item = document.createElement("li");
    item.classList.add("tablet-item");
    const link = document.createElement("a");
    link.href = obj.href;
    link.textContent = obj.title;
    item.append(link);
    box.append(item);
  });
  return box;
}

function createMobiletMenu() {
  const box = document.createElement("ul");
  box.classList.add("mobile-menu");
  [
    { title: "Our Services", href: "#" },
    { title: "Our Partners", href: "#partners" },
    { title: "Products", href: "#products1" },
    { title: "About Us", href: "#about" },
    { title: "Gallery", href: "#gallery" },
  ].forEach((obj) => {
    const item = document.createElement("li");
    item.classList.add("mobile-item");
    const link = document.createElement("a");
    link.href = obj.href;
    link.textContent = obj.title;
    item.append(link);
    box.append(item);
  });
  return box;
}

createPagination(13);
RadioInput();
CheckboxForm();
setPageText("en");
setProducts();
setStars();
setProductsSwiper();
setGalleryPictures();
